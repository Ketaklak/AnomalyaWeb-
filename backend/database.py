from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional
import os
from datetime import datetime

class Database:
    client: Optional[AsyncIOMotorClient] = None
    database = None

db = Database()

async def get_database():
    return db.database

async def connect_to_mongo():
    """Create database connection"""
    mongo_url = os.environ.get('MONGO_URL')
    db_name = os.environ.get('DB_NAME', 'anomalya_db')
    
    db.client = AsyncIOMotorClient(mongo_url)
    db.database = db.client[db_name]
    
    print(f"Connected to MongoDB: {db_name}")

async def close_mongo_connection():
    """Close database connection"""
    if db.client:
        db.client.close()
        print("Disconnected from MongoDB")

# Collection helpers
async def get_collection(collection_name: str):
    database = await get_database()
    return database[collection_name]

# CRUD helpers
async def create_document(collection_name: str, document: dict):
    collection = await get_collection(collection_name)
    document['created_at'] = datetime.utcnow()
    document['updated_at'] = datetime.utcnow()
    result = await collection.insert_one(document)
    return str(result.inserted_id)

async def get_document(collection_name: str, document_id: str):
    collection = await get_collection(collection_name)
    return await collection.find_one({"id": document_id})

async def get_documents(collection_name: str, filter_dict: dict = None, 
                       skip: int = 0, limit: int = 100, sort_field: str = None, sort_direction: int = -1):
    collection = await get_collection(collection_name)
    
    if filter_dict is None:
        filter_dict = {}
    
    cursor = collection.find(filter_dict)
    
    if sort_field:
        cursor = cursor.sort(sort_field, sort_direction)
    
    cursor = cursor.skip(skip).limit(limit)
    
    documents = await cursor.to_list(length=limit)
    total = await collection.count_documents(filter_dict)
    
    return documents, total

async def update_document(collection_name: str, document_id: str, update_dict: dict):
    collection = await get_collection(collection_name)
    update_dict['updated_at'] = datetime.utcnow()
    result = await collection.update_one(
        {"id": document_id}, 
        {"$set": update_dict}
    )
    return result.modified_count > 0

async def delete_document(collection_name: str, document_id: str):
    collection = await get_collection(collection_name)
    result = await collection.delete_one({"id": document_id})
    return result.deleted_count > 0

async def search_documents(collection_name: str, search_query: str, 
                          search_fields: list, skip: int = 0, limit: int = 100):
    collection = await get_collection(collection_name)
    
    # Create text search query
    search_conditions = []
    for field in search_fields:
        search_conditions.append({
            field: {"$regex": search_query, "$options": "i"}
        })
    
    filter_dict = {"$or": search_conditions} if search_conditions else {}
    
    cursor = collection.find(filter_dict).sort("created_at", -1).skip(skip).limit(limit)
    documents = await cursor.to_list(length=limit)
    total = await collection.count_documents(filter_dict)
    
    return documents, total