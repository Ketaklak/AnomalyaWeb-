from fastapi import APIRouter, HTTPException
import sys
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from models import Competence, CompetenceCreate, ApiResponse
from database import get_documents, get_document, create_document, update_document, delete_document
from typing import List

router = APIRouter(prefix="/api/competences", tags=["competences"])

@router.get("/", response_model=List[Competence])
async def get_competences():
    """Get all competences"""
    try:
        competences, _ = await get_documents(
            "competences", 
            {}, 
            limit=100,
            sort_field="category",
            sort_direction=1
        )
        
        competence_objects = []
        for competence in competences:
            competence.pop('_id', None)
            competence_objects.append(Competence(**competence))
        
        return competence_objects
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching competences: {str(e)}")

@router.get("/by-category")
async def get_competences_by_category():
    """Get competences grouped by category"""
    try:
        competences, _ = await get_documents("competences", {}, limit=100)
        
        grouped = {}
        for comp in competences:
            comp.pop('_id', None)
            category = comp.get('category', 'Other')
            if category not in grouped:
                grouped[category] = []
            grouped[category].append(Competence(**comp))
        
        return grouped
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching competences: {str(e)}")

@router.post("/", response_model=ApiResponse)
async def create_competence(competence: CompetenceCreate):
    """Create a new competence"""
    try:
        competence_obj = Competence(**competence.dict())
        
        await create_document("competences", competence_obj.dict())
        
        return ApiResponse(
            success=True,
            message="Compétence créée avec succès",
            data={"id": competence_obj.id}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating competence: {str(e)}")

@router.put("/{competence_id}", response_model=ApiResponse)
async def update_competence(competence_id: str, competence_update: CompetenceCreate):
    """Update an existing competence"""
    try:
        existing_competence = await get_document("competences", competence_id)
        if not existing_competence:
            raise HTTPException(status_code=404, detail="Competence not found")
        
        update_dict = competence_update.dict()
        success = await update_document("competences", competence_id, update_dict)
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to update competence")
        
        return ApiResponse(
            success=True,
            message="Compétence mise à jour avec succès"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating competence: {str(e)}")

@router.delete("/{competence_id}", response_model=ApiResponse)
async def delete_competence(competence_id: str):
    """Delete a competence"""
    try:
        existing_competence = await get_document("competences", competence_id)
        if not existing_competence:
            raise HTTPException(status_code=404, detail="Competence not found")
        
        success = await delete_document("competences", competence_id)
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to delete competence")
        
        return ApiResponse(
            success=True,
            message="Compétence supprimée avec succès"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting competence: {str(e)}")