from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
import sys
from pathlib import Path
from datetime import datetime, timedelta
import uuid

# Add backend directory to path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from models import ApiResponse
from database import get_documents, create_document, update_document, delete_document

# Import auth functions directly
try:
    from auth import get_current_admin, get_current_user
    print("✅ Successfully imported auth functions")
except ImportError as e:
    print(f"❌ Failed to import auth functions: {e}")
    # Fallback - this shouldn't happen but let's be safe
    def get_current_admin():
        pass
    def get_current_user():
        pass

router = APIRouter(prefix="/api/admin/notifications", tags=["notifications"])

# Types de notifications
NOTIFICATION_TYPES = {
    "NEW_USER": {
        "title": "Nouvel utilisateur",
        "icon": "user-plus",
        "color": "blue"
    },
    "NEW_CONTACT": {
        "title": "Nouveau message de contact",
        "icon": "mail",
        "color": "green" 
    },
    "NEW_QUOTE": {
        "title": "Nouvelle demande de devis",
        "icon": "file-text",
        "color": "orange"
    },
    "NEW_TICKET": {
        "title": "Nouveau ticket de support",
        "icon": "help-circle",
        "color": "red"
    },
    "SYSTEM_UPDATE": {
        "title": "Mise à jour système",
        "icon": "settings",
        "color": "purple"
    },
    "SECURITY_ALERT": {
        "title": "Alerte de sécurité",
        "icon": "shield-alert",
        "color": "red"
    },
    "MAINTENANCE": {
        "title": "Maintenance programmée",
        "icon": "tools",
        "color": "yellow"
    }
}

@router.get("/")
async def get_notifications(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    type_filter: Optional[str] = Query(None, description="Filtrer par type"),
    read_status: Optional[str] = Query(None, description="all, read, unread"),
    current_admin = Depends(get_current_admin)
):
    """Récupérer les notifications pour l'admin"""
    try:
        # Construire le filtre
        filter_query = {}
        
        if type_filter and type_filter in NOTIFICATION_TYPES:
            filter_query["type"] = type_filter
        
        if read_status == "read":
            filter_query["read"] = True
        elif read_status == "unread":
            filter_query["read"] = False
        
        # Récupérer les notifications
        notifications, total = await get_documents(
            "notifications",
            filter_query,
            skip=(page - 1) * limit,
            limit=limit,
            sort_field="createdAt",
            sort_direction=-1  # Plus récentes d'abord
        )
        
        # Ajouter les métadonnées de type
        for notification in notifications:
            notification_type = notification.get("type", "SYSTEM_UPDATE")
            if notification_type in NOTIFICATION_TYPES:
                notification.update(NOTIFICATION_TYPES[notification_type])
        
        return ApiResponse(
            success=True,
            message="Notifications récupérées avec succès",
            data={
                "notifications": notifications,
                "total": total,
                "page": page,
                "limit": limit,
                "hasMore": (page * limit) < total
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur récupération notifications: {str(e)}")

@router.get("/unread-count")
async def get_unread_notifications_count(
    current_admin = Depends(get_current_admin)
):
    """Récupérer le nombre de notifications non lues"""
    try:
        notifications, total = await get_documents(
            "notifications",
            {"read": False},
            limit=1000  # Pour compter
        )
        
        return ApiResponse(
            success=True,
            data={"unreadCount": total}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur comptage notifications: {str(e)}")

@router.put("/{notification_id}/read")
async def mark_notification_as_read(
    notification_id: str,
    current_admin = Depends(get_current_admin)
):
    """Marquer une notification comme lue"""
    try:
        # Vérifier que la notification existe
        notifications, _ = await get_documents("notifications", {"id": notification_id}, limit=1)
        
        if not notifications:
            raise HTTPException(status_code=404, detail="Notification non trouvée")
        
        # Marquer comme lue
        await update_document("notifications", notification_id, {"read": True, "readAt": datetime.now().isoformat()})
        
        return ApiResponse(
            success=True,
            message="Notification marquée comme lue"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur mise à jour notification: {str(e)}")

@router.put("/mark-all-read")
async def mark_all_notifications_as_read(
    current_user=Depends(get_current_admin)
):
    """Marquer toutes les notifications comme lues"""
    try:
        # Récupérer toutes les notifications non lues
        unread_notifications, _ = await get_documents("notifications", {"read": False})
        
        # Marquer chacune comme lue
        for notification in unread_notifications:
            await update_document("notifications", notification["id"], {
                "read": True, 
                "readAt": datetime.now().isoformat()
            })
        
        return ApiResponse(
            success=True,
            message=f"{len(unread_notifications)} notifications marquées comme lues"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur mise à jour notifications: {str(e)}")

@router.delete("/{notification_id}")
async def delete_notification(
    notification_id: str,
    current_user=Depends(get_current_admin)
):
    """Supprimer une notification"""
    try:
        # Vérifier que la notification existe
        notifications, _ = await get_documents("notifications", {"id": notification_id}, limit=1)
        
        if not notifications:
            raise HTTPException(status_code=404, detail="Notification non trouvée")
        
        # Supprimer la notification
        await delete_document("notifications", notification_id)
        
        return ApiResponse(
            success=True,
            message="Notification supprimée"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur suppression notification: {str(e)}")

@router.delete("/")
async def delete_old_notifications(
    days: int = Query(30, ge=1, description="Supprimer les notifications plus anciennes que X jours"),
    current_user=Depends(get_current_admin)
):
    """Supprimer les anciennes notifications"""
    try:
        cutoff_date = datetime.now() - timedelta(days=days)
        
        # Récupérer les anciennes notifications
        old_notifications, _ = await get_documents(
            "notifications",
            {"createdAt": {"$lt": cutoff_date.isoformat()}}
        )
        
        # Supprimer chacune
        deleted_count = 0
        for notification in old_notifications:
            await delete_document("notifications", notification["id"])
            deleted_count += 1
        
        return ApiResponse(
            success=True,
            message=f"{deleted_count} anciennes notifications supprimées"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur suppression anciennes notifications: {str(e)}")

@router.post("/")
async def create_notification(
    type: str,
    title: str,
    message: str,
    link: Optional[str] = None,
    current_user=Depends(get_current_admin)
):
    """Créer une nouvelle notification (pour les tests ou notifications manuelles)"""
    try:
        if type not in NOTIFICATION_TYPES:
            raise HTTPException(status_code=400, detail="Type de notification invalide")
        
        notification_data = {
            "id": str(uuid.uuid4()),
            "type": type,
            "title": title,
            "message": message,
            "link": link,
            "read": False,
            "createdAt": datetime.now().isoformat(),
            "createdBy": current_user.id
        }
        
        await create_document("notifications", notification_data)
        
        # Ajouter les métadonnées de type
        notification_data.update(NOTIFICATION_TYPES[type])
        
        return ApiResponse(
            success=True,
            message="Notification créée avec succès",
            data=notification_data
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur création notification: {str(e)}")

# ===== FONCTIONS UTILITAIRES POUR CRÉER DES NOTIFICATIONS =====

async def create_system_notification(type: str, title: str, message: str, link: Optional[str] = None):
    """Fonction utilitaire pour créer des notifications système"""
    try:
        if type not in NOTIFICATION_TYPES:
            return False
        
        notification_data = {
            "id": str(uuid.uuid4()),
            "type": type,
            "title": title,
            "message": message,
            "link": link,
            "read": False,
            "createdAt": datetime.now().isoformat(),
            "createdBy": "system"
        }
        
        await create_document("notifications", notification_data)
        return True
        
    except Exception as e:
        print(f"Erreur création notification système: {e}")
        return False

# Fonctions spécialisées pour différents événements
async def notify_new_user(user_name: str, user_email: str):
    """Notifier l'inscription d'un nouvel utilisateur"""
    return await create_system_notification(
        "NEW_USER",
        "Nouvel utilisateur inscrit",
        f"{user_name} ({user_email}) vient de s'inscrire",
        "/admin/users"
    )

async def notify_new_contact(contact_name: str, subject: str):
    """Notifier un nouveau message de contact"""
    return await create_system_notification(
        "NEW_CONTACT",
        "Nouveau message de contact",
        f"{contact_name} a envoyé un message: {subject}",
        "/admin/contacts"
    )

async def notify_new_quote(client_name: str, service: str):
    """Notifier une nouvelle demande de devis"""
    return await create_system_notification(
        "NEW_QUOTE",
        "Nouvelle demande de devis",
        f"{client_name} a demandé un devis pour: {service}",
        "/admin/quotes"
    )

async def notify_new_ticket(client_name: str, subject: str):
    """Notifier un nouveau ticket de support"""
    return await create_system_notification(
        "NEW_TICKET",
        "Nouveau ticket de support",
        f"{client_name} a créé un ticket: {subject}",
        "/admin/tickets"
    )

async def notify_system_update(version: str, details: str):
    """Notifier une mise à jour système"""
    return await create_system_notification(
        "SYSTEM_UPDATE",
        f"Mise à jour vers la version {version}",
        details,
        "/admin/settings"
    )

async def notify_security_alert(alert_type: str, details: str):
    """Notifier une alerte de sécurité"""
    return await create_system_notification(
        "SECURITY_ALERT",
        f"Alerte de sécurité: {alert_type}",
        details,
        "/admin/security"
    )

async def notify_maintenance(start_time: str, duration: str):
    """Notifier une maintenance programmée"""
    return await create_system_notification(
        "MAINTENANCE",
        "Maintenance programmée",
        f"Maintenance prévue le {start_time} (durée: {duration})",
        "/admin/maintenance"
    )