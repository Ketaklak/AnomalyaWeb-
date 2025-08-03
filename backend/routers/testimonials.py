from fastapi import APIRouter, HTTPException
import sys
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from models import Testimonial, TestimonialCreate, ApiResponse
from database import get_documents, get_document, create_document, update_document, delete_document
from typing import List

router = APIRouter(prefix="/api/testimonials", tags=["testimonials"])

@router.get("/", response_model=List[Testimonial])
async def get_testimonials():
    """Get all active testimonials"""
    try:
        testimonials, _ = await get_documents(
            "testimonials", 
            {"active": True}, 
            limit=100,
            sort_field="created_at",
            sort_direction=-1
        )
        
        testimonial_objects = []
        for testimonial in testimonials:
            testimonial.pop('_id', None)
            testimonial_objects.append(Testimonial(**testimonial))
        
        return testimonial_objects
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching testimonials: {str(e)}")

@router.post("/", response_model=ApiResponse)
async def create_testimonial(testimonial: TestimonialCreate):
    """Create a new testimonial"""
    try:
        testimonial_obj = Testimonial(**testimonial.dict())
        
        await create_document("testimonials", testimonial_obj.dict())
        
        return ApiResponse(
            success=True,
            message="Témoignage créé avec succès",
            data={"id": testimonial_obj.id}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating testimonial: {str(e)}")

@router.put("/{testimonial_id}", response_model=ApiResponse)
async def update_testimonial(testimonial_id: str, testimonial_update: TestimonialCreate):
    """Update an existing testimonial"""
    try:
        existing_testimonial = await get_document("testimonials", testimonial_id)
        if not existing_testimonial:
            raise HTTPException(status_code=404, detail="Testimonial not found")
        
        update_dict = testimonial_update.dict()
        success = await update_document("testimonials", testimonial_id, update_dict)
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to update testimonial")
        
        return ApiResponse(
            success=True,
            message="Témoignage mis à jour avec succès"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating testimonial: {str(e)}")

@router.delete("/{testimonial_id}", response_model=ApiResponse)
async def delete_testimonial(testimonial_id: str):
    """Delete a testimonial (soft delete)"""
    try:
        existing_testimonial = await get_document("testimonials", testimonial_id)
        if not existing_testimonial:
            raise HTTPException(status_code=404, detail="Testimonial not found")
        
        success = await update_document("testimonials", testimonial_id, {"active": False})
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to delete testimonial")
        
        return ApiResponse(
            success=True,
            message="Témoignage supprimé avec succès"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting testimonial: {str(e)}")