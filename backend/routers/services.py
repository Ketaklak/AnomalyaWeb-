from fastapi import APIRouter, HTTPException
from models import Service, ServiceCreate, ApiResponse
from database import get_documents, get_document, create_document, update_document, delete_document
from typing import List

router = APIRouter(prefix="/api/services", tags=["services"])

@router.get("/", response_model=List[Service])
async def get_services():
    """Get all active services"""
    try:
        services, _ = await get_documents(
            "services", 
            {"active": True}, 
            limit=100,
            sort_field="created_at",
            sort_direction=1
        )
        
        service_objects = []
        for service in services:
            service.pop('_id', None)
            service_objects.append(Service(**service))
        
        return service_objects
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching services: {str(e)}")

@router.get("/{service_id}", response_model=Service)
async def get_service(service_id: str):
    """Get a specific service by ID"""
    try:
        service = await get_document("services", service_id)
        if not service:
            raise HTTPException(status_code=404, detail="Service not found")
        
        service.pop('_id', None)
        return Service(**service)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching service: {str(e)}")

@router.post("/", response_model=ApiResponse)
async def create_service(service: ServiceCreate):
    """Create a new service"""
    try:
        service_obj = Service(**service.dict())
        
        await create_document("services", service_obj.dict())
        
        return ApiResponse(
            success=True,
            message="Service créé avec succès",
            data={"id": service_obj.id}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating service: {str(e)}")

@router.put("/{service_id}", response_model=ApiResponse)
async def update_service(service_id: str, service_update: ServiceCreate):
    """Update an existing service"""
    try:
        existing_service = await get_document("services", service_id)
        if not existing_service:
            raise HTTPException(status_code=404, detail="Service not found")
        
        update_dict = service_update.dict()
        success = await update_document("services", service_id, update_dict)
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to update service")
        
        return ApiResponse(
            success=True,
            message="Service mis à jour avec succès"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating service: {str(e)}")

@router.delete("/{service_id}", response_model=ApiResponse)
async def delete_service(service_id: str):
    """Delete a service (soft delete by setting active=False)"""
    try:
        existing_service = await get_document("services", service_id)
        if not existing_service:
            raise HTTPException(status_code=404, detail="Service not found")
        
        success = await update_document("services", service_id, {"active": False})
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to delete service")
        
        return ApiResponse(
            success=True,
            message="Service supprimé avec succès"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting service: {str(e)}")