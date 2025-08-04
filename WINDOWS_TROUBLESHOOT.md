# 🪟 Guide de Dépannage Windows - Anomalya Corp

Solutions rapides pour les problèmes courants sur Windows.

## 🚨 Problème : MongoDB Compass vs MongoDB Server

**Symptômes :**
- ✅ Vous avez MongoDB Compass installé
- ❌ "Client mongo non disponible"
- ❌ Backend ne démarre pas (port 8001)
- ❌ Service "MongoDB" introuvable

### 🔧 SOLUTION : MongoDB Compass ≠ MongoDB Server

**MongoDB Compass** = Interface graphique seulement  
**MongoDB Server** = Base de données nécessaire pour l'application

#### Solution Automatique (Recommandée)
```powershell
# Installation automatique MongoDB Server
PowerShell -ExecutionPolicy Bypass -File scripts\install-mongodb-server.ps1
```

#### Solution via Chocolatey
```powershell
# 1. Installer Chocolatey si pas déjà fait
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# 2. Installer MongoDB Server
choco install mongodb
```

#### Solution Manuelle
1. **Télécharger MongoDB Community Server** :
   - 🌐 Allez sur : https://www.mongodb.com/try/download/community
   - Sélectionnez **"Server"** (pas Compass)
   - Platform: Windows, Package: msi

2. **Installation** :
   - Cochez "Install MongoDB as a Service"
   - Cochez "Install MongoDB Compass" (optionnel, vous l'avez déjà)

3. **Vérification** :
   - Service "MongoDB" doit apparaître dans services.msc
   - Port 27017 doit être accessible

## 🚨 Problème : "Client mongo non disponible pour test de connexion"

**Symptômes :**
- ✅ Service MongoDB démarré avec succès
- ❌ Pas d'actualités dans l'application
- ❌ Impossible de se connecter
- ⚠️ Message : "Client mongo non disponible"

### 🔧 Solutions Rapides

#### Solution 1: Script Automatique (Recommandé)
```powershell
# Diagnostic complet
PowerShell -ExecutionPolicy Bypass -File scripts\diagnose-windows.ps1

# Correction automatique du PATH
PowerShell -ExecutionPolicy Bypass -File scripts\fix-mongodb-path.ps1
```

#### Solution 2: Correction Manuelle du PATH
```powershell
# 1. Trouver MongoDB
Get-ChildItem "C:\Program Files\MongoDB" -Recurse -Name "mongo.exe"

# 2. Ajouter au PATH (remplacez par votre chemin)
$mongoPath = "C:\Program Files\MongoDB\Server\7.0\bin"
[Environment]::SetEnvironmentVariable("PATH", $env:PATH + ";$mongoPath", "User")

# 3. Redémarrer PowerShell et tester
mongosh --eval "db.runCommand('ping').ok"
```

#### Solution 3: Réinstallation MongoDB
```powershell
# Via Chocolatey (si installé)
choco uninstall mongodb
choco install mongodb

# Ou télécharger MongoDB Community Edition
# https://www.mongodb.com/try/download/community
```

## 🚨 Problème : MongoDB ne démarre pas

### Vérifications Services Windows
```powershell
# Ouvrir les Services Windows
services.msc

# Chercher et démarrer:
# - MongoDB
# - mongod  
# - MongoDB Server
```

### Démarrage Manuel
```powershell
# Créer le répertoire de données
New-Item -ItemType Directory -Force -Path "$env:ProgramData\MongoDB\data\db"

# Démarrer MongoDB manuellement
& "C:\Program Files\MongoDB\Server\*\bin\mongod.exe" --dbpath "$env:ProgramData\MongoDB\data\db"
```

## 🚨 Problème : Erreurs d'authentification/JWT

### Vérifier le fichier .env
```powershell
# 1. Vérifier que .env existe
Test-Path "backend\.env"

# 2. Si non, copier depuis l'exemple
Copy-Item "backend\.env.example" "backend\.env"

# 3. Modifier la SECRET_KEY
notepad backend\.env
```

**Changez cette ligne dans .env :**
```env
SECRET_KEY=votre-cle-secrete-tres-longue-et-complexe-32-caracteres-minimum
```

## 🚨 Problème : Ports déjà utilisés

### Vérifier les ports
```powershell
# Vérifier les ports utilisés
netstat -ano | findstr ":27017"  # MongoDB
netstat -ano | findstr ":8001"   # Backend
netstat -ano | findstr ":3000"   # Frontend
```

### Libérer un port (si nécessaire)
```powershell
# Tuer le processus utilisant le port (remplacez PID)
taskkill /PID 1234 /F
```

## 🚨 Problème : Dépendances Python/Node.js

### Vérifier les versions
```powershell
python --version    # Python 3.8+
node --version      # Node.js 18+
npm --version       # npm 8+
yarn --version      # Yarn (optionnel)
```

### Réinstaller les dépendances
```powershell
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd ..\frontend
npm install
# ou
yarn install
```

## 📊 Test de Fonctionnement Complet

### 1. Vérifier tous les services
```powershell
# MongoDB
mongosh --eval "db.runCommand('ping').ok"

# Backend (dans un nouveau terminal)
cd backend
python server.py

# Frontend (dans un nouveau terminal)
cd frontend
npm start
```

### 2. Tester l'application
- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:8001
- **Admin** : Se connecter avec `admin` / `admin123`

### 3. Vérifier la base de données
```powershell
mongosh
> use anomalya_db
> db.users.find()
> db.news.find()
```

## 🆘 Si Rien ne Fonctionne

### Réinstallation Complète
```powershell
# 1. Sauvegarder vos données personnalisées
# 2. Supprimer le dossier anomalya-corp
# 3. Réinstaller MongoDB
choco install mongodb

# 4. Recloner et réinstaller
git clone <votre-repo>
cd anomalya-corp
PowerShell -ExecutionPolicy Bypass -File scripts\install-windows.ps1
```

### Support Technique
- 🔍 **Diagnostic** : `scripts\diagnose-windows.ps1`
- 🔧 **PATH MongoDB** : `scripts\fix-mongodb-path.ps1`
- 📋 **Logs** : Vérifiez les messages d'erreur dans les terminaux
- 🌐 **Ports** : Assurez-vous qu'aucun autre service n'utilise 27017, 8001, 3000

---

**Version** : 2.1.1 (Mai 2025)  
**Testé sur** : Windows 10/11