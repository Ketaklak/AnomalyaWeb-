from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from dotenv import load_dotenv
import os
import logging
from pathlib import Path

# Import database functions
from database import connect_to_mongo, close_mongo_connection

# Import routers
from routers import news, contact, services, testimonials, competences, faq, newsletter, auth, admin, client

# Import auth functions
from auth import init_admin_user

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    await init_admin_user()  # Initialize admin user
    logger.info("🚀 Anomalya Corp API started successfully!")
    yield
    # Shutdown
    await close_mongo_connection()
    logger.info("👋 Anomalya Corp API shutdown complete!")

# Create the main app
app = FastAPI(
    title="Anomalya Corp API",
    description="API pour le site web Anomalya Corp - Solutions technologiques innovantes",
    version="1.0.0",
    lifespan=lifespan
)

# Create a router with the /api prefix for the main endpoints
api_router = APIRouter(prefix="/api")

@api_router.get("/")
async def root():
    return {
        "message": "🚀 Bienvenue sur l'API Anomalya Corp",
        "version": "1.0.0",
        "status": "active",
        "endpoints": {
            "news": "/api/news",
            "contact": "/api/contact", 
            "services": "/api/services",
            "testimonials": "/api/testimonials",
            "competences": "/api/competences",
            "faq": "/api/faq",
            "newsletter": "/api/newsletter",
            "auth": "/api/auth",
            "admin": "/api/admin"
        }
    }

@api_router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Anomalya Corp API",
        "version": "1.0.0"
    }

# Include the main API router
app.include_router(api_router)

# Include all feature routers
app.include_router(news.router)
app.include_router(contact.router)
app.include_router(services.router)
app.include_router(testimonials.router)
app.include_router(competences.router)
app.include_router(faq.router)
app.include_router(newsletter.router)
app.include_router(auth.router)
app.include_router(admin.router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
