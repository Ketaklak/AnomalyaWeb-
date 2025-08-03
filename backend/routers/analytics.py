from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Optional
import sys
from pathlib import Path
from datetime import datetime, timedelta
import random

# Add backend directory to path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from models import ApiResponse
from database import get_documents
from auth import get_current_admin_or_moderator

router = APIRouter(prefix="/api/admin/analytics", tags=["analytics"])

@router.get("/overview")
async def get_analytics_overview(
    time_range: str = Query("7d", regex="^(7d|30d|90d)$"),
    current_user=Depends(get_current_admin_or_moderator)
):
    """Get analytics overview with growth metrics"""
    try:
        # Calculate date range
        days = int(time_range[:-1])
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        
        # Get actual data from database
        users, total_users = await get_documents("users", {}, limit=1000)
        articles, total_articles = await get_documents("articles", {}, limit=1000)
        contacts, total_contacts = await get_documents("contacts", {}, limit=1000)
        quotes, total_quotes = await get_documents("quotes", {}, limit=1000)
        
        # Simulate growth percentages (replace with real calculation)
        growth_users = random.uniform(-10, 25)
        growth_articles = random.uniform(-5, 20)
        growth_contacts = random.uniform(-8, 15)
        growth_quotes = random.uniform(-3, 30)
        
        return {
            "success": True,
            "data": {
                "overview": {
                    "totalUsers": total_users,
                    "totalArticles": total_articles,
                    "totalContacts": total_contacts,
                    "totalQuotes": total_quotes,
                    "growth": {
                        "users": round(growth_users, 1),
                        "articles": round(growth_articles, 1),
                        "contacts": round(growth_contacts, 1),
                        "quotes": round(growth_quotes, 1)
                    }
                },
                "timeRange": time_range
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching analytics overview: {str(e)}")

@router.get("/user-activity")
async def get_user_activity(
    time_range: str = Query("7d", regex="^(7d|30d|90d)$"),
    current_user=Depends(get_current_admin_or_moderator)
):
    """Get user activity data over time"""
    try:
        days = int(time_range[:-1])
        activity_data = []
        
        for i in range(days):
            date = datetime.now() - timedelta(days=days-1-i)
            # Simulate activity data (replace with real analytics)
            users = random.randint(20, 80)
            sessions = random.randint(users, users + 50)
            
            activity_data.append({
                "date": date.strftime("%Y-%m-%d"),
                "users": users,
                "sessions": sessions
            })
        
        return {
            "success": True,
            "data": {
                "userActivity": activity_data,
                "timeRange": time_range
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching user activity: {str(e)}")

@router.get("/content-performance")
async def get_content_performance(
    limit: int = Query(10, ge=1, le=50),
    current_user=Depends(get_current_admin_or_moderator)
):
    """Get content performance metrics"""
    try:
        # Get articles from database
        articles, _ = await get_documents("articles", {}, limit=limit, sort_field="date", sort_direction=-1)
        
        performance_data = []
        for article in articles:
            # Simulate performance metrics (replace with real analytics)
            views = random.randint(100, 2000)
            engagement = random.randint(50, 95)
            
            performance_data.append({
                "id": article.get("id"),
                "title": article.get("title", "Article sans titre"),
                "views": views,
                "engagement": engagement,
                "category": article.get("category", "General")
            })
        
        return {
            "success": True,
            "data": {
                "contentPerformance": performance_data
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching content performance: {str(e)}")

@router.get("/traffic-sources")
async def get_traffic_sources(
    time_range: str = Query("7d", regex="^(7d|30d|90d)$"),
    current_user=Depends(get_current_admin_or_moderator)
):
    """Get traffic sources distribution"""
    try:
        # Simulate traffic sources (replace with real analytics integration)
        traffic_sources = [
            {"source": "Direct", "visitors": 45.2, "color": "#3b82f6"},
            {"source": "Google", "visitors": 32.1, "color": "#10b981"},
            {"source": "Social Media", "visitors": 15.7, "color": "#f59e0b"},
            {"source": "Referral", "visitors": 7.0, "color": "#8b5cf6"}
        ]
        
        return {
            "success": True,
            "data": {
                "trafficSources": traffic_sources,
                "timeRange": time_range
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching traffic sources: {str(e)}")

@router.get("/popular-pages")
async def get_popular_pages(
    limit: int = Query(10, ge=1, le=20),
    current_user=Depends(get_current_admin_or_moderator)
):
    """Get most popular pages"""
    try:
        # Simulate popular pages data (replace with real analytics)
        popular_pages = [
            {"page": "/services", "views": random.randint(2000, 3000), "bounce": round(random.uniform(15, 35), 1)},
            {"page": "/actualites", "views": random.randint(1500, 2500), "bounce": round(random.uniform(10, 25), 1)},
            {"page": "/contact", "views": random.randint(1000, 2000), "bounce": round(random.uniform(25, 40), 1)},
            {"page": "/competences", "views": random.randint(800, 1800), "bounce": round(random.uniform(20, 35), 1)},
            {"page": "/", "views": random.randint(3000, 4000), "bounce": round(random.uniform(5, 15), 1)}
        ]
        
        # Sort by views and limit
        popular_pages.sort(key=lambda x: x["views"], reverse=True)
        popular_pages = popular_pages[:limit]
        
        return {
            "success": True,
            "data": {
                "popularPages": popular_pages
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching popular pages: {str(e)}")

@router.get("/export")
async def export_analytics(
    time_range: str = Query("30d", regex="^(7d|30d|90d)$"),
    format: str = Query("json", regex="^(json|csv)$"),
    current_user=Depends(get_current_admin_or_moderator)
):
    """Export analytics data"""
    try:
        # This would generate and return analytics export
        # For now, return success message
        return ApiResponse(
            success=True,
            message=f"Export d'analytics {format.upper()} généré pour {time_range}",
            data={
                "exportUrl": f"/exports/analytics_{time_range}_{datetime.now().strftime('%Y%m%d')}.{format}",
                "generatedAt": datetime.now().isoformat()
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error exporting analytics: {str(e)}")