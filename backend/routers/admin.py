from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
import sys
from pathlib import Path

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