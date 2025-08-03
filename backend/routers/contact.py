from fastapi import APIRouter, HTTPException
import sys
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from models import Contact, ContactCreate, ApiResponse
from database import create_document, get_documents
from typing import List
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

router = APIRouter(prefix="/api/contact", tags=["contact"])

async def send_email_notification(contact_data: dict):
    """Send email notification for new contact"""
    try:
        # Get SMTP configuration from environment
        smtp_server = os.environ.get('SMTP_SERVER', 'localhost')
        smtp_port = int(os.environ.get('SMTP_PORT', '587'))
        smtp_username = os.environ.get('SMTP_USERNAME', '')
        smtp_password = os.environ.get('SMTP_PASSWORD', '')
        admin_email = os.environ.get('ADMIN_EMAIL', 'admin@anomalya.fr')
        
        if not smtp_username or not smtp_password:
            print("SMTP credentials not configured, skipping email notification")
            return
        
        # Create message
        msg = MIMEMultipart()
        msg['From'] = smtp_username
        msg['To'] = admin_email
        msg['Subject'] = f"Nouveau message de contact - {contact_data['sujet']}"
        
        # Email body
        body = f"""
Nouveau message reçu via le formulaire de contact :

Nom: {contact_data['nom']}
Email: {contact_data['email']}
Sujet: {contact_data['sujet']}
Service concerné: {contact_data['service']}

Message:
{contact_data['message']}

---
Message reçu le {contact_data['created_at']}
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        # Send email
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_username, smtp_password)
        text = msg.as_string()
        server.sendmail(smtp_username, admin_email, text)
        server.quit()
        
        print(f"Email notification sent for contact from {contact_data['email']}")
        
    except Exception as e:
        print(f"Failed to send email notification: {str(e)}")

@router.post("/", response_model=ApiResponse)
async def create_contact(contact: ContactCreate):
    """Create a new contact message"""
    try:
        contact_obj = Contact(**contact.dict())
        contact_dict = contact_obj.dict()
        
        # Save to database
        await create_document("contacts", contact_dict)
        
        # Send email notification (non-blocking)
        try:
            await send_email_notification(contact_dict)
        except Exception as e:
            print(f"Email notification failed: {str(e)}")
            # Don't fail the request if email fails
        
        return ApiResponse(
            success=True,
            message="Message envoyé avec succès. Nous vous répondrons dans les plus brefs délais.",
            data={"id": contact_obj.id}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating contact: {str(e)}")

@router.get("/", response_model=List[Contact])
async def get_contacts(
    limit: int = 50,
    offset: int = 0
):
    """Get all contact messages (admin endpoint)"""
    try:
        contacts, total = await get_documents(
            "contacts", 
            {}, 
            skip=offset, 
            limit=limit,
            sort_field="created_at",
            sort_direction=-1
        )
        
        contact_objects = []
        for contact in contacts:
            contact.pop('_id', None)
            contact_objects.append(Contact(**contact))
        
        return contact_objects
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching contacts: {str(e)}")

@router.get("/stats")
async def get_contact_stats():
    """Get contact statistics"""
    try:
        contacts, total = await get_documents("contacts", {}, limit=1000)
        
        # Count by status
        status_counts = {}
        service_counts = {}
        
        for contact in contacts:
            status = contact.get('status', 'nouveau')
            service = contact.get('service', 'autre')
            
            status_counts[status] = status_counts.get(status, 0) + 1
            service_counts[service] = service_counts.get(service, 0) + 1
        
        return {
            "total": total,
            "by_status": status_counts,
            "by_service": service_counts
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching contact stats: {str(e)}")