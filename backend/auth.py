from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
import os
from pydantic import BaseModel
from database import get_document, create_document, get_documents, update_document

# Security configuration
SECRET_KEY = os.environ.get("SECRET_KEY", "your-secret-key-change-this-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Models
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    user_id: Optional[str] = None

class User(BaseModel):
    id: str
    username: str
    email: str
    full_name: str
    role: str
    is_active: bool
    created_at: datetime
    
    # Extended fields for client system
    total_points: int = 0
    available_points: int = 0
    loyalty_tier: str = "bronze"

class UserCreate(BaseModel):
    username: str
    email: str
    full_name: str
    password: str
    role: str = "client_standard"

class UserLogin(BaseModel):
    username: str
    password: str

class UserInDB(User):
    hashed_password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None
    total_points: Optional[int] = None
    available_points: Optional[int] = None
    loyalty_tier: Optional[str] = None

# Utility functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_user(username: str):
    """Get user from database by username"""
    users, _ = await get_documents("users", {"username": username}, limit=1)
    if users:
        user_data = users[0]
        user_data.pop('_id', None)
        return UserInDB(**user_data)
    return None

async def get_user_by_id(user_id: str):
    """Get user from database by ID"""
    user_data = await get_document("users", user_id)
    if user_data:
        user_data.pop('_id', None)
        return UserInDB(**user_data)
    return None

async def authenticate_user(username: str, password: str):
    """Authenticate user credentials"""
    user = await get_user(username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current user from JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        user_id: str = payload.get("user_id")
        if username is None or user_id is None:
            raise credentials_exception
        token_data = TokenData(username=username, user_id=user_id)
    except JWTError:
        raise credentials_exception
    
    user = await get_user_by_id(token_data.user_id)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: UserInDB = Depends(get_current_user)):
    """Get current active user"""
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

async def get_current_admin(current_user: UserInDB = Depends(get_current_active_user)):
    """Get current admin user"""
    if current_user.role not in ["admin", "moderator"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user

async def get_current_client(current_user: UserInDB = Depends(get_current_active_user)):
    """Get current client user (any client role) - admins have access for supervision"""
    if (not current_user.role.startswith("client") and 
        current_user.role not in ["prospect", "admin", "moderator"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Client access required"
        )
    return current_user

async def get_current_premium_client(current_user: UserInDB = Depends(get_current_active_user)):
    """Get current premium client user"""
    if current_user.role != "client_premium":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Premium client access required"
        )
    return current_user

def get_loyalty_tier(points: int) -> str:
    """Calculate loyalty tier based on points"""
    if points >= 5000:
        return "platinum"
    elif points >= 2000:
        return "gold"
    elif points >= 500:
        return "silver"
    else:
        return "bronze"

def get_next_tier_points(current_tier: str, current_points: int) -> int:
    """Get points needed for next tier"""
    tiers = {
        "bronze": 500,
        "silver": 2000,
        "gold": 5000
    }
    
    for tier, required_points in tiers.items():
        if required_points > current_points:
            return required_points - current_points
    
    # Already at highest tier (platinum)
    return 0

async def create_user(user: UserCreate):
    """Create a new user"""
    # Check if user already exists
    existing_user = await get_user(user.username)
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username already registered"
        )
    
    # Check if email already exists
    users, _ = await get_documents("users", {"email": user.email}, limit=1)
    if users:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    # Create user
    import uuid
    user_data = {
        "id": str(uuid.uuid4()),
        "username": user.username,
        "email": user.email,
        "full_name": user.full_name,
        "hashed_password": get_password_hash(user.password),
        "role": user.role,
        "is_active": True,
        "created_at": datetime.utcnow(),
        # Extended fields for loyalty system
        "total_points": 0,
        "available_points": 0,
        "loyalty_tier": "bronze"
    }
    
    await create_document("users", user_data)
    
    # Create system notification for new user
    try:
        from routers.notifications import notify_new_user
        await notify_new_user(user_data['full_name'], user_data['email'])
    except Exception as e:
        print(f"System notification failed: {str(e)}")
        # Don't fail the request if notification fails
    
    # Return user without password
    user_data.pop('hashed_password')
    return User(**user_data)

async def update_user_points(user_id: str, points_to_add: int, description: str, created_by: str = None):
    """Update user loyalty points and create transaction record"""
    from models import PointTransaction
    
    # Get current user
    user = await get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Calculate new points
    new_total = user.total_points + points_to_add
    new_available = max(0, user.available_points + points_to_add)
    
    # Calculate new loyalty tier
    new_tier = get_loyalty_tier(new_total)
    
    # Update user
    update_data = {
        "total_points": new_total,
        "available_points": new_available,
        "loyalty_tier": new_tier
    }
    
    await update_document("users", user_id, update_data)
    
    # Create transaction record
    transaction = PointTransaction(
        user_id=user_id,
        points=points_to_add,
        transaction_type="earned" if points_to_add > 0 else "spent",
        description=description,
        created_by=created_by
    )
    
    await create_document("point_transactions", transaction.dict())
    
    return new_total, new_available, new_tier

async def init_admin_user():
    """Initialize default admin user if none exists"""
    try:
        # Check if any admin exists
        users, count = await get_documents("users", {"role": "admin"}, limit=1)
        
        if count == 0:
            # Create default admin
            admin_data = UserCreate(
                username="admin",
                email="admin@anomalya.fr",
                full_name="Administrateur",
                password="admin123",  # Change this in production!
                role="admin"
            )
            
            await create_user(admin_data)
            print("✅ Default admin user created: admin/admin123")
        else:
            print("✅ Admin user already exists")
            
    except Exception as e:
        print(f"❌ Error initializing admin user: {str(e)}")