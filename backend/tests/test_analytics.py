"""
Tests pour les analytics
"""
import pytest
from fastapi.testclient import TestClient

def test_analytics_overview_without_auth(client):
    """Test d'accès aux analytics sans authentification"""
    response = client.get("/api/admin/analytics/overview")
    
    assert response.status_code == 401

def test_analytics_overview_with_auth(client, admin_token, auth_headers):
    """Test de récupération de la vue d'ensemble analytics"""
    if admin_token:
        headers = auth_headers(admin_token)
        response = client.get("/api/admin/analytics/overview", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "data" in data
        assert "overview" in data["data"]
        
        overview = data["data"]["overview"]
        assert "totalUsers" in overview
        assert "totalArticles" in overview
        assert "totalContacts" in overview
        assert "totalQuotes" in overview
        assert "growth" in overview

def test_analytics_overview_different_time_ranges(client, admin_token, auth_headers):
    """Test des analytics avec différentes plages de temps"""
    if admin_token:
        headers = auth_headers(admin_token)
        
        for time_range in ["7d", "30d", "90d"]:
            response = client.get(f"/api/admin/analytics/overview?time_range={time_range}", headers=headers)
            
            assert response.status_code == 200
            data = response.json()
            assert data["success"] == True
            assert data["data"]["timeRange"] == time_range

def test_analytics_invalid_time_range(client, admin_token, auth_headers):
    """Test avec une plage de temps invalide"""
    if admin_token:
        headers = auth_headers(admin_token)
        response = client.get("/api/admin/analytics/overview?time_range=invalid", headers=headers)
        
        assert response.status_code == 422  # Validation error

def test_user_activity_analytics(client, admin_token, auth_headers):
    """Test des analytics d'activité utilisateur"""
    if admin_token:
        headers = auth_headers(admin_token)
        response = client.get("/api/admin/analytics/user-activity", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "userActivity" in data["data"]
        
        user_activity = data["data"]["userActivity"]
        assert isinstance(user_activity, list)
        
        if user_activity:
            activity_item = user_activity[0]
            assert "date" in activity_item
            assert "users" in activity_item
            assert "sessions" in activity_item

def test_content_performance_analytics(client, admin_token, auth_headers):
    """Test des analytics de performance du contenu"""
    if admin_token:
        headers = auth_headers(admin_token)
        response = client.get("/api/admin/analytics/content-performance", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "contentPerformance" in data["data"]
        
        content_performance = data["data"]["contentPerformance"]
        assert isinstance(content_performance, list)
        
        if content_performance:
            content_item = content_performance[0]
            assert "title" in content_item
            assert "views" in content_item
            assert "engagement" in content_item

def test_traffic_sources_analytics(client, admin_token, auth_headers):
    """Test des analytics des sources de trafic"""
    if admin_token:
        headers = auth_headers(admin_token)
        response = client.get("/api/admin/analytics/traffic-sources", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "trafficSources" in data["data"]
        
        traffic_sources = data["data"]["trafficSources"]
        assert isinstance(traffic_sources, list)
        assert len(traffic_sources) == 4  # Direct, Google, Social, Referral
        
        total_percentage = sum(source["visitors"] for source in traffic_sources)
        assert abs(total_percentage - 100.0) < 0.1  # Doit totaliser ~100%

def test_popular_pages_analytics(client, admin_token, auth_headers):
    """Test des analytics des pages populaires"""
    if admin_token:
        headers = auth_headers(admin_token)
        response = client.get("/api/admin/analytics/popular-pages", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "popularPages" in data["data"]
        
        popular_pages = data["data"]["popularPages"]
        assert isinstance(popular_pages, list)
        
        if popular_pages:
            page_item = popular_pages[0]
            assert "page" in page_item
            assert "views" in page_item
            assert "bounce" in page_item

def test_analytics_export(client, admin_token, auth_headers):
    """Test d'export des analytics"""
    if admin_token:
        headers = auth_headers(admin_token)
        response = client.get("/api/admin/analytics/export", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True
        assert "exportUrl" in data["data"]

def test_analytics_with_client_token(client, client_token, auth_headers):
    """Test d'accès aux analytics avec un token client (devrait échouer)"""
    if client_token:
        headers = auth_headers(client_token)
        response = client.get("/api/admin/analytics/overview", headers=headers)
        
        assert response.status_code in [401, 403]  # Non autorisé

def test_content_performance_limit(client, admin_token, auth_headers):
    """Test de la limitation du nombre d'éléments dans content performance"""
    if admin_token:
        headers = auth_headers(admin_token)
        response = client.get("/api/admin/analytics/content-performance?limit=3", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        
        content_performance = data["data"]["contentPerformance"]
        assert len(content_performance) <= 3

def test_popular_pages_limit(client, admin_token, auth_headers):
    """Test de la limitation du nombre de pages populaires"""
    if admin_token:
        headers = auth_headers(admin_token)
        response = client.get("/api/admin/analytics/popular-pages?limit=5", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        
        popular_pages = data["data"]["popularPages"]
        assert len(popular_pages) <= 5

@pytest.mark.parametrize("endpoint", [
    "/api/admin/analytics/overview",
    "/api/admin/analytics/user-activity", 
    "/api/admin/analytics/content-performance",
    "/api/admin/analytics/traffic-sources",
    "/api/admin/analytics/popular-pages"
])
def test_all_analytics_endpoints_require_auth(client, endpoint):
    """Test que tous les endpoints analytics nécessitent une authentification"""
    response = client.get(endpoint)
    assert response.status_code == 401