from fastapi import APIRouter, HTTPException
from models import NewsletterSubscription, ApiResponse
from database import get_documents, create_document, update_document
from typing import List
from pydantic import BaseModel, EmailStr

router = APIRouter(prefix="/api/newsletter", tags=["newsletter"])

class NewsletterSubscriptionRequest(BaseModel):
    email: EmailStr

@router.post("/subscribe", response_model=ApiResponse)
async def subscribe_newsletter(subscription: NewsletterSubscriptionRequest):
    """Subscribe to newsletter"""
    try:
        # Check if email already exists
        existing_subs, _ = await get_documents("newsletter", {"email": subscription.email}, limit=1)
        
        if existing_subs:
            # Reactivate if was unsubscribed
            if not existing_subs[0].get('active', True):
                await update_document("newsletter", existing_subs[0]['id'], {"active": True})
                return ApiResponse(
                    success=True,
                    message="Réabonnement effectué avec succès !"
                )
            else:
                return ApiResponse(
                    success=False,
                    message="Cette adresse email est déjà abonnée à notre newsletter."
                )
        
        # Create new subscription
        subscription_obj = NewsletterSubscription(email=subscription.email)
        await create_document("newsletter", subscription_obj.dict())
        
        return ApiResponse(
            success=True,
            message="Abonnement effectué avec succès ! Merci pour votre intérêt.",
            data={"id": subscription_obj.id}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error subscribing to newsletter: {str(e)}")

@router.post("/unsubscribe", response_model=ApiResponse)
async def unsubscribe_newsletter(subscription: NewsletterSubscriptionRequest):
    """Unsubscribe from newsletter"""
    try:
        # Find subscription
        existing_subs, _ = await get_documents("newsletter", {"email": subscription.email}, limit=1)
        
        if not existing_subs:
            return ApiResponse(
                success=False,
                message="Cette adresse email n'est pas abonnée à notre newsletter."
            )
        
        # Deactivate subscription
        await update_document("newsletter", existing_subs[0]['id'], {"active": False})
        
        return ApiResponse(
            success=True,
            message="Désabonnement effectué avec succès."
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error unsubscribing from newsletter: {str(e)}")

@router.get("/", response_model=List[NewsletterSubscription])
async def get_newsletter_subscriptions():
    """Get all active newsletter subscriptions (admin endpoint)"""
    try:
        subscriptions, _ = await get_documents(
            "newsletter", 
            {"active": True}, 
            limit=1000,
            sort_field="subscribed_at",
            sort_direction=-1
        )
        
        subscription_objects = []
        for sub in subscriptions:
            sub.pop('_id', None)
            subscription_objects.append(NewsletterSubscription(**sub))
        
        return subscription_objects
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching newsletter subscriptions: {str(e)}")

@router.get("/stats")
async def get_newsletter_stats():
    """Get newsletter subscription statistics"""
    try:
        active_subs, active_count = await get_documents("newsletter", {"active": True}, limit=1000)
        all_subs, total_count = await get_documents("newsletter", {}, limit=1000)
        
        return {
            "active_subscriptions": active_count,
            "total_subscriptions": total_count,
            "unsubscribed": total_count - active_count
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching newsletter stats: {str(e)}")