#!/usr/bin/env python3
"""
Script d'initialisation de la base de données pour Anomalya Corp
"""
import asyncio
import sys
import os
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from database import connect_to_mongo, close_mongo_connection, get_documents
from seed_data import seed_all_data

async def init_database():
    """Initialize the database with seed data"""
    try:
        print("🔗 Connecting to MongoDB...")
        await connect_to_mongo()
        
        # Check if data already exists
        articles, article_count = await get_documents("articles", {}, limit=1)
        
        if article_count > 0:
            print(f"📚 Database already contains {article_count} articles")
            response = input("Do you want to reset and seed the database? (y/N): ")
            if response.lower() != 'y':
                print("❌ Database initialization cancelled")
                return
        
        print("🌱 Seeding database with initial data...")
        await seed_all_data()
        
        print("✅ Database initialization completed successfully!")
        
    except Exception as e:
        print(f"❌ Error initializing database: {str(e)}")
    finally:
        await close_mongo_connection()

if __name__ == "__main__":
    print("🚀 Anomalya Corp - Database Initialization")
    print("=" * 50)
    asyncio.run(init_database())