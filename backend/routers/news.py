from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Optional
from models import Article, ArticleCreate, ArticleUpdate, ArticleListResponse, ApiResponse
from database import get_documents, get_document, create_document, update_document, delete_document, search_documents
import re
from datetime import datetime

router = APIRouter(prefix="/api/news", tags=["news"])

@router.get("/", response_model=ArticleListResponse)
async def get_articles(
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search in title and content"),
    limit: int = Query(10, ge=1, le=50, description="Number of articles per page"),
    offset: int = Query(0, ge=0, description="Pagination offset"),
    sort: str = Query("date", regex="^(date|title)$", description="Sort by date or title")
):
    """Get all articles with optional filters"""
    try:
        filter_dict = {}
        
        # Category filter
        if category and category != "all":
            filter_dict["category"] = category
        
        # Search functionality
        if search:
            articles, total = await search_documents(
                "articles", 
                search, 
                ["title", "excerpt", "content", "tags"],
                skip=offset, 
                limit=limit
            )
        else:
            # Sort configuration
            sort_field = "date" if sort == "date" else "title"
            sort_direction = -1 if sort == "date" else 1
            
            articles, total = await get_documents(
                "articles", 
                filter_dict, 
                skip=offset, 
                limit=limit,
                sort_field=sort_field,
                sort_direction=sort_direction
            )
        
        # Convert to Article models
        article_objects = []
        for article in articles:
            article.pop('_id', None)  # Remove MongoDB _id
            article_objects.append(Article(**article))
        
        # Sort pinned articles first
        article_objects.sort(key=lambda x: (not x.isPinned, x.date), reverse=True)
        
        return ArticleListResponse(
            articles=article_objects,
            total=total,
            hasMore=(offset + limit) < total
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching articles: {str(e)}")

@router.get("/{article_id}", response_model=Article)
async def get_article(article_id: str):
    """Get a specific article by ID"""
    try:
        article = await get_document("articles", article_id)
        if not article:
            raise HTTPException(status_code=404, detail="Article not found")
        
        article.pop('_id', None)
        return Article(**article)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching article: {str(e)}")

@router.post("/", response_model=ApiResponse)
async def create_article(article: ArticleCreate):
    """Create a new article"""
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

@router.put("/{article_id}", response_model=ApiResponse)
async def update_article(article_id: str, article_update: ArticleUpdate):
    """Update an existing article"""
    try:
        # Check if article exists
        existing_article = await get_document("articles", article_id)
        if not existing_article:
            raise HTTPException(status_code=404, detail="Article not found")
        
        # Prepare update data (only non-None fields)
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

@router.delete("/{article_id}", response_model=ApiResponse)
async def delete_article(article_id: str):
    """Delete an article"""
    try:
        # Check if article exists
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

@router.get("/categories/list")
async def get_categories():
    """Get all unique categories"""
    try:
        articles, _ = await get_documents("articles", {}, limit=1000)
        categories = list(set([article.get("category", "") for article in articles if article.get("category")]))
        categories.sort()
        
        return {
            "categories": categories,
            "total": len(categories)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching categories: {str(e)}")

@router.get("/tags/list")
async def get_tags():
    """Get all unique tags"""
    try:
        articles, _ = await get_documents("articles", {}, limit=1000)
        all_tags = []
        for article in articles:
            all_tags.extend(article.get("tags", []))
        
        unique_tags = list(set(all_tags))
        unique_tags.sort()
        
        return {
            "tags": unique_tags,
            "total": len(unique_tags)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching tags: {str(e)}")