# Contrats API et Intégration Backend - Anomalya Corp

## Vue d'ensemble
Ce document définit les contrats API et la stratégie d'intégration entre le frontend React et le backend FastAPI pour le site Anomalya Corp amélioré.

## 1. API Endpoints - Actualités/News

### GET `/api/news`
**Description**: Récupérer toutes les actualités avec filtres optionnels
**Query Parameters**:
- `category` (string, optional): Filtrer par catégorie
- `search` (string, optional): Recherche dans titre/contenu
- `limit` (int, optional): Nombre d'articles par page
- `offset` (int, optional): Pagination
- `sort` (string, optional): 'date' ou 'title'

**Response**:
```json
{
  "articles": [
    {
      "id": "int",
      "title": "string",
      "category": "string",
      "excerpt": "string", 
      "content": "string",
      "image": "string",
      "date": "string (ISO)",
      "isPinned": "boolean",
      "author": "string",
      "readTime": "string",
      "tags": ["string"]
    }
  ],
  "total": "int",
  "hasMore": "boolean"
}
```

### GET `/api/news/{id}`
**Description**: Récupérer un article spécifique
**Response**: Objet article complet

### POST `/api/news`
**Description**: Créer un nouvel article (admin)
**Body**: Données article sans ID

### PUT `/api/news/{id}`
**Description**: Modifier un article (admin)

### DELETE `/api/news/{id}`
**Description**: Supprimer un article (admin)

## 2. API Endpoints - Contact

### POST `/api/contact`
**Description**: Envoyer un message de contact
**Body**:
```json
{
  "nom": "string",
  "email": "string", 
  "sujet": "string",
  "service": "string",
  "message": "string"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Message envoyé avec succès",
  "id": "string"
}
```

## 3. API Endpoints - Services

### GET `/api/services`
**Description**: Récupérer tous les services
**Response**: Liste des services avec détails

## 4. Données Mock à Remplacer

### Frontend: `/src/data/mock.js`
Les données suivantes devront être remplacées par des appels API :
- `mockNews[]` → GET `/api/news`
- `mockServices[]` → GET `/api/services`  
- `mockTestimonials[]` → GET `/api/testimonials`
- `mockCompetences[]` → GET `/api/competences`
- `mockFAQ[]` → GET `/api/faq`

## 5. Modèles MongoDB

### Article Model
```python
class Article(BaseModel):
    title: str
    category: str
    excerpt: str
    content: str
    image: str
    date: datetime
    isPinned: bool = False
    author: str
    readTime: str
    tags: List[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

### Contact Model
```python
class Contact(BaseModel):
    nom: str
    email: EmailStr
    sujet: str
    service: str
    message: str
    status: str = "nouveau"
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

### Service Model
```python
class Service(BaseModel):
    title: str
    icon: str
    description: str
    features: List[str]
    price: str
    active: bool = True
```

## 6. Fonctionnalités Backend à Implémenter

### Administration des Actualités
- ✅ CRUD complet pour les articles
- ✅ Upload d'images
- ✅ Système de catégories
- ✅ Gestion des tags
- ✅ Articles épinglés
- ✅ Recherche et filtres

### Gestion des Contacts
- ✅ Réception des messages de contact
- ✅ Notification email automatique
- ✅ Stockage en base de données
- ✅ Interface d'administration

### Fonctionnalités Améliorées
- ✅ Newsletter subscription
- ✅ Système de commentaires (optionnel)
- ✅ Analytics des articles
- ✅ SEO optimization
- ✅ Cache pour performance

## 7. Intégration Frontend/Backend

### Remplacement des Mock Data
1. **NewsSection.jsx**: Remplacer `mockNews.slice(0, 3)` par `GET /api/news?limit=3`
2. **ActualitesPage.jsx**: Remplacer `mockNews` par `GET /api/news` avec filtres
3. **NewsDetail.jsx**: Remplacer `mockNews.find()` par `GET /api/news/{id}`
4. **Contact.jsx**: Remplacer simulation par `POST /api/contact`
5. **ServicesSection.jsx**: Remplacer `mockServices` par `GET /api/services`

### Gestion d'État
- Utiliser React Query/SWR pour cache et synchronisation
- Loading states pour toutes les requêtes
- Error handling approprié
- Optimistic updates pour UX fluide

### Variables d'Environnement
- `REACT_APP_BACKEND_URL` déjà configuré
- Configuration des headers CORS
- Gestion des tokens d'authentification (admin)

## 8. Sécurité

### Validation
- Validation côté backend avec Pydantic
- Sanitisation des inputs
- Rate limiting sur les endpoints publics

### Authentification (Admin)
- JWT tokens pour administration
- Rôles et permissions
- Endpoints protégés pour CRUD articles

## 9. Performance

### Optimisations Frontend
- Lazy loading des images
- Pagination infinie pour actualités
- Debouncing sur la recherche
- Cache navigateur pour images

### Optimisations Backend
- Index MongoDB sur les champs recherchés
- Compression des images uploadées
- Cache Redis pour requêtes fréquentes
- Pagination efficace

## 10. Déploiement

### Variables d'Environnement Backend
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=anomalya_db
ADMIN_EMAIL=admin@anomalya.fr
SMTP_SERVER=...
SMTP_PORT=587
SMTP_USERNAME=...
SMTP_PASSWORD=...
```

Cette architecture garantit une intégration fluide entre le frontend existant et le nouveau backend, tout en préservant l'expérience utilisateur et en ajoutant les fonctionnalités administratives nécessaires.