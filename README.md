# 🚀 Anomalya Corp - Platform de Services Numériques

[![Version](https://img.shields.io/badge/version-0.5.5-blue.svg)](https://github.com/anomalya/corp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.0+-61dafb.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-009688.svg)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0+-47A248.svg)](https://www.mongodb.com/)

> 🌟 **Plateforme moderne et complète** pour la gestion de services numériques avec interface client/admin, analytics en temps réel, et système de gestion de contenu intégré.

---

## 📋 Table des matières

- [🎯 Fonctionnalités](#-fonctionnalités)
- [🏗️ Architecture Technique](#️-architecture-technique)
- [⚡ Installation Rapide](#-installation-rapide)
- [🐧 Installation Linux](#-installation-linux)
- [🪟 Installation Windows](#-installation-windows)
- [🎨 Personnalisation](#-personnalisation)
- [📝 Création de Contenu](#-création-de-contenu)
- [🔧 Configuration](#-configuration)
- [🧪 Tests](#-tests)
- [🚀 Déploiement](#-déploiement)
- [📚 Documentation API](#-documentation-api)
- [🤝 Contribution](#-contribution)

---

## 🎯 Fonctionnalités

### 🌐 Site Public
- ✅ **Page d'accueil moderne** avec sections interactives
- ✅ **Blog/Actualités** avec catégories et tags
- ✅ **Services** avec descriptions détaillées
- ✅ **Portfolio** de compétences techniques
- ✅ **Contact** avec formulaire intégré
- ✅ **FAQ** avec recherche intelligente
- ✅ **Design responsive** mobile-first

### 👥 Espace Client
- ✅ **Dashboard personnel** avec métriques
- ✅ **Système de fidélité** (Bronze, Silver, Gold, Platinum)
- ✅ **Demandes de devis** avec suivi en temps réel
- ✅ **Tickets de support** avec historique
- ✅ **Profil utilisateur** modifiable
- ✅ **Notifications** en temps réel

### 🛡️ Panel Administrateur
- ✅ **Dashboard analytics** avec données réelles
- ✅ **Gestion complète des articles** (CRUD)
- ✅ **Administration des utilisateurs** et clients
- ✅ **Système de tickets** de support
- ✅ **Gestion des devis** avec statuts
- ✅ **Analytics avancés** avec graphiques interactifs

### 🔐 Sécurité & Authentification
- ✅ **JWT avec refresh tokens**
- ✅ **Rôles multi-niveaux** (admin, client, prospect, moderator)
- ✅ **Protection CSRF** et validation stricte
- ✅ **Middleware de sécurité** complet
- ✅ **Sessions sécurisées** avec expiration

---

## 🏗️ Architecture Technique

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React 18.0+   │    │   FastAPI       │    │   MongoDB       │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│   (Database)    │
│                 │    │                 │    │                 │
│ • Shadcn/UI     │    │ • Async/Await   │    │ • Motor Driver  │
│ • TailwindCSS   │    │ • Pydantic      │    │ • Aggregation   │
│ • React Router  │    │ • JWT Auth      │    │ • Indexing      │
│ • Axios         │    │ • CORS          │    │ • GridFS        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Stack Technologique

**Frontend (React 18.0+)**
- `@shadcn/ui` - Composants UI modernes
- `tailwindcss` - Framework CSS utilitaire
- `react-router-dom` - Navigation SPA
- `axios` - Client HTTP
- `lucide-react` - Icônes vectorielles
- `framer-motion` - Animations fluides

**Backend (FastAPI)**
- `fastapi` - Framework web moderne
- `motor` - Driver MongoDB asynchrone
- `pydantic` - Validation de données
- `python-jose` - JWT handling
- `passlib` - Hashage de mots de passe
- `python-multipart` - Upload de fichiers

**Base de Données (MongoDB)**
- `Collections` - users, articles, contacts, quotes, tickets
- `Indexing` - Performance optimisée
- `Aggregation Pipeline` - Analytics avancés
- `GridFS` - Stockage de fichiers

---

## ⚡ Installation Rapide

```bash
# Cloner le repository
git clone https://github.com/anomalya/corp.git
cd anomalya-corp

# Backend (Terminal 1)
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou venv\Scripts\activate  # Windows
pip install -r requirements.txt
python server.py

# Frontend (Terminal 2)
cd frontend
yarn install
yarn start

# Accéder à l'application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8001
```

---

## 🐧 Installation Linux

### Prérequis
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y python3.10 python3-pip nodejs npm mongodb-server git curl

# CentOS/RHEL/Fedora
sudo dnf install -y python3 python3-pip nodejs npm mongodb-server git curl

# Arch Linux
sudo pacman -S python nodejs npm mongodb git curl
```

### Installation Complète

```bash
#!/bin/bash
# Script d'installation Linux

# 1. Cloner le projet
git clone https://github.com/anomalya/corp.git
cd anomalya-corp

# 2. Installer Yarn (recommandé pour frontend)
curl -o- -L https://yarnpkg.com/install.sh | bash
source ~/.bashrc

# 3. Configuration MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Créer utilisateur MongoDB (optionnel)
mongo --eval "
use admin
db.createUser({
  user: 'anomalya_admin',
  pwd: 'your_secure_password',
  roles: [{role: 'readWrite', db: 'anomalya_db'}]
})
"

# 4. Setup Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# Configuration environnement
cp .env.example .env
nano .env  # Éditer les variables

# Initialiser la base de données
python init_db.py

# 5. Setup Frontend
cd ../frontend
yarn install

# Configuration environnement
cp .env.example .env
nano .env  # Éditer REACT_APP_BACKEND_URL

# 6. Installation service système (optionnel)
sudo cp scripts/anomalya.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable anomalya
sudo systemctl start anomalya

echo "✅ Installation terminée !"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:8001"
echo "👤 Admin: admin / admin123"
```

### Dépannage Linux

```bash
# Vérifier les ports
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :8001

# Logs système
journalctl -u anomalya -f

# Permissions MongoDB
sudo chown -R mongodb:mongodb /var/lib/mongodb
sudo chown mongodb:mongodb /tmp/mongodb-27017.sock

# Firewall
sudo ufw allow 3000
sudo ufw allow 8001
```

---

## 🪟 Installation Windows

### Prérequis
1. **Python 3.10+** : [python.org](https://www.python.org/downloads/)
2. **Node.js 18+** : [nodejs.org](https://nodejs.org/)
3. **MongoDB Community** : [mongodb.com](https://www.mongodb.com/try/download/community)
4. **Git** : [git-scm.com](https://git-scm.com/)

### Installation avec PowerShell

```powershell
# Exécuter en tant qu'administrateur

# 1. Installer Chocolatey (gestionnaire de paquets)
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# 2. Installer les dépendances
choco install python nodejs mongodb git yarn -y

# 3. Redémarrer le terminal et cloner le projet
git clone https://github.com/anomalya/corp.git
cd anomalya-corp

# 4. Configuration MongoDB
net start MongoDB

# 5. Setup Backend
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt

# Configuration environnement
copy .env.example .env
notepad .env  # Éditer les variables

# Initialiser la DB
python init_db.py

# 6. Setup Frontend
cd ..\frontend
yarn install

# Configuration environnement
copy .env.example .env
notepad .env  # Éditer REACT_APP_BACKEND_URL

# 7. Créer scripts de démarrage
cd ..
echo @echo off > start.bat
echo echo Demarrage Anomalya Corp... >> start.bat
echo start /B cmd /c "cd backend && .\venv\Scripts\activate && python server.py" >> start.bat
echo start /B cmd /c "cd frontend && yarn start" >> start.bat
echo echo Frontend: http://localhost:3000 >> start.bat
echo echo Backend: http://localhost:8001 >> start.bat
echo pause >> start.bat

Write-Host "✅ Installation terminée !"
Write-Host "🚀 Lancez start.bat pour démarrer l'application"
```

### Service Windows (Optionnel)

```powershell
# Installer NSSM (Non-Sucking Service Manager)
choco install nssm -y

# Créer service pour backend
nssm install AnomalyaBackend "C:\path\to\python.exe" "C:\path\to\server.py"
nssm set AnomalyaBackend AppDirectory "C:\path\to\backend"
nssm start AnomalyaBackend

# Créer service pour frontend
nssm install AnomalyaFrontend "C:\path\to\node.exe" "C:\path\to\node_modules\.bin\react-scripts.cmd start"
nssm set AnomalyaFrontend AppDirectory "C:\path\to\frontend"
nssm start AnomalyaFrontend
```

---

## 🎨 Personnalisation

### 🎨 Thème et Design

#### Couleurs Principales
```css
/* /frontend/src/index.css */
:root {
  --primary: #3b82f6;      /* Bleu principal */
  --secondary: #10b981;    /* Vert accent */
  --accent: #f59e0b;       /* Orange CTA */
  --dark: #1e293b;         /* Arrière-plan sombre */
  --light: #f8fafc;        /* Texte clair */
}

/* Personnalisation des couleurs */
.custom-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

#### Logo et Branding
```javascript
// /frontend/src/components/Header.jsx
const COMPANY_CONFIG = {
  name: "Votre Entreprise",
  logo: "/assets/your-logo.png",
  tagline: "Votre slogan personnalisé",
  colors: {
    primary: "#your-color",
    secondary: "#your-secondary"
  }
};
```

### 📝 Contenu Statique

#### Informations Entreprise
```javascript
// /frontend/src/config/company.js
export const COMPANY_INFO = {
  name: "Anomalya Corp",
  address: "123 Rue de l'Innovation, 75001 Paris",
  phone: "+33 1 23 45 67 89",
  email: "contact@votre-entreprise.com",
  website: "https://votre-entreprise.com",
  
  social: {
    linkedin: "https://linkedin.com/company/votre-entreprise",
    twitter: "https://twitter.com/votre-entreprise",
    facebook: "https://facebook.com/votre-entreprise"
  },
  
  hours: {
    weekdays: "9h00 - 18h00",
    weekend: "Fermé"
  }
};
```

#### Métadonnées SEO
```html
<!-- /frontend/public/index.html -->
<meta name="description" content="Votre description personnalisée">
<meta name="keywords" content="vos, mots, clés">
<meta property="og:title" content="Votre Titre">
<meta property="og:description" content="Votre description">
<meta property="og:image" content="/assets/og-image.jpg">
```

### 📊 Configuration Analytics

```javascript
// /frontend/src/config/analytics.js
export const ANALYTICS_CONFIG = {
  googleAnalytics: "GA_MEASUREMENT_ID",
  facebookPixel: "FB_PIXEL_ID",
  hotjar: "HOTJAR_ID",
  
  // Events personnalisés
  events: {
    contact_form: "contact_form_submission",
    quote_request: "quote_request",
    newsletter: "newsletter_signup"
  }
};
```

---

## 📝 Création de Contenu

### ✍️ Nouveau Article de Blog

```python
# Exemple d'article via API ou directement en DB
{
  "id": "unique-id",
  "title": "Titre de votre article",
  "content": "Contenu en Markdown ou HTML",
  "excerpt": "Résumé court de l'article",
  "category": "Technologie", # ou "Business", "Actualités"
  "tags": ["react", "javascript", "développement"],
  "author": {
    "name": "Nom Auteur",
    "email": "auteur@entreprise.com",
    "avatar": "/assets/authors/auteur.jpg"
  },
  "isPinned": false,
  "isPublished": true,
  "date": "2025-01-03T10:00:00Z",
  "seo": {
    "metaTitle": "Titre SEO optimisé",
    "metaDescription": "Description SEO",
    "keywords": ["mot-clé1", "mot-clé2"]
  }
}
```

### 🛠️ Nouveau Service

```python
# Ajouter un service
{
  "id": "service-unique-id",
  "title": "Développement d'Applications Web",
  "description": "Description détaillée du service",
  "features": [
    "React/Vue.js",
    "Node.js/Python",
    "Base de données",
    "API REST/GraphQL"
  ],
  "technologies": [
    {"name": "React", "icon": "react-icon.svg"},
    {"name": "Node.js", "icon": "nodejs-icon.svg"}
  ],
  "pricing": {
    "starting": 2500,
    "currency": "EUR",
    "unit": "projet"
  },
  "duration": "4-8 semaines",
  "category": "développement"
}
```

### 👤 Template de Page Utilisateur

```jsx
// /frontend/src/pages/Custom/CustomPage.jsx
import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const CustomPage = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <section className="text-center py-16">
            <h1 className="text-4xl font-bold text-white mb-6">
              Titre de votre page
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Description de votre page personnalisée
            </p>
          </section>

          {/* Content Section */}
          <section className="py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Vos composants personnalisés */}
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CustomPage;
```

### 📧 Templates Email

```html
<!-- /backend/templates/email/welcome.html -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Bienvenue chez {{ company_name }}</title>
</head>
<body style="font-family: Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <img src="{{ logo_url }}" alt="{{ company_name }}" style="height: 60px;">
        
        <h1 style="color: #3b82f6;">Bienvenue {{ user_name }} !</h1>
        
        <p>Merci de rejoindre notre plateforme. Voici vos informations de connexion :</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
            <p><strong>Email :</strong> {{ user_email }}</p>
            <p><strong>Mot de passe :</strong> {{ temporary_password }}</p>
        </div>
        
        <a href="{{ login_url }}" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
            Se connecter
        </a>
    </div>
</body>
</html>
```

---

## 🔧 Configuration

### 🌍 Variables d'Environnement

#### Backend (`.env`)
```bash
# Base de données
MONGO_URL=mongodb://localhost:27017/anomalya_db
MONGO_DB_NAME=anomalya_db

# Sécurité
SECRET_KEY=your-super-secret-jwt-key-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Email (optionnel)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Stockage fichiers
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760  # 10MB

# API externes
OPENAI_API_KEY=your-openai-key
STRIPE_SECRET_KEY=your-stripe-key

# Développement
DEBUG=True
CORS_ORIGINS=["http://localhost:3000"]
```

#### Frontend (`.env`)
```bash
# API Backend
REACT_APP_BACKEND_URL=http://localhost:8001

# Analytics
REACT_APP_GA_ID=GA_MEASUREMENT_ID
REACT_APP_HOTJAR_ID=HOTJAR_ID

# Fonctionnalités
REACT_APP_ENABLE_CHAT=true
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_PWA=false

# Limites
REACT_APP_MAX_UPLOAD_SIZE=5242880  # 5MB
REACT_APP_MAX_IMAGES_PER_ARTICLE=10
```

### 🗄️ Configuration Base de Données

```python
# /backend/database.py - Configuration avancée
MONGODB_CONFIG = {
    "host": "localhost",
    "port": 27017,
    "database": "anomalya_db",
    "max_pool_size": 10,
    "min_pool_size": 1,
    "max_idle_time_ms": 30000,
    "server_selection_timeout_ms": 5000,
    
    # Index pour performance
    "indexes": {
        "users": [
            {"keys": {"email": 1}, "unique": True},
            {"keys": {"created_at": -1}}
        ],
        "articles": [
            {"keys": {"title": "text", "content": "text"}},
            {"keys": {"date": -1, "isPinned": -1}},
            {"keys": {"category": 1, "tags": 1}}
        ],
        "analytics": [
            {"keys": {"date": -1, "type": 1}},
            {"keys": {"user_id": 1, "action": 1}}
        ]
    }
}
```

---

## 🧪 Tests

### 🔬 Tests Backend
```bash
# Installation des dépendances de test
pip install pytest pytest-asyncio httpx

# Structure des tests
backend/tests/
├── __init__.py
├── conftest.py          # Configuration pytest
├── test_auth.py         # Tests authentification
├── test_articles.py     # Tests articles
├── test_analytics.py    # Tests analytics
└── test_integration.py  # Tests d'intégration

# Lancer les tests
cd backend
python -m pytest tests/ -v --cov=. --cov-report=html

# Tests spécifiques
python -m pytest tests/test_auth.py::test_login -v
```

### 🧪 Exemple de Test
```python
# /backend/tests/test_articles.py
import pytest
from fastapi.testclient import TestClient
from server import app

client = TestClient(app)

@pytest.fixture
def admin_token():
    """Fixture pour obtenir un token admin"""
    response = client.post("/api/auth/login", json={
        "username": "admin",
        "password": "admin123"
    })
    return response.json()["access_token"]

def test_create_article(admin_token):
    """Test création d'article"""
    article_data = {
        "title": "Test Article",
        "content": "Contenu de test",
        "category": "Test",
        "tags": ["test", "article"]
    }
    
    response = client.post(
        "/api/admin/articles",
        json=article_data,
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    
    assert response.status_code == 201
    assert response.json()["title"] == "Test Article"

def test_get_articles():
    """Test récupération des articles publics"""
    response = client.get("/api/news")
    
    assert response.status_code == 200
    assert "articles" in response.json()
```

### 🎭 Tests Frontend
```bash
# Installation des dépendances
yarn add --dev @testing-library/react @testing-library/jest-dom jest-environment-jsdom

# Structure des tests
frontend/src/tests/
├── components/
│   ├── Header.test.jsx
│   └── Footer.test.jsx
├── pages/
│   ├── Home.test.jsx
│   └── Login.test.jsx
└── utils/
    └── api.test.js

# Lancer les tests
yarn test
yarn test --coverage
```

### 🔍 Exemple Test Frontend
```jsx
// /frontend/src/tests/components/Header.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../../components/Header';
import { AuthProvider } from '../../contexts/AuthContext';

const MockedHeader = () => (
  <BrowserRouter>
    <AuthProvider>
      <Header />
    </AuthProvider>
  </BrowserRouter>
);

test('renders navigation links', () => {
  render(<MockedHeader />);
  
  expect(screen.getByText('Accueil')).toBeInTheDocument();
  expect(screen.getByText('Services')).toBeInTheDocument();
  expect(screen.getByText('Actualités')).toBeInTheDocument();
});

test('opens mobile menu on click', () => {
  render(<MockedHeader />);
  
  const menuButton = screen.getByRole('button', { name: /menu/i });
  fireEvent.click(menuButton);
  
  expect(screen.getByRole('navigation')).toHaveClass('mobile-menu-open');
});
```

---

## 🚀 Déploiement

### 🐳 Docker
```dockerfile
# Dockerfile.prod
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --only=production
COPY frontend/ ./
RUN npm run build

FROM python:3.10-slim AS backend
WORKDIR /app
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ ./

FROM nginx:alpine AS production
COPY --from=frontend-build /app/frontend/build /usr/share/nginx/html
COPY --from=backend /app /app/backend
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  mongodb:
    image: mongo:7.0
    container_name: anomalya-db
    restart: unless-stopped
    environment:
      MONGO_INITDB_DATABASE: anomalya_db
    volumes:
      - mongodb_data:/data/db
    ports:
      - "27017:27017"

  backend:
    build: 
      context: .
      dockerfile: Dockerfile.backend
    container_name: anomalya-backend
    restart: unless-stopped
    environment:
      MONGO_URL: mongodb://mongodb:27017/anomalya_db
    depends_on:
      - mongodb
    ports:
      - "8001:8001"

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    container_name: anomalya-frontend
    restart: unless-stopped
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

### ☁️ Déploiement Cloud

#### Heroku
```bash
# Préparation
heroku create anomalya-corp
heroku addons:create mongolab:sandbox

# Variables d'environnement
heroku config:set SECRET_KEY=your-secret-key
heroku config:set MONGO_URL=your-mongo-url

# Déploiement
git push heroku main
```

#### Vercel (Frontend)
```json
{
  "name": "anomalya-frontend",
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://your-backend-url.com/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ]
}
```

#### DigitalOcean Droplet
```bash
#!/bin/bash
# Script de déploiement DigitalOcean

# 1. Création du droplet
doctl compute droplet create anomalya-prod \
  --image ubuntu-22-04-x64 \
  --size s-2vcpu-2gb \
  --region fra1 \
  --ssh-keys your-ssh-key-id

# 2. Configuration du serveur
apt update && apt upgrade -y
apt install -y docker.io docker-compose nginx certbot python3-certbot-nginx

# 3. SSL avec Let's Encrypt
certbot --nginx -d votre-domaine.com

# 4. Configuration Nginx
cat > /etc/nginx/sites-available/anomalya << EOF
server {
    listen 80;
    server_name votre-domaine.com;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl;
    server_name votre-domaine.com;
    
    ssl_certificate /etc/letsencrypt/live/votre-domaine.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/votre-domaine.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
    
    location /api {
        proxy_pass http://localhost:8001;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF

ln -s /etc/nginx/sites-available/anomalya /etc/nginx/sites-enabled/
systemctl reload nginx

# 5. Déploiement avec Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📚 Documentation API

### 🔗 Endpoints Principaux

#### Authentification
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "full_name": "John Doe"
}

Response: 201
{
  "success": true,
  "message": "Utilisateur créé avec succès",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "role": "prospect"
  }
}
```

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

Response: 200
{
  "access_token": "eyJ0eXAiOiJKV1Q...",
  "token_type": "bearer",
  "user": {
    "id": "admin_id",
    "email": "admin@anomalya.com",
    "role": "admin"
  }
}
```

#### Articles/Blog
```http
GET /api/news?page=1&limit=10&category=Technology&search=AI

Response: 200
{
  "success": true,
  "data": {
    "articles": [...],
    "total": 25,
    "page": 1,
    "hasMore": true
  }
}
```

```http
POST /api/admin/articles
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Nouveau Article",
  "content": "Contenu de l'article...",
  "category": "Technology",
  "tags": ["AI", "Machine Learning"],
  "isPinned": false
}
```

#### Analytics (Admin uniquement)
```http
GET /api/admin/analytics/overview?time_range=30d
Authorization: Bearer {admin_token}

Response: 200
{
  "success": true,
  "data": {
    "overview": {
      "totalUsers": 156,
      "totalArticles": 23,
      "totalContacts": 45,
      "totalQuotes": 78,
      "growth": {
        "users": 12.5,
        "articles": 8.3,
        "contacts": -2.1,
        "quotes": 15.7
      }
    }
  }
}
```

### 📖 Documentation Interactive

L'API dispose d'une documentation interactive Swagger disponible à :
- **Swagger UI** : `http://localhost:8001/docs`
- **ReDoc** : `http://localhost:8001/redoc`

---

## 🤝 Contribution

### 🔄 Workflow de Contribution

1. **Fork** le repository
2. **Créer** une branche feature (`git checkout -b feature/amazing-feature`)
3. **Commiter** vos changements (`git commit -m 'Add amazing feature'`)
4. **Pousser** la branche (`git push origin feature/amazing-feature`)
5. **Ouvrir** une Pull Request

### 📝 Standards de Code

#### Backend (Python)
```python
# Suivre PEP 8
# Utiliser des docstrings
def create_article(article_data: ArticleCreate) -> Article:
    """
    Créer un nouvel article.
    
    Args:
        article_data: Données de l'article à créer
        
    Returns:
        Article: L'article créé
        
    Raises:
        HTTPException: Si erreur de validation
    """
    pass
```

#### Frontend (JavaScript/React)
```jsx
// Utiliser ESLint + Prettier
// Composants fonctionnels avec hooks
const ArticleCard = ({ article, onEdit, onDelete }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  /**
   * Gérer la suppression d'un article
   */
  const handleDelete = useCallback(async () => {
    setIsLoading(true);
    try {
      await onDelete(article.id);
    } catch (error) {
      console.error('Erreur suppression:', error);
    } finally {
      setIsLoading(false);
    }
  }, [article.id, onDelete]);
  
  return (
    <div className="article-card">
      {/* Contenu du composant */}
    </div>
  );
};
```

### 🐛 Signaler un Bug

Utilisez le [template d'issue](.github/ISSUE_TEMPLATE/bug_report.md) :

```markdown
**Description du bug**
Description claire et concise du problème.

**Étapes pour reproduire**
1. Aller à '...'
2. Cliquer sur '....'
3. Voir l'erreur

**Comportement attendu**
Description de ce qui devrait se passer.

**Captures d'écran**
Si applicable, ajoutez des captures d'écran.

**Environnement:**
 - OS: [Windows/Linux/Mac]
 - Navigateur: [Chrome, Firefox, Safari]
 - Version: [0.5.5]
```

---

## 📞 Support et Contact

### 💬 Communauté
- **Discord** : [Rejoindre le serveur](https://discord.gg/anomalya)
- **Forum** : [forum.anomalya.com](https://forum.anomalya.com)
- **Wiki** : [wiki.anomalya.com](https://wiki.anomalya.com)

### 🆘 Support Technique
- **Email** : support@anomalya.com
- **Issues GitHub** : [Créer une issue](https://github.com/anomalya/corp/issues)
- **Documentation** : [docs.anomalya.com](https://docs.anomalya.com)

### 👥 Équipe
- **Lead Developer** : [@anomalya-dev](https://github.com/anomalya-dev)
- **UI/UX Designer** : [@anomalya-design](https://github.com/anomalya-design)
- **DevOps** : [@anomalya-ops](https://github.com/anomalya-ops)

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

```
MIT License

Copyright (c) 2025 Anomalya Corp

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🙏 Remerciements

- [React](https://reactjs.org/) pour le framework frontend
- [FastAPI](https://fastapi.tiangolo.com/) pour l'API backend
- [MongoDB](https://www.mongodb.com/) pour la base de données
- [Tailwind CSS](https://tailwindcss.com/) pour le styling
- [Shadcn/ui](https://ui.shadcn.com/) pour les composants UI
- [Lucide](https://lucide.dev/) pour les icônes
- La communauté open source pour l'inspiration

---

**⭐ Si ce projet vous a aidé, n'hésitez pas à lui donner une étoile sur GitHub !**

[![GitHub stars](https://img.shields.io/github/stars/anomalya/corp.svg?style=social&label=Star&maxAge=2592000)](https://github.com/anomalya/corp/stargazers/)

---

*Dernière mise à jour : 3 janvier 2025*