"""
Tests pour l'authentification
"""
import pytest
from fastapi.testclient import TestClient

def test_register_new_user(client):
    """Test d'inscription d'un nouvel utilisateur"""
    user_data = {
        "username": "newuser",
        "password": "password123",
        "email": "newuser@test.com",
        "full_name": "New User"
    }
    
    response = client.post("/api/auth/register", json=user_data)
    
    assert response.status_code == 201
    data = response.json()
    assert data["success"] == True
    assert "user" in data
    assert data["user"]["email"] == user_data["email"]

def test_register_duplicate_user(client):
    """Test d'inscription avec un utilisateur déjà existant"""
    user_data = {
        "username": "duplicate",
        "password": "password123",
        "email": "duplicate@test.com",
        "full_name": "Duplicate User"
    }
    
    # Première inscription
    response1 = client.post("/api/auth/register", json=user_data)
    assert response1.status_code == 201
    
    # Tentative de duplication
    response2 = client.post("/api/auth/register", json=user_data)
    assert response2.status_code == 400

def test_login_valid_credentials(client):
    """Test de connexion avec des identifiants valides"""
    # Utiliser l'admin par défaut
    login_data = {
        "username": "admin",
        "password": "admin123"
    }
    
    response = client.post("/api/auth/login", data=login_data)
    
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert "user" in data

def test_login_invalid_credentials(client):
    """Test de connexion avec des identifiants invalides"""
    login_data = {
        "username": "admin",
        "password": "wrongpassword"
    }
    
    response = client.post("/api/auth/login", data=login_data)
    
    assert response.status_code == 401

def test_login_nonexistent_user(client):
    """Test de connexion avec un utilisateur inexistant"""
    login_data = {
        "username": "nonexistent",
        "password": "password123"
    }
    
    response = client.post("/api/auth/login", data=login_data)
    
    assert response.status_code == 401

def test_protected_route_without_token(client):
    """Test d'accès à une route protégée sans token"""
    response = client.get("/api/admin/dashboard/stats")
    
    assert response.status_code == 401

def test_protected_route_with_invalid_token(client):
    """Test d'accès à une route protégée avec un token invalide"""
    headers = {"Authorization": "Bearer invalid_token"}
    response = client.get("/api/admin/dashboard/stats", headers=headers)
    
    assert response.status_code == 401

def test_protected_route_with_valid_token(client, admin_token, auth_headers):
    """Test d'accès à une route protégée avec un token valide"""
    if admin_token:
        headers = auth_headers(admin_token)
        response = client.get("/api/admin/dashboard/stats", headers=headers)
        
        # Devrait réussir ou être forbidden (mais pas unauthorized)
        assert response.status_code in [200, 403]

def test_user_profile_access(client, admin_token, auth_headers):
    """Test d'accès au profil utilisateur"""
    if admin_token:
        headers = auth_headers(admin_token)
        response = client.get("/api/auth/me", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        assert "email" in data
        assert "role" in data

@pytest.mark.parametrize("password", [
    "123",          # Trop court
    "password",     # Pas de chiffres
    "12345678",     # Pas de lettres
])
def test_register_weak_passwords(client, password):
    """Test d'inscription avec des mots de passe faibles"""
    user_data = {
        "username": f"user_{password}",
        "password": password,
        "email": f"user_{password}@test.com",
        "full_name": "Test User"
    }
    
    response = client.post("/api/auth/register", json=user_data)
    
    # Devrait échouer avec un mot de passe faible
    # (Si la validation est implémentée)
    assert response.status_code in [400, 422]

def test_token_expiration_handling(client):
    """Test de gestion de l'expiration des tokens"""
    # Ce test nécessiterait de créer un token expiré
    # ou de modifier la configuration pour des tokens très courts
    pass

def test_refresh_token_functionality(client):
    """Test de la fonctionnalité de rafraîchissement des tokens"""
    # À implémenter si la fonctionnalité de refresh token existe
    pass