"""
Script pour créer des notifications de test
"""
import asyncio
import sys
from pathlib import Path
from datetime import datetime
import uuid

# Add backend directory to path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from database import create_document

async def create_test_notifications():
    """Créer des notifications de test"""
    
    test_notifications = [
        {
            "id": str(uuid.uuid4()),
            "type": "NEW_USER",
            "title": "Nouvel utilisateur inscrit",
            "message": "Jean Dupont (jean.dupont@example.com) vient de s'inscrire sur la plateforme",
            "link": "/admin/users",
            "read": False,
            "createdAt": datetime.now().isoformat(),
            "createdBy": "system"
        },
        {
            "id": str(uuid.uuid4()),
            "type": "NEW_CONTACT",
            "title": "Nouveau message de contact",
            "message": "Marie Martin a envoyé un message: Demande d'information sur vos services de développement web",
            "link": "/admin/contacts",
            "read": False,
            "createdAt": datetime.now().isoformat(),
            "createdBy": "system"
        },
        {
            "id": str(uuid.uuid4()),
            "type": "NEW_QUOTE",
            "title": "Nouvelle demande de devis",
            "message": "Paul Durand a demandé un devis pour: Développement d'application mobile",
            "link": "/admin/quotes",
            "read": True,
            "createdAt": datetime.now().isoformat(),
            "createdBy": "system"
        },
        {
            "id": str(uuid.uuid4()),
            "type": "SYSTEM_UPDATE",
            "title": "Mise à jour système v0.5.5",
            "message": "Le système a été mis à jour avec de nouvelles fonctionnalités de gestion de contenu et notifications",
            "link": "/admin/settings",
            "read": True,
            "createdAt": datetime.now().isoformat(),
            "createdBy": "system"
        },
        {
            "id": str(uuid.uuid4()),
            "type": "NEW_TICKET",
            "title": "Nouveau ticket de support",
            "message": "Sophie Leroy a créé un ticket: Problème de connexion à son compte client",
            "link": "/admin/tickets",
            "read": False,
            "createdAt": datetime.now().isoformat(),
            "createdBy": "system"
        },
        {
            "id": str(uuid.uuid4()),
            "type": "SECURITY_ALERT",
            "title": "Alerte de sécurité",
            "message": "Détection de tentatives de connexion suspectes sur plusieurs comptes. Surveillance renforcée activée.",
            "link": "/admin/security",
            "read": False,
            "createdAt": datetime.now().isoformat(),
            "createdBy": "system"
        }
    ]
    
    try:
        for notification in test_notifications:
            await create_document("notifications", notification)
            print(f"✅ Notification créée: {notification['title']}")
        
        print(f"✅ {len(test_notifications)} notifications de test créées avec succès")
        
    except Exception as e:
        print(f"❌ Erreur lors de la création des notifications: {e}")

if __name__ == "__main__":
    asyncio.run(create_test_notifications())