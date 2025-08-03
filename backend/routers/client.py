from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
import sys
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from auth import get_current_client, get_current_active_user, User, update_user_points
from models import (
    ClientProfile, ClientProfileCreate, ClientProfileUpdate,
    QuoteRequest, QuoteRequestCreate, QuoteRequestUpdate,
    SupportTicket, SupportTicketCreate, TicketMessage,
    ClientDashboardStats, PointTransaction, ApiResponse
)
from database import (
    get_documents, get_document, create_document, 
    update_document, delete_document, search_documents
)

router = APIRouter(prefix="/api/client", tags=["client"])

# ===== CLIENT PROFILE MANAGEMENT =====

@router.get("/profile")
async def get_client_profile(current_user: User = Depends(get_current_client)):
    """Get client profile"""
    try:
        profiles, _ = await get_documents("client_profiles", {"user_id": current_user.id}, limit=1)
        
        if profiles:
            profile_data = profiles[0]
            profile_data.pop('_id', None)
            return ClientProfile(**profile_data)
        else:
            # Return empty profile structure
            return ClientProfile(
                first_name="",
                last_name="",
                country="France",
                preferred_language="fr"
            )
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching profile: {str(e)}")

@router.post("/profile")
async def create_client_profile(
    profile: ClientProfileCreate,
    current_user: User = Depends(get_current_client)
):
    """Create or update client profile"""
    try:
        # Check if profile exists
        existing_profiles, _ = await get_documents("client_profiles", {"user_id": current_user.id}, limit=1)
        
        profile_data = profile.dict()
        profile_data["user_id"] = current_user.id
        
        if existing_profiles:
            # Update existing profile
            profile_id = existing_profiles[0]["id"]
            await update_document("client_profiles", profile_id, profile_data)
        else:
            # Create new profile
            import uuid
            profile_data["id"] = str(uuid.uuid4())
            profile_data["created_at"] = __import__('datetime').datetime.utcnow()
            await create_document("client_profiles", profile_data)
        
        return ApiResponse(
            success=True,
            message="Profil mis à jour avec succès"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving profile: {str(e)}")

@router.put("/profile")
async def update_client_profile(
    profile_update: ClientProfileUpdate,
    current_user: User = Depends(get_current_client)
):
    """Update client profile"""
    try:
        profiles, _ = await get_documents("client_profiles", {"user_id": current_user.id}, limit=1)
        
        if not profiles:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        profile_id = profiles[0]["id"]
        update_data = {k: v for k, v in profile_update.dict().items() if v is not None}
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        success = await update_document("client_profiles", profile_id, update_data)
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to update profile")
        
        return ApiResponse(
            success=True,
            message="Profil mis à jour avec succès"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating profile: {str(e)}")

# ===== CLIENT DASHBOARD =====

@router.get("/dashboard", response_model=ClientDashboardStats)
async def get_client_dashboard(current_user: User = Depends(get_current_client)):
    """Get client dashboard statistics"""
    try:
        # For admin users accessing client interface, provide default values
        if current_user.role in ["admin", "moderator"]:
            return ClientDashboardStats(
                total_points=current_user.total_points,
                available_points=current_user.available_points,
                loyalty_tier=current_user.loyalty_tier,
                next_tier_points=500 - current_user.total_points if current_user.total_points < 500 else 0,
                active_quotes=0,
                completed_projects=0,
                open_tickets=0,
                recent_transactions=[]
            )
        
        # Get recent point transactions for regular clients
        transactions, _ = await get_documents(
            "point_transactions", 
            {"user_id": current_user.id}, 
            limit=10, 
            sort_field="created_at", 
            sort_direction=-1
        )
        
        recent_transactions = []
        for trans in transactions:
            trans.pop('_id', None)
            recent_transactions.append(PointTransaction(**trans))
        
        # Get active quotes count
        active_quotes, active_count = await get_documents(
            "quote_requests", 
            {"user_id": current_user.id, "status": {"$nin": ["completed", "rejected"]}}, 
            limit=1
        )
        
        # Get completed projects count  
        completed_quotes, completed_count = await get_documents(
            "quote_requests", 
            {"user_id": current_user.id, "status": "completed"}, 
            limit=1
        )
        
        # Get open tickets count
        open_tickets, tickets_count = await get_documents(
            "support_tickets", 
            {"user_id": current_user.id, "status": {"$nin": ["resolved", "closed"]}}, 
            limit=1
        )
        
        # Calculate next tier points
        from auth import get_next_tier_points
        next_tier_points = get_next_tier_points(current_user.loyalty_tier, current_user.total_points)
        
        return ClientDashboardStats(
            total_points=current_user.total_points,
            available_points=current_user.available_points,
            loyalty_tier=current_user.loyalty_tier,
            next_tier_points=next_tier_points,
            active_quotes=active_count,
            completed_projects=completed_count,
            open_tickets=tickets_count,
            recent_transactions=recent_transactions
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching dashboard: {str(e)}")

# ===== QUOTE REQUESTS =====

@router.post("/quotes", response_model=ApiResponse)
async def create_quote_request(
    quote: QuoteRequestCreate,
    current_user: User = Depends(get_current_client)
):
    """Create a new quote request"""
    try:
        quote_data = quote.dict()
        quote_obj = QuoteRequest(**quote_data, user_id=current_user.id)
        
        await create_document("quote_requests", quote_obj.dict())
        
        return ApiResponse(
            success=True,
            message="Demande de devis créée avec succès",
            data={"id": quote_obj.id}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating quote: {str(e)}")

@router.get("/quotes", response_model=List[QuoteRequest])
async def get_client_quotes(
    status: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_client)
):
    """Get client quote requests"""
    try:
        filter_dict = {"user_id": current_user.id}
        
        if status and status != "all":
            filter_dict["status"] = status
        
        quotes, total = await get_documents(
            "quote_requests", filter_dict, skip=offset, limit=limit,
            sort_field="created_at", sort_direction=-1
        )
        
        quote_objects = []
        for quote in quotes:
            quote.pop('_id', None)
            quote_objects.append(QuoteRequest(**quote))
        
        return quote_objects
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching quotes: {str(e)}")

@router.get("/quotes/{quote_id}", response_model=QuoteRequest)
async def get_quote_request(
    quote_id: str,
    current_user: User = Depends(get_current_client)
):
    """Get specific quote request"""
    try:
        quote = await get_document("quote_requests", quote_id)
        
        if not quote:
            raise HTTPException(status_code=404, detail="Quote request not found")
        
        # Check if user owns this quote
        if quote.get("user_id") != current_user.id:
            raise HTTPException(status_code=403, detail="Access denied")
        
        quote.pop('_id', None)
        return QuoteRequest(**quote)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching quote: {str(e)}")

# ===== SUPPORT TICKETS =====

@router.post("/tickets", response_model=ApiResponse)
async def create_support_ticket(
    ticket: SupportTicketCreate,
    current_user: User = Depends(get_current_client)
):
    """Create a new support ticket"""
    try:
        ticket_data = ticket.dict()
        ticket_obj = SupportTicket(**ticket_data, user_id=current_user.id)
        
        await create_document("support_tickets", ticket_obj.dict())
        
        return ApiResponse(
            success=True,
            message="Ticket de support créé avec succès",
            data={"id": ticket_obj.id}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating ticket: {str(e)}")

@router.get("/tickets", response_model=List[SupportTicket])
async def get_client_tickets(
    status: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_client)
):
    """Get client support tickets"""
    try:
        filter_dict = {"user_id": current_user.id}
        
        if status and status != "all":
            filter_dict["status"] = status
        
        tickets, total = await get_documents(
            "support_tickets", filter_dict, skip=offset, limit=limit,
            sort_field="created_at", sort_direction=-1
        )
        
        ticket_objects = []
        for ticket in tickets:
            ticket.pop('_id', None)
            ticket_objects.append(SupportTicket(**ticket))
        
        return ticket_objects
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching tickets: {str(e)}")

@router.post("/tickets/{ticket_id}/messages", response_model=ApiResponse)
async def add_ticket_message(
    ticket_id: str,
    message: TicketMessage,
    current_user: User = Depends(get_current_client)
):
    """Add a message to support ticket"""
    try:
        ticket = await get_document("support_tickets", ticket_id)
        
        if not ticket:
            raise HTTPException(status_code=404, detail="Ticket not found")
        
        # Check if user owns this ticket
        if ticket.get("user_id") != current_user.id:
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Add message to ticket
        new_message = {
            "user_id": current_user.id,
            "user_name": current_user.full_name,
            "message": message.message,
            "timestamp": __import__('datetime').datetime.utcnow(),
            "is_admin": False
        }
        
        messages = ticket.get("messages", [])
        messages.append(new_message)
        
        await update_document("support_tickets", ticket_id, {
            "messages": messages,
            "updated_at": __import__('datetime').datetime.utcnow()
        })
        
        return ApiResponse(
            success=True,
            message="Message ajouté avec succès"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding message: {str(e)}")

# ===== LOYALTY POINTS =====

@router.get("/points/history", response_model=List[PointTransaction])
async def get_points_history(
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_client)
):
    """Get client points transaction history"""
    try:
        transactions, total = await get_documents(
            "point_transactions", 
            {"user_id": current_user.id}, 
            skip=offset, 
            limit=limit,
            sort_field="created_at", 
            sort_direction=-1
        )
        
        transaction_objects = []
        for trans in transactions:
            trans.pop('_id', None)
            transaction_objects.append(PointTransaction(**trans))
        
        return transaction_objects
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching points history: {str(e)}")