#!/bin/bash
chmod +x /app/scripts/install-linux.sh
chmod +x /app/scripts/install-windows.ps1
# Script d'installation automatique pour Linux (Ubuntu/Debian/CentOS/Fedora)
# Usage: bash install-linux.sh

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
        
    elif [[ $OS == *"CentOS"* ]] || [[ $OS == *"Red Hat"* ]] || [[ $OS == *"Fedora"* ]]; then
        sudo dnf install -y python3 python3-pip nodejs npm mongodb-server git curl wget
        
        # Installer Yarn
        curl -sL https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo
        sudo dnf install -y yarn
        
    elif [[ $OS == *"Arch"* ]]; then
        sudo pacman -Syu --noconfirm python nodejs npm mongodb git curl wget yarn
        
    else
        warning "Distribution non supportée automatiquement. Installation manuelle requise."
        exit 1
    fi
    
    success "Dépendances système installées"
}

# Configuration MongoDB
setup_mongodb() {
    info "Configuration de MongoDB..."
    
    # Démarrer et activer MongoDB
    sudo systemctl start mongod 2>/dev/null || {
        warning "Service mongod non trouvé, tentative avec mongodb"
        sudo systemctl start mongodb 2>/dev/null || {
            error "Impossible de démarrer MongoDB"
            exit 1
        }
        sudo systemctl enable mongodb
    }
    
    sudo systemctl enable mongod 2>/dev/null || sudo systemctl enable mongodb
    
    # Attendre que MongoDB soit prêt
    sleep 5
    
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