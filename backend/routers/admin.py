from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from datetime import datetime
import sys
from pathlib import Path

from pydantic import BaseModel

# Add backend directory to path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from auth import get_current_admin, User
from models import (
    Article, ArticleCreate, ArticleUpdate, ArticleListResponse,
    Contact, Service, ServiceCreate, Testimonial, TestimonialCreate,
    Competence, CompetenceCreate, FAQ, FAQCreate, ApiResponse,
    QuoteRequestUpdate
)

# Pydantic model for ticket message
class TicketMessageCreate(BaseModel):
    message: str
from database import (
    get_documents, get_document, create_document, 
    update_document, delete_document, search_documents
)

router = APIRouter(prefix="/api/admin", tags=["admin"])

# Admin Dashboard Stats
@router.get("/dashboard/stats")
async def get_dashboard_stats(current_admin: User = Depends(get_current_admin)):
    """Get dashboard statistics for admin panel"""
    try:
        # Get counts for different entities
        articles, articles_count = await get_documents("articles", {}, limit=1)
        contacts, contacts_count = await get_documents("contacts", {}, limit=1)
        services, services_count = await get_documents("services", {"active": True}, limit=1)
        users, users_count = await get_documents("users", {}, limit=1)
        
        # Get recent contacts
        recent_contacts, _ = await get_documents(
            "contacts", {}, limit=5, sort_field="created_at", sort_direction=-1
        )
        
        # Get recent articles
        recent_articles, _ = await get_documents(
            "articles", {}, limit=5, sort_field="created_at", sort_direction=-1
        )
        
        return {
            "totals": {
                "articles": articles_count,
                "contacts": contacts_count,
                "services": services_count,
                "users": users_count
            },
            "recent_contacts": [
                {
                    "id": contact.get("id"),
                    "nom": contact.get("nom"),
                    "email": contact.get("email"),
                    "sujet": contact.get("sujet"),
                    "created_at": contact.get("created_at")
                } for contact in recent_contacts
            ],
            "recent_articles": [
                {
                    "id": article.get("id"),
                    "title": article.get("title"),
                    "category": article.get("category"),
                    "author": article.get("author"),
                    "created_at": article.get("created_at")
                } for article in recent_articles
            ]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching dashboard stats: {str(e)}")

# Article Management
@router.get("/articles", response_model=ArticleListResponse)
async def admin_get_articles(
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_admin: User = Depends(get_current_admin)
):
    """Get all articles for admin (including unpublished)"""
    try:
        filter_dict = {}
        
        if category and category != "all":
            filter_dict["category"] = category
        
        if search:
            articles, total = await search_documents(
                "articles", search, ["title", "excerpt", "content"], 
                skip=offset, limit=limit
            )
        else:
            articles, total = await get_documents(
                "articles", filter_dict, skip=offset, limit=limit,
                sort_field="created_at", sort_direction=-1
            )
        
        article_objects = []
        for article in articles:
            article.pop('_id', None)
            article_objects.append(Article(**article))
        
        return ArticleListResponse(
            articles=article_objects,
            total=total,
            hasMore=(offset + limit) < total
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching articles: {str(e)}")

@router.post("/articles", response_model=ApiResponse)
async def admin_create_article(
    article: ArticleCreate,
    current_admin: User = Depends(get_current_admin)
):
    """Create a new article (admin only)"""
    try:
        article_dict = article.dict()
        article_obj = Article(**article_dict)
        
        await create_document("articles", article_obj.dict())
        
        return ApiResponse(
            success=True,
            message="Article créé avec succès",
            data={"id": article_obj.id}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating article: {str(e)}")

@router.put("/articles/{article_id}", response_model=ApiResponse)
async def admin_update_article(
    article_id: str,
    article_update: ArticleUpdate,
    current_admin: User = Depends(get_current_admin)
):
    """Update an article (admin only)"""
    try:
        existing_article = await get_document("articles", article_id)
        if not existing_article:
            raise HTTPException(status_code=404, detail="Article not found")
        
        update_dict = {k: v for k, v in article_update.dict().items() if v is not None}
        
        if not update_dict:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        success = await update_document("articles", article_id, update_dict)
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to update article")
        
        return ApiResponse(
            success=True,
            message="Article mis à jour avec succès"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating article: {str(e)}")

@router.delete("/articles/{article_id}", response_model=ApiResponse)
async def admin_delete_article(
    article_id: str,
    current_admin: User = Depends(get_current_admin)
):
    """Delete an article (admin only)"""
    try:
        existing_article = await get_document("articles", article_id)
        if not existing_article:
            raise HTTPException(status_code=404, detail="Article not found")
        
        success = await delete_document("articles", article_id)
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to delete article")
        
        return ApiResponse(
            success=True,
            message="Article supprimé avec succès"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting article: {str(e)}")

# Contact Management
@router.get("/contacts", response_model=List[Contact])
async def admin_get_contacts(
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_admin: User = Depends(get_current_admin)
):
    """Get all contacts (admin only)"""
    try:
        contacts, total = await get_documents(
            "contacts", {}, skip=offset, limit=limit,
            sort_field="created_at", sort_direction=-1
        )
        
        contact_objects = []
        for contact in contacts:
            contact.pop('_id', None)
            contact_objects.append(Contact(**contact))
        
        return contact_objects
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching contacts: {str(e)}")

# Service Management
@router.get("/services", response_model=List[Service])
async def admin_get_services(current_admin: User = Depends(get_current_admin)):
    """Get all services including inactive ones (admin only)"""
    try:
        services, _ = await get_documents("services", {}, limit=100)
        
        service_objects = []
        for service in services:
            service.pop('_id', None)
            service_objects.append(Service(**service))
        
        return service_objects
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching services: {str(e)}")

@router.post("/services", response_model=ApiResponse)
async def admin_create_service(
    service: ServiceCreate,
    current_admin: User = Depends(get_current_admin)
):
    """Create a new service (admin only)"""
    try:
        service_obj = Service(**service.dict())
        await create_document("services", service_obj.dict())
        
        return ApiResponse(
            success=True,
            message="Service créé avec succès",
            data={"id": service_obj.id}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating service: {str(e)}")

# Testimonial Management
@router.get("/testimonials", response_model=List[Testimonial])
async def admin_get_testimonials(current_admin: User = Depends(get_current_admin)):
    """Get all testimonials including inactive ones (admin only)"""
    try:
        testimonials, _ = await get_documents("testimonials", {}, limit=100)
        
        testimonial_objects = []
        for testimonial in testimonials:
            testimonial.pop('_id', None)
            testimonial_objects.append(Testimonial(**testimonial))
        
        return testimonial_objects
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching testimonials: {str(e)}")

@router.post("/testimonials", response_model=ApiResponse)
async def admin_create_testimonial(
    testimonial: TestimonialCreate,
    current_admin: User = Depends(get_current_admin)
):
    """Create a new testimonial (admin only)"""
    try:
        testimonial_obj = Testimonial(**testimonial.dict())
        await create_document("testimonials", testimonial_obj.dict())
        
        return ApiResponse(
            success=True,
            message="Témoignage créé avec succès",
            data={"id": testimonial_obj.id}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating testimonial: {str(e)}")

# ===== CLIENT MANAGEMENT =====

@router.get("/clients", response_model=List[dict])
async def admin_get_clients(
    role: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_admin: User = Depends(get_current_admin)
):
    """Get all clients with their stats"""
    try:
        filter_dict = {}
        
        # Filter by role if specified
        if role and role != "all":
            filter_dict["role"] = role
        else:
            # Get all client roles
            filter_dict["role"] = {"$regex": "^client|^prospect"}
        
        if search:
            users, total = await search_documents(
                "users", search, ["username", "email", "full_name"], 
                skip=offset, limit=limit
            )
        else:
            users, total = await get_documents(
                "users", filter_dict, skip=offset, limit=limit,
                sort_field="created_at", sort_direction=-1
            )
        
        # Enrich with additional stats
        client_list = []
        for user in users:
            user.pop('_id', None)
            user.pop('hashed_password', None)
            
            # Get quotes count
            quotes, quotes_count = await get_documents(
                "quote_requests", {"user_id": user["id"]}, limit=1
            )
            
            # Get tickets count
            tickets, tickets_count = await get_documents(
                "support_tickets", {"user_id": user["id"]}, limit=1
            )
            
            user["quotes_count"] = quotes_count
            user["tickets_count"] = tickets_count
            client_list.append(user)
        
        return client_list
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching clients: {str(e)}")

@router.post("/clients/{client_id}/points", response_model=ApiResponse)
async def admin_add_client_points(
    client_id: str,
    points: int,
    description: str,
    current_admin: User = Depends(get_current_admin)
):
    """Add points to a client (admin only)"""
    try:
        from auth import update_user_points
        
        new_total, new_available, new_tier = await update_user_points(
            client_id, points, description, current_admin.id
        )
        
        return ApiResponse(
            success=True,
            message=f"Points ajoutés avec succès",
            data={
                "new_total": new_total,
                "new_available": new_available,
                "new_tier": new_tier
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding points: {str(e)}")

@router.get("/quotes", response_model=List[dict])
async def admin_get_quotes(
    status: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_admin: User = Depends(get_current_admin)
):
    """Get all quote requests (admin view)"""
    try:
        filter_dict = {}
        
        if status and status != "all":
            filter_dict["status"] = status
        
        quotes, total = await get_documents(
            "quote_requests", filter_dict, skip=offset, limit=limit,
            sort_field="created_at", sort_direction=-1
        )
        
        # Enrich with user info
        quote_list = []
        for quote in quotes:
            quote.pop('_id', None)
            
            # Get user info
            user = await get_document("users", quote["user_id"])
            if user:
                quote["client_name"] = user["full_name"]
                quote["client_email"] = user["email"]
            
            quote_list.append(quote)
        
        return quote_list
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching quotes: {str(e)}")

@router.put("/quotes/{quote_id}", response_model=ApiResponse)
async def admin_update_quote(
    quote_id: str,
    quote_update: QuoteRequestUpdate,
    current_admin: User = Depends(get_current_admin)
):
    """Update quote request (admin only)"""
    try:
        existing_quote = await get_document("quote_requests", quote_id)
        if not existing_quote:
            raise HTTPException(status_code=404, detail="Quote not found")
        
        update_dict = {k: v for k, v in quote_update.dict().items() if v is not None}
        update_dict["updated_at"] = datetime.utcnow()
        
        if not update_dict:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        success = await update_document("quote_requests", quote_id, update_dict)
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to update quote")
        
        return ApiResponse(
            success=True,
            message="Devis mis à jour avec succès"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating quote: {str(e)}")

@router.get("/tickets", response_model=List[dict])
async def admin_get_tickets(
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_admin: User = Depends(get_current_admin)
):
    """Get all support tickets (admin view)"""
    try:
        filter_dict = {}
        
        if status and status != "all":
            filter_dict["status"] = status
            
        if priority and priority != "all":
            filter_dict["priority"] = priority
        
        tickets, total = await get_documents(
            "support_tickets", filter_dict, skip=offset, limit=limit,
            sort_field="created_at", sort_direction=-1
        )
        
        # Enrich with user info
        ticket_list = []
        for ticket in tickets:
            ticket.pop('_id', None)
            
            # Get user info
            user = await get_document("users", ticket["user_id"])
            if user:
                ticket["client_name"] = user["full_name"]
                ticket["client_email"] = user["email"]
            
            ticket_list.append(ticket)
        
        return ticket_list
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching tickets: {str(e)}")

@router.post("/tickets/{ticket_id}/messages", response_model=ApiResponse)
async def admin_add_ticket_message(
    ticket_id: str,
    message_data: TicketMessageCreate,
    current_admin: User = Depends(get_current_admin)
):
    """Add admin message to support ticket"""
    try:
        ticket = await get_document("support_tickets", ticket_id)
        
        if not ticket:
            raise HTTPException(status_code=404, detail="Ticket not found")
        
        # Add admin message to ticket
        new_message = {
            "user_id": current_admin.id,
            "user_name": current_admin.full_name,
            "message": message_data.message,
            "timestamp": datetime.utcnow(),
            "is_admin": True
        }
        
        messages = ticket.get("messages", [])
        messages.append(new_message)
        
        await update_document("support_tickets", ticket_id, {
            "messages": messages,
            "updated_at": datetime.utcnow()
        })
        
        return ApiResponse(
            success=True,
            message="Réponse ajoutée avec succès"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding message: {str(e)}")

@router.get("/stats/clients", response_model=dict)
async def admin_get_client_stats(current_admin: User = Depends(get_current_admin)):
    """Get client statistics for admin dashboard"""
    try:
        # Total clients
        all_clients, total_clients = await get_documents(
            "users", {"role": {"$regex": "^client|^prospect"}}, limit=1
        )
        
        # New clients this month
        from datetime import datetime, timedelta
        month_ago = datetime.utcnow() - timedelta(days=30)
        new_clients, new_count = await get_documents(
            "users", {
                "role": {"$regex": "^client|^prospect"},
                "created_at": {"$gte": month_ago}
            }, limit=1
        )
        
        # Active clients (with recent activity)
        active_clients, active_count = await get_documents(
            "users", {
                "role": {"$regex": "^client|^prospect"},
                "is_active": True
            }, limit=1
        )
        
        # Total points distributed
        transactions, _ = await get_documents("point_transactions", {}, limit=1000)
        total_points = sum(t.get("points", 0) for t in transactions if t.get("points", 0) > 0)
        
        # Pending quotes
        pending_quotes, pending_count = await get_documents(
            "quote_requests", {"status": "pending"}, limit=1
        )
        
        # Open tickets
        open_tickets, tickets_count = await get_documents(
            "support_tickets", {"status": {"$nin": ["resolved", "closed"]}}, limit=1
        )
        
        return {
            "total_clients": total_clients,
            "new_clients_this_month": new_count,
            "active_clients": active_count,
            "total_points_distributed": total_points,
            "pending_quotes": pending_count,
            "open_tickets": tickets_count,
            "revenue_this_month": 0.0  # To be implemented with actual revenue tracking
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching client stats: {str(e)}")

# User Management (Unified with clients)
@router.get("/users")
async def admin_get_users(
    role: Optional[str] = Query(None),
    status: Optional[str] = Query(None), 
    search: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_admin: User = Depends(get_current_admin)
):
    """Get all users with filtering and search (admin only)"""
    try:
        filter_dict = {}
        
        # Role filter
        if role and role != 'all':
            if role == 'client':
                filter_dict["role"] = {"$regex": "^client|^prospect"}
            else:
                filter_dict["role"] = role
        
        # Status filter
        if status and status != 'all':
            if status == 'active':
                filter_dict["is_active"] = True
            elif status == 'inactive':
                filter_dict["is_active"] = False
        
        # Search functionality
        if search:
            users, total = await search_documents(
                "users", search, ["username", "email", "full_name"], 
                skip=offset, limit=limit
            )
        else:
            users, total = await get_documents(
                "users", filter_dict, skip=offset, limit=limit,
                sort_field="created_at", sort_direction=-1
            )
        
        # Process users to remove sensitive data and add stats
        user_list = []
        for user in users:
            user.pop('_id', None)
            user.pop('hashed_password', None)
            
            # For clients, add additional stats
            if user.get('role', '').startswith('client'):
                # Get quotes count
                quotes, quotes_count = await get_documents("quotes", {"user_id": user["id"]}, limit=1)
                user["quotes_count"] = quotes_count
                
                # Get tickets count
                tickets, tickets_count = await get_documents("tickets", {"user_id": user["id"]}, limit=1)
                user["tickets_count"] = tickets_count
                
                # Ensure points fields exist
                user["total_points"] = user.get("total_points", 0)
                user["available_points"] = user.get("available_points", 0)
                user["loyalty_tier"] = user.get("loyalty_tier", "bronze")
            
            user_list.append(user)
        
        return {
            "success": True,
            "data": user_list,
            "total": total,
            "limit": limit,
            "offset": offset
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching users: {str(e)}")

from pydantic import BaseModel

class UserCreateAdmin(BaseModel):
    username: str
    email: str
    full_name: str
    password: str
    role: str = "client"
    phone: Optional[str] = None
    address: Optional[str] = None

class UserUpdateAdmin(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    role: Optional[str] = None
    loyalty_tier: Optional[str] = None
    notes: Optional[str] = None

class UserStatusUpdate(BaseModel):
    is_active: bool

@router.post("/users")
async def admin_create_user(
    user_data: UserCreateAdmin,
    current_admin: User = Depends(get_current_admin)
):
    """Create a new user (admin only)"""
    try:
        from auth import create_user, UserCreate
        
        # Convert to UserCreate model
        new_user = UserCreate(
            username=user_data.username,
            email=user_data.email,
            full_name=user_data.full_name,
            password=user_data.password,
            role=user_data.role
        )
        
        created_user = await create_user(new_user)
        
        # Update additional fields if provided
        if user_data.phone or user_data.address:
            update_data = {}
            if user_data.phone:
                update_data["phone"] = user_data.phone
            if user_data.address:
                update_data["address"] = user_data.address
            
            if update_data:
                await update_document("users", created_user.id, update_data)
        
        return {
            "success": True,
            "message": "Utilisateur créé avec succès",
            "data": {"user_id": created_user.id}
        }
        
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating user: {str(e)}")

@router.put("/users/{user_id}")
async def admin_update_user(
    user_id: str,
    user_data: UserUpdateAdmin,
    current_admin: User = Depends(get_current_admin)
):
    """Update user information (admin only)"""
    try:
        # Get existing user
        existing_user = await get_document("users", user_id)
        if not existing_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Prepare update data
        update_data = {}
        if user_data.full_name is not None:
            update_data["full_name"] = user_data.full_name
        if user_data.email is not None:
            update_data["email"] = user_data.email
        if user_data.phone is not None:
            update_data["phone"] = user_data.phone
        if user_data.address is not None:
            update_data["address"] = user_data.address
        if user_data.role is not None:
            update_data["role"] = user_data.role
        if user_data.loyalty_tier is not None:
            update_data["loyalty_tier"] = user_data.loyalty_tier
        if user_data.notes is not None:
            update_data["notes"] = user_data.notes
        
        if update_data:
            await update_document("users", user_id, update_data)
        
        return {
            "success": True,
            "message": "Utilisateur mis à jour avec succès"
        }
        
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating user: {str(e)}")

@router.delete("/users/{user_id}")
async def admin_delete_user(
    user_id: str,
    current_admin: User = Depends(get_current_admin)
):
    """Delete a user (admin only)"""
    try:
        # Check if user exists
        existing_user = await get_document("users", user_id)
        if not existing_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Prevent admin from deleting themselves
        if user_id == current_admin.id:
            raise HTTPException(status_code=400, detail="Cannot delete your own account")
        
        # Delete user
        await delete_document("users", user_id)
        
        return {
            "success": True,
            "message": "Utilisateur supprimé avec succès"
        }
        
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting user: {str(e)}")

@router.put("/users/{user_id}/status")
async def admin_update_user_status(
    user_id: str,
    status_data: UserStatusUpdate,
    current_admin: User = Depends(get_current_admin)
):
    """Update user status (activate/deactivate) (admin only)"""
    try:
        # Check if user exists
        existing_user = await get_document("users", user_id)
        if not existing_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Prevent admin from deactivating themselves
        if user_id == current_admin.id and not status_data.is_active:
            raise HTTPException(status_code=400, detail="Cannot deactivate your own account")
        
        # Update status
        await update_document("users", user_id, {"is_active": status_data.is_active})
        
        return {
            "success": True,
            "message": f"Utilisateur {'activé' if status_data.is_active else 'désactivé'} avec succès"
        }
        
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating user status: {str(e)}")