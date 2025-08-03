from fastapi import APIRouter, HTTPException
import sys
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from models import FAQ, FAQCreate, ApiResponse
from database import get_documents, get_document, create_document, update_document, delete_document
from typing import List

router = APIRouter(prefix="/api/faq", tags=["faq"])

@router.get("/", response_model=List[FAQ])
async def get_faqs():
    """Get all active FAQs"""
    try:
        faqs, _ = await get_documents(
            "faq", 
            {"active": True}, 
            limit=100,
            sort_field="created_at",
            sort_direction=1
        )
        
        faq_objects = []
        for faq in faqs:
            faq.pop('_id', None)
            faq_objects.append(FAQ(**faq))
        
        return faq_objects
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching FAQs: {str(e)}")

@router.post("/", response_model=ApiResponse)
async def create_faq(faq: FAQCreate):
    """Create a new FAQ"""
    try:
        faq_obj = FAQ(**faq.dict())
        
        await create_document("faq", faq_obj.dict())
        
        return ApiResponse(
            success=True,
            message="FAQ créée avec succès",
            data={"id": faq_obj.id}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating FAQ: {str(e)}")

@router.put("/{faq_id}", response_model=ApiResponse)
async def update_faq(faq_id: str, faq_update: FAQCreate):
    """Update an existing FAQ"""
    try:
        existing_faq = await get_document("faq", faq_id)
        if not existing_faq:
            raise HTTPException(status_code=404, detail="FAQ not found")
        
        update_dict = faq_update.dict()
        success = await update_document("faq", faq_id, update_dict)
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to update FAQ")
        
        return ApiResponse(
            success=True,
            message="FAQ mise à jour avec succès"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating FAQ: {str(e)}")

@router.delete("/{faq_id}", response_model=ApiResponse)
async def delete_faq(faq_id: str):
    """Delete a FAQ (soft delete)"""
    try:
        existing_faq = await get_document("faq", faq_id)
        if not existing_faq:
            raise HTTPException(status_code=404, detail="FAQ not found")
        
        success = await update_document("faq", faq_id, {"active": False})
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to delete FAQ")
        
        return ApiResponse(
            success=True,
            message="FAQ supprimée avec succès"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting FAQ: {str(e)}")