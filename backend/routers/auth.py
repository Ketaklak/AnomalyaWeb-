from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
import sys
from pathlib import Path
from datetime import timedelta

# Add backend directory to path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from auth import (
    authenticate_user, create_access_token, create_refresh_token, 
    get_current_active_user, get_current_admin, create_user,
    ACCESS_TOKEN_EXPIRE_MINUTES, Token, UserCreate, UserLogin, User
)
from models import ApiResponse
from typing import List
from database import get_documents

router = APIRouter(prefix="/api/auth", tags=["authentication"])

@router.post("/register", response_model=ApiResponse)
async def register(user: UserCreate):
    """Register a new user"""
    try:
        created_user = await create_user(user)
        return ApiResponse(
            success=True,
            message="Utilisateur créé avec succès",
            data={"user_id": created_user.id}
        )
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating user: {str(e)}")

@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin):
    """Login user and return tokens"""
    user = await authenticate_user(user_credentials.username, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "user_id": user.id}, 
        expires_delta=access_token_expires
    )
    refresh_token = create_refresh_token(
        data={"sub": user.username, "user_id": user.id}
    )
    
    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer"
    )

@router.get("/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    """Get current user info"""
    return current_user

@router.get("/users", response_model=List[User])
async def get_users(
    limit: int = 50,
    offset: int = 0,
    current_admin: User = Depends(get_current_admin)
):
    """Get all users (admin only)"""
    try:
        users, total = await get_documents(
            "users", 
            {},
            skip=offset,
            limit=limit,
            sort_field="created_at",
            sort_direction=-1
        )
        
        user_objects = []
        for user in users:
            user.pop('_id', None)
            user.pop('hashed_password', None)  # Don't return password hashes
            user_objects.append(User(**user))
        
        return user_objects
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching users: {str(e)}")

@router.get("/stats")
async def get_auth_stats(current_admin: User = Depends(get_current_admin)):
    """Get authentication statistics (admin only)"""
    try:
        users, total_users = await get_documents("users", {}, limit=1000)
        
        # Count by role
        role_counts = {}
        active_count = 0
        
        for user in users:
            role = user.get('role', 'client')
            is_active = user.get('is_active', True)
            
            role_counts[role] = role_counts.get(role, 0) + 1
            if is_active:
                active_count += 1
        
        return {
            "total_users": total_users,
            "active_users": active_count,
            "inactive_users": total_users - active_count,
            "by_role": role_counts
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching auth stats: {str(e)}")

@router.post("/create-admin", response_model=ApiResponse)
async def create_admin_user(user: UserCreate, current_admin: User = Depends(get_current_admin)):
    """Create an admin user (admin only)"""
    try:
        user.role = "admin"  # Force admin role
        created_user = await create_user(user)
        return ApiResponse(
            success=True,
            message="Administrateur créé avec succès",
            data={"user_id": created_user.id}
        )
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating admin: {str(e)}")

@router.post("/refresh-token", response_model=Token)
async def refresh_access_token(current_user: User = Depends(get_current_active_user)):
    """Refresh access token"""
    try:
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": current_user.username, "user_id": current_user.id}, 
            expires_delta=access_token_expires
        )
        refresh_token = create_refresh_token(
            data={"sub": current_user.username, "user_id": current_user.id}
        )
        
        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error refreshing token: {str(e)}")