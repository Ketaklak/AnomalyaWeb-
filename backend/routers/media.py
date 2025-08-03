from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends, Query
from typing import List, Optional
import sys
from pathlib import Path
import os
import uuid
import base64
import mimetypes
from datetime import datetime
import aiofiles
from PIL import Image
import io

# Add backend directory to path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from models import ApiResponse
from database import get_documents, insert_document, update_document, delete_document
from auth import get_current_admin

router = APIRouter(prefix="/api/admin/media", tags=["media"])

# Configuration
UPLOAD_DIR = Path("uploads")
THUMBNAIL_DIR = UPLOAD_DIR / "thumbnails"
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"}
ALLOWED_VIDEO_TYPES = {"video/mp4", "video/webm", "video/avi", "video/mov"}
ALLOWED_DOCUMENT_TYPES = {"application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"}

# Créer les répertoires si ils n'existent pas
UPLOAD_DIR.mkdir(exist_ok=True)
THUMBNAIL_DIR.mkdir(exist_ok=True)

def get_file_type(content_type: str) -> str:
    """Déterminer le type de fichier"""
    if content_type in ALLOWED_IMAGE_TYPES:
        return "image"
    elif content_type in ALLOWED_VIDEO_TYPES:
        return "video"
    elif content_type in ALLOWED_DOCUMENT_TYPES:
        return "document"
    else:
        return "other"

def generate_thumbnail(file_path: Path, thumbnail_path: Path, size: tuple = (300, 300)):
    """Générer une miniature pour les images"""
    try:
        with Image.open(file_path) as img:
            # Convertir en RGB si nécessaire
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            
            # Créer la miniature
            img.thumbnail(size, Image.Resampling.LANCZOS)
            img.save(thumbnail_path, "JPEG", quality=85)
            return True
    except Exception as e:
        print(f"Erreur génération miniature: {e}")
        return False

@router.get("/files")
async def get_media_files(
    folder: str = Query("", description="Dossier à filtrer"),
    file_type: str = Query("all", description="Type de fichier à filtrer"),
    search: str = Query("", description="Terme de recherche"),
    sort_by: str = Query("date", description="Trier par: date, name, size"),
    sort_order: str = Query("desc", description="Ordre: asc, desc"),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    current_user=Depends(get_current_admin)
):
    """Récupérer la liste des fichiers média"""
    try:
        # Construire le filtre
        filter_query = {}
        
        if folder:
            filter_query["folder"] = folder
        
        if file_type != "all":
            filter_query["type"] = file_type
        
        if search:
            filter_query["name"] = {"$regex": search, "$options": "i"}
        
        # Tri
        sort_field = "createdAt" if sort_by == "date" else sort_by
        sort_direction = -1 if sort_order == "desc" else 1
        
        # Récupérer les fichiers
        files, total = await get_documents(
            "media_files",
            filter_query,
            skip=(page - 1) * limit,
            limit=limit,
            sort_field=sort_field,
            sort_direction=sort_direction
        )
        
        return ApiResponse(
            success=True,
            data={
                "files": files,
                "total": total,
                "page": page,
                "limit": limit,
                "hasMore": (page * limit) < total
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur récupération fichiers: {str(e)}")

@router.post("/upload")
async def upload_media_files(
    files: List[UploadFile] = File(...),
    folder: str = Form(""),
    current_user=Depends(get_current_admin)
):
    """Uploader des fichiers média"""
    uploaded_files = []
    errors = []
    
    for file in files:
        try:
            # Validation de la taille
            content = await file.read()
            if len(content) > MAX_FILE_SIZE:
                errors.append(f"{file.filename}: Fichier trop volumineux (max {MAX_FILE_SIZE // 1024 // 1024}MB)")
                continue
            
            # Validation du type
            file_type = get_file_type(file.content_type)
            if file_type == "other":
                errors.append(f"{file.filename}: Type de fichier non autorisé")
                continue
            
            # Générer un nom unique
            file_id = str(uuid.uuid4())
            file_extension = Path(file.filename).suffix
            safe_filename = f"{file_id}{file_extension}"
            file_path = UPLOAD_DIR / safe_filename
            
            # Sauvegarder le fichier
            async with aiofiles.open(file_path, 'wb') as f:
                await f.write(content)
            
            # Générer une miniature pour les images
            thumbnail_path = None
            dimensions = None
            if file_type == "image":
                thumbnail_filename = f"thumb_{file_id}.jpg"
                thumbnail_path = THUMBNAIL_DIR / thumbnail_filename
                
                # Générer la miniature
                if generate_thumbnail(file_path, thumbnail_path):
                    thumbnail_url = f"/api/media/thumbnails/{thumbnail_filename}"
                    
                    # Obtenir les dimensions de l'image originale
                    try:
                        with Image.open(file_path) as img:
                            dimensions = {"width": img.width, "height": img.height}
                    except:
                        pass
                else:
                    thumbnail_url = f"/api/media/default-thumbnail.png"
            else:
                thumbnail_url = f"/api/media/default-{file_type}-thumbnail.png"
            
            # Métadonnées du fichier
            file_data = {
                "id": file_id,
                "name": file.filename,
                "safeName": safe_filename,
                "type": file_type,
                "contentType": file.content_type,
                "size": len(content),
                "folder": folder,
                "url": f"/api/media/files/{safe_filename}",
                "thumbnail": thumbnail_url,
                "dimensions": dimensions,
                "createdAt": datetime.now().isoformat(),
                "uploadedBy": current_user.get("id")
            }
            
            # Sauvegarder en base de données
            await insert_document("media_files", file_data)
            uploaded_files.append(file_data)
            
        except Exception as e:
            errors.append(f"{file.filename}: {str(e)}")
    
    return ApiResponse(
        success=len(uploaded_files) > 0,
        data={
            "uploaded": uploaded_files,
            "errors": errors
        },
        message=f"{len(uploaded_files)} fichier(s) uploadé(s) avec succès"
    )

@router.post("/upload-base64")
async def upload_base64_image(
    image_data: str = Form(...),
    filename: str = Form("image"),
    folder: str = Form(""),
    current_user=Depends(get_current_admin)
):
    """Uploader une image en base64 (pour l'éditeur riche)"""
    try:
        # Décoder l'image base64
        if image_data.startswith('data:'):
            # Extraire le type et les données
            header, data = image_data.split(',', 1)
            content_type = header.split(';')[0].split(':')[1]
        else:
            data = image_data
            content_type = "image/png"
        
        # Validation du type
        if content_type not in ALLOWED_IMAGE_TYPES:
            raise HTTPException(status_code=400, detail="Type d'image non autorisé")
        
        # Décoder les données
        try:
            image_bytes = base64.b64decode(data)
        except Exception:
            raise HTTPException(status_code=400, detail="Données base64 invalides")
        
        # Validation de la taille
        if len(image_bytes) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail=f"Image trop volumineuse (max {MAX_FILE_SIZE // 1024 // 1024}MB)")
        
        # Générer un nom unique
        file_id = str(uuid.uuid4())
        extension = mimetypes.guess_extension(content_type) or '.png'
        safe_filename = f"{file_id}{extension}"
        file_path = UPLOAD_DIR / safe_filename
        
        # Sauvegarder le fichier
        async with aiofiles.open(file_path, 'wb') as f:
            await f.write(image_bytes)
        
        # Générer une miniature
        thumbnail_filename = f"thumb_{file_id}.jpg"
        thumbnail_path = THUMBNAIL_DIR / thumbnail_filename
        thumbnail_url = f"/api/media/thumbnails/{thumbnail_filename}"
        
        if not generate_thumbnail(file_path, thumbnail_path):
            thumbnail_url = f"/api/media/default-thumbnail.png"
        
        # Obtenir les dimensions
        dimensions = None
        try:
            with Image.open(file_path) as img:
                dimensions = {"width": img.width, "height": img.height}
        except:
            pass
        
        # Métadonnées du fichier
        file_data = {
            "id": file_id,
            "name": filename,
            "safeName": safe_filename,
            "type": "image",
            "contentType": content_type,
            "size": len(image_bytes),
            "folder": folder,
            "url": f"/api/media/files/{safe_filename}",
            "thumbnail": thumbnail_url,
            "dimensions": dimensions,
            "createdAt": datetime.now().isoformat(),
            "uploadedBy": current_user.get("id")
        }
        
        # Sauvegarder en base de données
        await insert_document("media_files", file_data)
        
        return ApiResponse(
            success=True,
            data=file_data,
            message="Image uploadée avec succès"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur upload image: {str(e)}")

@router.delete("/files/{file_id}")
async def delete_media_file(
    file_id: str,
    current_user=Depends(get_current_admin)
):
    """Supprimer un fichier média"""
    try:
        # Récupérer les informations du fichier
        files, _ = await get_documents("media_files", {"id": file_id}, limit=1)
        
        if not files:
            raise HTTPException(status_code=404, detail="Fichier non trouvé")
        
        file_data = files[0]
        
        # Supprimer les fichiers physiques
        try:
            file_path = UPLOAD_DIR / file_data["safeName"]
            if file_path.exists():
                os.unlink(file_path)
            
            # Supprimer la miniature si elle existe
            if file_data.get("thumbnail") and "thumbnails/" in file_data["thumbnail"]:
                thumbnail_name = file_data["thumbnail"].split("/")[-1]
                thumbnail_path = THUMBNAIL_DIR / thumbnail_name
                if thumbnail_path.exists():
                    os.unlink(thumbnail_path)
        except Exception as e:
            print(f"Erreur suppression fichier physique: {e}")
        
        # Supprimer de la base de données
        await delete_document("media_files", {"id": file_id})
        
        return ApiResponse(
            success=True,
            message="Fichier supprimé avec succès"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur suppression fichier: {str(e)}")

@router.post("/folders")
async def create_folder(
    name: str = Form(...),
    parent: str = Form(""),
    current_user=Depends(get_current_admin)
):
    """Créer un nouveau dossier"""
    try:
        folder_path = f"{parent}/{name}" if parent else name
        
        # Vérifier si le dossier existe déjà
        existing, _ = await get_documents("media_folders", {"path": folder_path}, limit=1)
        if existing:
            raise HTTPException(status_code=400, detail="Un dossier avec ce nom existe déjà")
        
        folder_data = {
            "id": str(uuid.uuid4()),
            "name": name,
            "path": folder_path,
            "parent": parent,
            "createdAt": datetime.now().isoformat(),
            "createdBy": current_user.get("id")
        }
        
        await insert_document("media_folders", folder_data)
        
        return ApiResponse(
            success=True,
            data=folder_data,
            message="Dossier créé avec succès"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur création dossier: {str(e)}")

@router.get("/folders")
async def get_folders(
    parent: str = Query("", description="Dossier parent"),
    current_user=Depends(get_current_admin)
):
    """Récupérer la liste des dossiers"""
    try:
        filter_query = {"parent": parent}
        
        folders, total = await get_documents(
            "media_folders",
            filter_query,
            sort_field="name",
            sort_direction=1
        )
        
        return ApiResponse(
            success=True,
            data={
                "folders": folders,
                "total": total
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur récupération dossiers: {str(e)}")