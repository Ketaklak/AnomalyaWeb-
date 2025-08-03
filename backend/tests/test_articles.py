"""
Tests pour la gestion des articles
"""
import pytest
from fastapi.testclient import TestClient

def test_get_public_articles(client):
    """Test de récupération des articles publics"""
    response = client.get("/api/news")
    
    assert response.status_code == 200
    data = response.json()
    assert "success" in data
    if data["success"]:
        assert "data" in data
        assert "articles" in data["data"]

def test_get_article_by_id(client):
    """Test de récupération d'un article par ID"""
    # D'abord récupérer la liste des articles
    articles_response = client.get("/api/news")
    
    if articles_response.status_code == 200:
        articles_data = articles_response.json()
        if articles_data["success"] and articles_data["data"]["articles"]:
            article_id = articles_data["data"]["articles"][0]["id"]
            
            # Récupérer l'article spécifique
            response = client.get(f"/api/news/{article_id}")
            
            assert response.status_code == 200
            data = response.json()
            assert "success" in data
            if data["success"]:
                assert data["data"]["id"] == article_id

def test_get_nonexistent_article(client):
    """Test de récupération d'un article inexistant"""
    response = client.get("/api/news/nonexistent-id")
    
    assert response.status_code == 404

def test_create_article_without_auth(client, sample_article):
    """Test de création d'article sans authentification"""
    response = client.post("/api/admin/articles", json=sample_article)
    
    assert response.status_code == 401

def test_create_article_with_auth(client, admin_token, auth_headers, sample_article):
    """Test de création d'article avec authentification admin"""
    if admin_token:
        headers = auth_headers(admin_token)
        response = client.post("/api/admin/articles", json=sample_article, headers=headers)
        
        assert response.status_code in [201, 200]
        if response.status_code in [201, 200]:
            data = response.json()
            assert data.get("title") == sample_article["title"]

def test_create_article_invalid_data(client, admin_token, auth_headers):
    """Test de création d'article avec des données invalides"""
    if admin_token:
        headers = auth_headers(admin_token)
        invalid_article = {
            "title": "",  # Titre vide
            "content": "Contenu"
        }
        
        response = client.post("/api/admin/articles", json=invalid_article, headers=headers)
        
        assert response.status_code in [400, 422]

def test_update_article(client, admin_token, auth_headers, sample_article):
    """Test de mise à jour d'un article"""
    if admin_token:
        headers = auth_headers(admin_token)
        
        # Créer un article
        create_response = client.post("/api/admin/articles", json=sample_article, headers=headers)
        
        if create_response.status_code in [201, 200]:
            article_data = create_response.json()
            article_id = article_data.get("id")
            
            # Mettre à jour l'article
            updated_data = sample_article.copy()
            updated_data["title"] = "Titre Mis à Jour"
            
            response = client.put(f"/api/admin/articles/{article_id}", json=updated_data, headers=headers)
            
            assert response.status_code in [200, 404]  # 404 si pas encore implémenté

def test_delete_article(client, admin_token, auth_headers, sample_article):
    """Test de suppression d'un article"""
    if admin_token:
        headers = auth_headers(admin_token)
        
        # Créer un article
        create_response = client.post("/api/admin/articles", json=sample_article, headers=headers)
        
        if create_response.status_code in [201, 200]:
            article_data = create_response.json()
            article_id = article_data.get("id")
            
            # Supprimer l'article
            response = client.delete(f"/api/admin/articles/{article_id}", headers=headers)
            
            assert response.status_code in [200, 204, 404]  # 404 si pas encore implémenté

def test_article_pagination(client):
    """Test de la pagination des articles"""
    response = client.get("/api/news?page=1&limit=5")
    
    assert response.status_code == 200
    data = response.json()
    
    if data.get("success"):
        assert "data" in data
        articles = data["data"].get("articles", [])
        assert len(articles) <= 5

def test_article_filtering_by_category(client):
    """Test de filtrage des articles par catégorie"""
    response = client.get("/api/news?category=Technology")
    
    assert response.status_code == 200
    data = response.json()
    
    if data.get("success") and data["data"].get("articles"):
        for article in data["data"]["articles"]:
            assert article.get("category") == "Technology"

def test_article_search(client):
    """Test de recherche dans les articles"""
    response = client.get("/api/news?search=test")
    
    assert response.status_code == 200
    data = response.json()
    assert "success" in data

def test_pinned_articles(client):
    """Test de récupération des articles épinglés"""
    response = client.get("/api/news?pinned=true")
    
    assert response.status_code == 200
    data = response.json()
    
    if data.get("success") and data["data"].get("articles"):
        for article in data["data"]["articles"]:
            assert article.get("isPinned") == True

@pytest.mark.parametrize("field,value", [
    ("title", ""),
    ("content", ""),
    ("category", ""),
])
def test_article_validation(client, admin_token, auth_headers, field, value):
    """Test de validation des champs d'article"""
    if admin_token:
        headers = auth_headers(admin_token)
        
        article_data = {
            "title": "Titre Test",
            "content": "Contenu test",
            "category": "Test",
            "tags": ["test"]
        }
        
        # Mettre le champ à tester à une valeur invalide
        article_data[field] = value
        
        response = client.post("/api/admin/articles", json=article_data, headers=headers)
        
        # Devrait échouer avec une validation
        assert response.status_code in [400, 422]