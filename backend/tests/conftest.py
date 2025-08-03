"""
Configuration pytest pour les tests backend
"""
import pytest
import asyncio
from fastapi.testclient import TestClient
from motor.motor_asyncio import AsyncIOMotorClient
import os
from pathlib import Path

# Ajouter le répertoire backend au path
backend_dir = Path(__file__).parent.parent
import sys
sys.path.insert(0, str(backend_dir))

from server import app
from database import get_db, get_database

# Configuration de test
TEST_DATABASE_URL = "mongodb://localhost:27017"
TEST_DATABASE_NAME = "anomalya_test_db"

@pytest.fixture(scope="session")
def event_loop():
    """Créer un event loop pour les tests async"""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="session")
async def test_db():
    """Créer une base de données de test"""
    client = AsyncIOMotorClient(TEST_DATABASE_URL)
    db = client[TEST_DATABASE_NAME]
    
    # Nettoyer la DB de test avant les tests
    await client.drop_database(TEST_DATABASE_NAME)
    
    yield db
    
    # Nettoyer après les tests
    await client.drop_database(TEST_DATABASE_NAME)
    client.close()

@pytest.fixture
def client():
    """Client de test FastAPI"""
    with TestClient(app) as test_client:
        yield test_client

@pytest.fixture
async def admin_token(client):
    """Token d'authentification admin pour les tests"""
    # Créer un utilisateur admin de test
    admin_data = {
        "username": "test_admin",
        "password": "test_password123",
        "email": "test_admin@test.com",
        "full_name": "Test Admin"
    }
    
    # Tenter de créer l'admin (peut échouer si déjà existant)
    try:
        response = client.post("/api/auth/register", json=admin_data)
    except:
        pass
    
    # Se connecter
    login_data = {
        "username": "test_admin",
        "password": "test_password123"
    }
    
    response = client.post("/api/auth/login", data=login_data)
    if response.status_code == 200:
        return response.json()["access_token"]
    
    # Fallback: utiliser l'admin par défaut
    login_data = {
        "username": "admin",
        "password": "admin123"
    }
    response = client.post("/api/auth/login", data=login_data)
    return response.json()["access_token"]

@pytest.fixture
async def client_token(client):
    """Token d'authentification client pour les tests"""
    client_data = {
        "username": "test_client",
        "password": "test_password123",
        "email": "test_client@test.com",
        "full_name": "Test Client"
    }
    
    # Créer le client
    try:
        response = client.post("/api/auth/register", json=client_data)
    except:
        pass
    
    # Se connecter
    login_data = {
        "username": "test_client",
        "password": "test_password123"
    }
    
    response = client.post("/api/auth/login", data=login_data)
    if response.status_code == 200:
        return response.json()["access_token"]
    
    return None

@pytest.fixture
def auth_headers():
    """Factory pour créer des headers d'authentification"""
    def _auth_headers(token):
        return {"Authorization": f"Bearer {token}"}
    return _auth_headers

@pytest.fixture
def sample_article():
    """Article de test"""
    return {
        "title": "Article de Test",
        "content": "Contenu de test pour l'article",
        "excerpt": "Résumé de test",
        "category": "Test",
        "tags": ["test", "article"],
        "isPinned": False,
        "isPublished": True
    }

@pytest.fixture
def sample_service():
    """Service de test"""
    return {
        "title": "Service de Test",
        "description": "Description du service de test",
        "shortDescription": "Service test",
        "category": "test",
        "features": ["Feature 1", "Feature 2"],
        "technologies": ["React", "Python"]
    }

@pytest.fixture
async def cleanup_db(test_db):
    """Nettoyer la base de données après chaque test"""
    yield
    
    # Nettoyer toutes les collections
    collections = await test_db.list_collection_names()
    for collection_name in collections:
        await test_db[collection_name].delete_many({})