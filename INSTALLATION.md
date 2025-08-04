# 🚀 Installation d'Anomalya Corp

Guide complet d'installation pour l'application Anomalya Corp sur différentes plateformes.

## 📋 Prérequis

### Linux (Ubuntu/Debian/CentOS/Fedora)
- Python 3.8+ 
- Node.js 18+
- MongoDB 5.0+
- Git
- Yarn (package manager)

### Windows
- PowerShell 5.1+
- Git
- Python 3.8+ (optionnel si utilisation de Chocolatey)
- Node.js 18+ (optionnel si utilisation de Chocolatey)

## 🐧 Installation sur Linux

### Distributions supportées
- ✅ **Ubuntu** 20.04+ / **Debian** 11+
- ✅ **CentOS** 8+ / **RHEL** 8+
- ✅ **Fedora** 35+
- ✅ **Arch Linux** (communautaire)

### Étape 1: Télécharger le projet
```bash
git clone <your-repository-url>
cd anomalya-corp
```

### Étape 2: Rendre le script exécutable
```bash
chmod +x scripts/install-linux.sh
```

### Étape 3: Lancer l'installation
```bash
# Installation complète automatique
./scripts/install-linux.sh

# Ou depuis le dossier scripts
cd scripts
./install-linux.sh
```

### Options disponibles
```bash
# Afficher l'aide
./scripts/install-linux.sh --help

# Installation avec configuration avancée
./scripts/install-linux.sh --verbose
```

## 🪟 Installation sur Windows

### Étape 1: Télécharger le projet
```powershell
git clone <your-repository-url>
cd anomalya-corp
```

### Étape 2: Lancer l'installation PowerShell
```powershell
# Exécuter avec les permissions nécessaires
PowerShell -ExecutionPolicy Bypass -File scripts\install-windows.ps1

# Avec installation de Chocolatey (recommandé)
PowerShell -ExecutionPolicy Bypass -File scripts\install-windows.ps1 -InstallChocolatey

# Installation en tant que service Windows
PowerShell -ExecutionPolicy Bypass -File scripts\install-windows.ps1 -InstallAsService
```

## 🔧 Dépannage

### Erreur "impossible d'accéder au script"
```bash
# Solution: Corriger les permissions
chmod +x scripts/install-linux.sh
chmod +x scripts/install-windows.ps1
```

### Erreur de dépendances sur Linux
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install python3 python3-pip nodejs npm git

# CentOS/Fedora  
sudo dnf install python3 python3-pip nodejs npm git

# Installation de Yarn
npm install -g yarn
```

### Erreur MongoDB
```bash
# Ubuntu/Debian
sudo apt install mongodb-org

# Pour les anciennes versions, installer mongodb-server-core
sudo apt install mongodb-server-core
```

## 🏃‍♂️ Démarrage rapide après installation

### 1. Configuration des variables d'environnement
```bash
# Backend
cp backend/.env.example backend/.env
# Modifier les variables selon vos besoins

# Frontend  
cp frontend/.env.example frontend/.env
# Vérifier REACT_APP_BACKEND_URL
```

### 2. Initialisation de la base de données
```bash
cd backend
python init_db.py
```

### 3. Démarrage des services
```bash
# Option 1: Avec supervisorctl (recommandé)
sudo supervisorctl restart all

# Option 2: Démarrage manuel
# Terminal 1 - Backend
cd backend
python server.py

# Terminal 2 - Frontend
cd frontend
yarn start
```

### 4. Accès à l'application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001
- **Admin**: Connectez-vous avec `admin` / `admin123`

## 🪟 Dépannage Windows

En cas de problème sur Windows (MongoDB, connexions, etc.) :

### Diagnostic Rapide
```powershell
# Diagnostic complet automatique
PowerShell -ExecutionPolicy Bypass -File scripts\diagnose-windows.ps1

# Correction PATH MongoDB si nécessaire
PowerShell -ExecutionPolicy Bypass -File scripts\fix-mongodb-path.ps1
```

### Problèmes Courants
- **"Client mongo non disponible"** : MongoDB installé mais pas dans PATH
- **"Aucune actualité"** : Service MongoDB non démarré
- **Erreur de connexion** : Fichier `.env` manquant ou mal configuré

**📋 Guide complet** : Consultez `WINDOWS_TROUBLESHOOT.md` pour toutes les solutions détaillées.

## 📁 Structure des fichiers après installation

```
anomalya-corp/
├── backend/
│   ├── .env                 # Configuration backend
│   ├── server.py           # Serveur FastAPI
│   └── requirements.txt    # Dépendances Python
├── frontend/
│   ├── .env                # Configuration frontend
│   ├── package.json        # Dépendances Node.js
│   └── src/                # Code source React
├── scripts/
│   ├── install-linux.sh    # Script d'installation Linux
│   └── install-windows.ps1 # Script d'installation Windows
└── README.md               # Documentation principale
```

## 🆘 Support

En cas de problème:

1. **Vérifiez les logs**:
   ```bash
   # Logs supervisorctl
   sudo supervisorctl status
   tail -f /var/log/supervisor/backend.err.log
   tail -f /var/log/supervisor/frontend.err.log
   ```

2. **Testez les services**:
   ```bash
   # Test backend
   curl http://localhost:8001/health
   
   # Test frontend
   curl http://localhost:3000
   ```

3. **Redémarrage complet**:
   ```bash
   sudo supervisorctl restart all
   ```

## 🔄 Mise à jour

Pour mettre à jour l'application:

```bash
git pull origin main
./scripts/install-linux.sh  # Ou install-windows.ps1
sudo supervisorctl restart all
```

---

**Version**: 2.1.0 (Mai 2025)  
**Support**: Gestion utilisateurs unifiée avec pagination complète