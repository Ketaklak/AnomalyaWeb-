# 🛡️ Support Kali Linux - Anomalya Corp

Documentation spécialisée pour l'installation et la configuration d'Anomalya Corp sur Kali Linux.

## 🎯 Compatibilité

### Versions Kali Supportées
- ✅ **Kali Linux Rolling** 2023.1+
- ✅ **Kali Linux 2024.1** et versions ultérieures
- ✅ **Kali Linux 2024.2** (testé)

### Architecture Supportée
- ✅ **x86_64** (Intel/AMD 64-bit)
- ✅ **ARM64** (architectures ARM)

## 🔧 Fonctionnalités Spéciales Kali

### Détection Automatique Root
Le script détecte automatiquement si vous êtes en mode root (courant sur Kali) :

```bash
# Mode root détecté automatiquement
[WARNING] Exécution en tant que root détectée (normal sur Kali)
[INFO] SUDO_CMD défini comme vide
```

### Gestion Packages Kali
Installation intelligente avec fallback :

1. **Tentative repositories Kali** d'abord
2. **Fallback repositories externes** si nécessaire  
3. **Installation alternative** pour packages indisponibles

### MongoDB sur Kali
Support spécialisé MongoDB :

```bash
# Tentative 1: Package Kali natif
apt install -y mongodb

# Tentative 2: MongoDB Community Edition
# Avec clés GPG et repository officiel

# Tentative 3: Démarrage manuel si systemctl échoue
mongod --dbpath /var/lib/mongodb --logpath /var/log/mongodb/mongod.log --fork
```

## 🚀 Installation sur Kali

### Installation Standard
```bash
# Télécharger le projet
git clone <votre-repo>
cd anomalya-corp

# Donner permissions (important)
chmod +x scripts/install-linux.sh

# Lancer installation
./scripts/install-linux.sh
```

### Installation avec Verbose (Recommandé)
```bash
# Pour voir tous les détails sur Kali
bash -x scripts/install-linux.sh
```

### Installation Mode Utilisateur Normal
```bash
# Si vous utilisez Kali en mode utilisateur (non-root)
sudo ./scripts/install-linux.sh
```

## 🔍 Spécificités Techniques

### Détection OS
Le script reconnaît Kali via `/etc/os-release` :
```bash
NAME="Kali GNU/Linux"
ID=kali
ID_LIKE=debian
```

### Commandes Spéciales Kali
```bash
# Python et développement
apt install -y python3 python3-pip python3-venv python3-dev build-essential

# Node.js avec fallback NodeSource
apt install -y nodejs npm || curl -fsSL https://deb.nodesource.com/setup_20.x | bash -

# MongoDB avec multiples tentatives
apt install -y mongodb || apt install -y mongodb-org

# Dépendances crypto spéciales Kali
apt install -y python3-setuptools python3-wheel python3-crypto python3-cryptography
```

### Services MongoDB Kali
Le script teste plusieurs noms de service :
1. `mongod` (standard)
2. `mongodb` (Kali package)
3. `mongodb-org` (community edition)
4. Démarrage manuel en fallback

## 🛠️ Dépannage Kali

### Problème 1: MongoDB ne démarre pas
```bash
# Vérifier les services disponibles
systemctl list-unit-files | grep mongo

# Démarrage manuel
sudo mkdir -p /var/lib/mongodb
sudo chown mongodb:mongodb /var/lib/mongodb
sudo mongod --dbpath /var/lib/mongodb --fork
```

### Problème 2: Permissions Python
```bash
# Sur Kali, parfois pip a besoin de permissions spéciales
pip3 install --user -r requirements.txt
# Ou
pip3 install --break-system-packages -r requirements.txt
```

### Problème 3: Node.js version ancienne
```bash
# Mise à jour via NodeSource sur Kali
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt install -y nodejs
```

### Problème 4: Yarn non disponible  
```bash
# Installation via npm sur Kali
sudo npm install -g yarn
# Ou utilisation npm comme fallback
export PACKAGE_MANAGER="npm"
```

## ✅ Tests de Validation

### Test 1: Détection OS
```bash
# Vérifier la détection Kali
source /etc/os-release
echo "OS détecté: $NAME"
# Doit afficher: Kali GNU/Linux
```

### Test 2: Services MongoDB
```bash
# Tester les services MongoDB
systemctl status mongod || systemctl status mongodb || systemctl status mongodb-org
```

### Test 3: Python/Node.js
```bash
# Vérifier les versions
python3 --version    # Python 3.8+
node --version       # Node.js 18+
npm --version        # npm 8+
yarn --version       # Yarn (optionnel)
```

### Test 4: Application Complète
```bash
# Test backend
cd backend && python3 server.py &
curl http://localhost:8001/health

# Test frontend  
cd frontend && (yarn start || npm start) &
curl http://localhost:3000
```

## 📊 Performances Kali

### Ressources Minimales
- **RAM** : 2 GB (4 GB recommandé)
- **Disque** : 5 GB espace libre  
- **CPU** : 1 core (2+ cores recommandé)

### Optimisations Kali
- MongoDB configuré avec paramètres légers
- Node.js avec cache optimisé
- Python venv isolé pour éviter conflits

## 🔒 Sécurité Kali

### Considérations Spéciales
- 🛡️ **Mode root** : Application peut tourner en root sur Kali (attention production)
- 🌐 **Firewall** : Configurer iptables si nécessaire  
- 🔐 **Permissions** : Vérifier droits fichiers MongoDB

### Configuration Sécurisée
```bash
# Créer utilisateur dédié (recommandé)
sudo useradd -m -s /bin/bash anomalya
sudo su - anomalya

# Ou utiliser utilisateur kali standard
sudo usermod -aG sudo kali
su - kali
```

---

**Testé sur** : Kali Linux 2024.2 Rolling  
**Statut** : ✅ Production Ready  
**Support** : Complet avec fallbacks automatiques