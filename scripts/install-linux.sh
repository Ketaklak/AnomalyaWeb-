#!/bin/bash
# Script d'installation automatique pour Linux (Ubuntu/Debian/CentOS/Fedora)
# Version: 2.1.0 (Mai 2025) - Support complet de la gestion utilisateurs unifiée avec pagination
# Usage: bash install-linux.sh

# Obtenir le répertoire du script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Définir les permissions d'exécution pour les scripts
chmod +x "${SCRIPT_DIR}/install-linux.sh" 2>/dev/null || true
chmod +x "${SCRIPT_DIR}/install-windows.ps1" 2>/dev/null || true

set -e  # Arrêter le script en cas d'erreur

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Messages formatés
info() { echo -e "${BLUE}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Détection de la distribution Linux
detect_os() {
    if [[ -f /etc/os-release ]]; then
        . /etc/os-release
        OS=$NAME
        VERSION=$VERSION_ID
    else
        error "Impossible de détecter la distribution Linux"
        exit 1
    fi
    info "Distribution détectée: $OS $VERSION"
}

# Installation des dépendances selon la distribution
install_dependencies() {
    info "Installation des dépendances système..."
    
    if [[ $OS == *"Ubuntu"* ]] || [[ $OS == *"Debian"* ]]; then
        sudo apt update
        sudo apt install -y python3.10 python3-pip python3-venv nodejs npm mongodb-server git curl wget gnupg2
        
        # Installer Yarn
        curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
        echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
        sudo apt update && sudo apt install -y yarn
        
    elif [[ $OS == *"Kali"* ]]; then
        info "Configuration spéciale pour Kali Linux détectée"
        
        # Vérifier si on est root (courant sur Kali)
        if [[ $EUID -eq 0 ]]; then
            warning "Exécution en tant que root détectée (normal sur Kali)"
            SUDO_CMD=""
        else
            SUDO_CMD="sudo"
        fi
        
        # Mettre à jour les repositories
        $SUDO_CMD apt update
        
        # Installation des dépendances avec alternatives pour Kali
        info "Installation de Python et outils de développement..."
        $SUDO_CMD apt install -y python3 python3-pip python3-venv python3-dev build-essential git curl wget gnupg2 software-properties-common
        
        # Node.js et npm - utiliser la version des repos Kali ou installer via NodeSource
        info "Installation de Node.js et npm..."
        if $SUDO_CMD apt install -y nodejs npm; then
            success "Node.js installé depuis les repositories Kali"
        else
            warning "Installation de Node.js via NodeSource..."
            curl -fsSL https://deb.nodesource.com/setup_20.x | $SUDO_CMD -E bash -
            $SUDO_CMD apt install -y nodejs
        fi
        
        # MongoDB - installation spéciale pour Kali
        info "Installation de MongoDB pour Kali Linux..."
        if $SUDO_CMD apt install -y mongodb; then
            success "MongoDB installé depuis les repositories Kali"
        else
            warning "MongoDB non disponible dans les repos Kali, installation alternative..."
            # Installer MongoDB community edition
            curl -fsSL https://pgp.mongodb.com/server-7.0.asc | $SUDO_CMD gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
            echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] http://repo.mongodb.org/apt/debian bookworm/mongodb-org/7.0 main" | $SUDO_CMD tee /etc/apt/sources.list.d/mongodb-org-7.0.list
            $SUDO_CMD apt update
            $SUDO_CMD apt install -y mongodb-org || warning "MongoDB installation échouée, fonctionnalité limitée"
        fi
        
        # Installer Yarn avec méthode Kali-compatible
        info "Installation de Yarn..."
        if ! command -v yarn &> /dev/null; then
            $SUDO_CMD npm install -g yarn || {
                warning "Installation Yarn via npm échouée, utilisation d'npm comme fallback"
                info "Yarn sera remplacé par npm pour ce système"
            }
        else
            success "Yarn déjà installé"
        fi
        
        # Dépendances supplémentaires pour Kali
        info "Installation de dépendances supplémentaires pour Kali..."
        $SUDO_CMD apt install -y python3-setuptools python3-wheel python3-crypto python3-cryptography
        
    elif [[ $OS == *"CentOS"* ]] || [[ $OS == *"Red Hat"* ]] || [[ $OS == *"Fedora"* ]]; then
        sudo dnf install -y python3 python3-pip nodejs npm mongodb-server git curl wget
        
        # Installer Yarn
        curl -sL https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo
        sudo dnf install -y yarn
        
    elif [[ $OS == *"Arch"* ]]; then
        sudo pacman -Syu --noconfirm python nodejs npm mongodb git curl wget yarn
        
    else
        warning "Distribution non supportée automatiquement. Installation manuelle requise."
        warning "Distributions supportées: Ubuntu, Debian, Kali Linux, CentOS, RHEL, Fedora, Arch Linux"
        exit 1
    fi
    
    success "Dépendances système installées"
}

# Configuration MongoDB
setup_mongodb() {
    info "Configuration de MongoDB..."
    
    # Déterminer si nous sommes sur Kali (peut être en root)
    if [[ $OS == *"Kali"* ]] && [[ $EUID -eq 0 ]]; then
        SUDO_CMD=""
    else
        SUDO_CMD="sudo"
    fi
    
    # Démarrer et activer MongoDB - gestion spéciale pour Kali
    if [[ $OS == *"Kali"* ]]; then
        info "Configuration MongoDB pour Kali Linux..."
        
        # Tentative avec différents noms de service MongoDB sur Kali
        if $SUDO_CMD systemctl start mongod 2>/dev/null; then
            success "Service mongod démarré"
            $SUDO_CMD systemctl enable mongod
        elif $SUDO_CMD systemctl start mongodb 2>/dev/null; then
            success "Service mongodb démarré" 
            $SUDO_CMD systemctl enable mongodb
        elif $SUDO_CMD systemctl start mongodb-org 2>/dev/null; then
            success "Service mongodb-org démarré"
            $SUDO_CMD systemctl enable mongodb-org
        else
            warning "Impossible de démarrer MongoDB via systemctl"
            info "Tentative de démarrage manuel de MongoDB..."
            
            # Créer le répertoire de données MongoDB si nécessaire
            $SUDO_CMD mkdir -p /var/lib/mongodb
            $SUDO_CMD chown mongodb:mongodb /var/lib/mongodb 2>/dev/null || true
            
            # Démarrage manuel en arrière-plan
            if command -v mongod &> /dev/null; then
                info "Démarrage manuel de mongod..."
                $SUDO_CMD mongod --dbpath /var/lib/mongodb --logpath /var/log/mongodb/mongod.log --fork 2>/dev/null || {
                    warning "MongoDB non configuré automatiquement. Configuration manuelle requise."
                }
            else
                warning "MongoDB non installé correctement. Certaines fonctionnalités seront limitées."
            fi
        fi
    else
        # Configuration standard pour autres distributions
        $SUDO_CMD systemctl start mongod 2>/dev/null || {
            warning "Service mongod non trouvé, tentative avec mongodb"
            $SUDO_CMD systemctl start mongodb 2>/dev/null || {
                error "Impossible de démarrer MongoDB"
                exit 1
            }
            $SUDO_CMD systemctl enable mongodb
        }
        
        $SUDO_CMD systemctl enable mongod 2>/dev/null || $SUDO_CMD systemctl enable mongodb
    fi
    
    # Attendre que MongoDB soit prêt
    info "Attente de l'initialisation MongoDB..."
    sleep 5
    
    # Tester la connexion MongoDB
    if command -v mongo &> /dev/null; then
        if mongo --eval "db.runCommand('ping').ok" admin &>/dev/null; then
            success "MongoDB configuré et accessible"
        else
            warning "MongoDB installé mais connexion non testable"
        fi
    elif command -v mongosh &> /dev/null; then
        if mongosh --eval "db.runCommand('ping').ok" admin &>/dev/null; then
            success "MongoDB configuré et accessible (mongosh)"
        else
            warning "MongoDB installé mais connexion non testable"
        fi
    else
        warning "Client MongoDB (mongo/mongosh) non disponible pour test"
    fi
    
    # Créer la base de données (optionnel)
    mongo --eval "
        use anomalya_db;
        db.createCollection('users');
        print('Base de données anomalya_db créée');
    " 2>/dev/null || warning "Impossible de créer la base de données (MongoDB peut ne pas être démarré)"
    
    success "MongoDB configuré"
}

# Configuration du projet
setup_project() {
    info "Configuration du projet Anomalya Corp..."
    
    # Vérifier si on est dans le bon répertoire
    if [[ ! -f "package.json" ]] && [[ ! -d "backend" ]] && [[ ! -d "frontend" ]]; then
        error "Veuillez exécuter ce script depuis le répertoire racine du projet"
        exit 1
    fi
    
    # Configuration Backend
    info "Configuration du backend..."
    cd backend
    
    # Créer environnement virtuel Python
    python3 -m venv venv
    source venv/bin/activate
    
    # Installer les dépendances Python
    pip install --upgrade pip
    pip install -r requirements.txt
    
    # Copier le fichier de configuration
    if [[ ! -f .env ]]; then
        cp .env.example .env
        warning "Fichier .env créé depuis .env.example. Veuillez le configurer avant de lancer l'application."
    fi
    
    # Initialiser la base de données
    python init_db.py
    
    cd ..
    success "Backend configuré"
    
    # Configuration Frontend
    info "Configuration du frontend..."
    cd frontend
    
    # Installer les dépendances Node.js
    yarn install
    
    # Copier le fichier de configuration
    if [[ ! -f .env ]]; then
        cp .env.example .env
        warning "Fichier .env créé depuis .env.example. Veuillez le configurer avant de lancer l'application."
    fi
    
    cd ..
    success "Frontend configuré"
}

# Créer les scripts de démarrage
create_startup_scripts() {
    info "Création des scripts de démarrage..."
    
    # Script de démarrage principal
    cat > start.sh << 'EOF'
#!/bin/bash
# Script de démarrage Anomalya Corp

echo "🚀 Démarrage d'Anomalya Corp..."

# Démarrer MongoDB
sudo systemctl start mongod 2>/dev/null || sudo systemctl start mongodb

# Démarrer le backend
echo "⚡ Démarrage du backend..."
cd backend
source venv/bin/activate
python server.py &
BACKEND_PID=$!
cd ..

# Attendre que le backend démarre
sleep 5

# Démarrer le frontend
echo "🌐 Démarrage du frontend..."
cd frontend
yarn start &
FRONTEND_PID=$!
cd ..

echo "✅ Anomalya Corp démarré !"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8001"
echo "📚 Documentation API: http://localhost:8001/docs"
echo "👤 Compte admin: admin / admin123"
echo ""
echo "Pour arrêter les services:"
echo "kill $BACKEND_PID $FRONTEND_PID"

# Attendre que les processus se terminent
wait
EOF
    
    chmod +x start.sh
    
    # Script d'arrêt
    cat > stop.sh << 'EOF'
#!/bin/bash
# Script d'arrêt Anomalya Corp

echo "🛑 Arrêt d'Anomalya Corp..."

# Arrêter les processus Node.js et Python
pkill -f "yarn start"
pkill -f "python server.py"
pkill -f "react-scripts start"

echo "✅ Services arrêtés"
EOF
    
    chmod +x stop.sh
    
    success "Scripts de démarrage créés (start.sh, stop.sh)"
}

# Installation du service système (optionnel)
install_system_service() {
    read -p "Voulez-vous installer Anomalya Corp comme service système ? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        info "Installation du service système..."
        
        PROJECT_DIR=$(pwd)
        
        sudo tee /etc/systemd/system/anomalya.service > /dev/null << EOF
[Unit]
Description=Anomalya Corp Application
After=network.target mongod.service
Requires=mongod.service

[Service]
Type=forking
User=$USER
WorkingDirectory=$PROJECT_DIR
ExecStart=$PROJECT_DIR/start.sh
ExecStop=$PROJECT_DIR/stop.sh
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
        
        sudo systemctl daemon-reload
        sudo systemctl enable anomalya
        
        success "Service système installé. Utilisez 'sudo systemctl start anomalya' pour démarrer"
    fi
}

# Configuration du firewall
configure_firewall() {
    if command -v ufw &> /dev/null; then
        read -p "Configurer le firewall UFW pour autoriser les ports 3000 et 8001 ? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            info "Configuration du firewall..."
            sudo ufw allow 3000
            sudo ufw allow 8001
            success "Ports 3000 et 8001 autorisés dans UFW"
        fi
    fi
}

# Fonction principale
main() {
    echo "🚀 Installation d'Anomalya Corp pour Linux"
    echo "=========================================="
    
    detect_os
    install_dependencies
    setup_mongodb
    setup_project
    create_startup_scripts
    install_system_service
    configure_firewall
    
    echo ""
    success "🎉 Installation terminée avec succès !"
    echo ""
    echo "📋 Prochaines étapes:"
    echo "1. Configurez les fichiers .env dans backend/ et frontend/"
    echo "2. Lancez l'application avec: ./start.sh"
    echo "3. Accédez à http://localhost:3000"
    echo "4. Connectez-vous avec admin / admin123"
    echo ""
    echo "📚 Documentation complète: README.md"
    echo "🐛 En cas de problème: https://github.com/anomalya/corp/issues"
}

# Vérifier les permissions sudo
if ! sudo -n true 2>/dev/null; then
    error "Ce script nécessite des privilèges sudo. Veuillez exécuter: sudo -v"
    exit 1
fi

# Exécuter l'installation
main