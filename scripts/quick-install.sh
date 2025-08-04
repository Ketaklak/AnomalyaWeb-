#!/bin/bash
# Installation rapide d'Anomalya Corp (sans dépendances système)
# Version: 2.1.0 (Mai 2025) - Support complet de la gestion utilisateurs unifiée avec pagination
# Usage: bash quick-install.sh

# Obtenir le répertoire du script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

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

echo -e "${BLUE}🚀 Installation Rapide d'Anomalya Corp${NC}"
echo "========================================="

# Vérifier si nous sommes dans le bon répertoire
if [[ ! -f "$PROJECT_DIR/backend/server.py" ]] || [[ ! -f "$PROJECT_DIR/frontend/package.json" ]]; then
    error "Le script doit être lancé depuis le répertoire racine du projet Anomalya Corp"
    error "Structure attendue: anomalya-corp/scripts/quick-install.sh"
    exit 1
fi

info "Répertoire du projet détecté: $PROJECT_DIR"

# Vérifier les prérequis
check_requirements() {
    info "Vérification des prérequis..."
    
    # Vérifier Python
    if ! command -v python3 &> /dev/null; then
        error "Python 3 n'est pas installé. Veuillez l'installer d'abord."
        echo "  Ubuntu/Debian: sudo apt install python3 python3-pip"
        echo "  CentOS/Fedora: sudo dnf install python3 python3-pip"
        exit 1
    else
        success "Python 3 trouvé: $(python3 --version)"
    fi
    
    # Vérifier Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js n'est pas installé. Veuillez l'installer d'abord."
        echo "  Téléchargez depuis: https://nodejs.org/"
        exit 1
    else
        success "Node.js trouvé: $(node --version)"
    fi
    
    # Vérifier npm/yarn
    if command -v yarn &> /dev/null; then
        success "Yarn trouvé: $(yarn --version)"
        PACKAGE_MANAGER="yarn"
    elif command -v npm &> /dev/null; then
        success "npm trouvé: $(npm --version)"
        PACKAGE_MANAGER="npm"
    else
        error "Ni yarn ni npm n'est installé. Veuillez installer Node.js complet."
        exit 1
    fi
}

# Installation des dépendances backend
setup_backend() {
    info "Configuration du backend..."
    cd "$PROJECT_DIR/backend" || exit 1
    
    # Créer un environnement virtuel si il n'existe pas
    if [[ ! -d "venv" ]]; then
        info "Création de l'environnement virtuel Python..."
        python3 -m venv venv
    fi
    
    # Activer l'environnement virtuel
    source venv/bin/activate
    
    # Installer les dépendances
    info "Installation des dépendances Python..."
    pip install --upgrade pip
    pip install -r requirements.txt
    
    # Créer le fichier .env si il n'existe pas
    if [[ ! -f ".env" ]] && [[ -f ".env.example" ]]; then
        info "Création du fichier .env backend..."
        cp .env.example .env
    fi
    
    success "Backend configuré avec succès"
}

# Installation des dépendances frontend
setup_frontend() {
    info "Configuration du frontend..."
    cd "$PROJECT_DIR/frontend" || exit 1
    
    # Installer les dépendances
    info "Installation des dépendances Node.js..."
    if [[ "$PACKAGE_MANAGER" == "yarn" ]]; then
        yarn install
    else
        npm install
    fi
    
    # Créer le fichier .env si il n'existe pas
    if [[ ! -f ".env" ]] && [[ -f ".env.example" ]]; then
        info "Création du fichier .env frontend..."
        cp .env.example .env
    fi
    
    success "Frontend configuré avec succès"
}

# Instructions de démarrage
show_instructions() {
    echo ""
    success "🎉 Installation terminée avec succès!"
    echo ""
    info "Pour démarrer l'application:"
    echo ""
    echo -e "${YELLOW}1. Terminal Backend (dans une nouvelle fenêtre):${NC}"
    echo "   cd $PROJECT_DIR/backend"
    echo "   source venv/bin/activate"
    echo "   python server.py"
    echo ""
    echo -e "${YELLOW}2. Terminal Frontend (dans une nouvelle fenêtre):${NC}"
    echo "   cd $PROJECT_DIR/frontend"
    if [[ "$PACKAGE_MANAGER" == "yarn" ]]; then
        echo "   yarn start"
    else
        echo "   npm start"
    fi
    echo ""
    echo -e "${GREEN}3. Accéder à l'application:${NC}"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend API: http://localhost:8001"
    echo "   Admin: admin / admin123"
    echo ""
    warning "Note: Si MongoDB n'est pas installé, certaines fonctionnalités peuvent ne pas marcher."
    info "Installation complète disponible avec: ./scripts/install-linux.sh"
}

# Exécution principale
main() {
    check_requirements
    setup_backend
    setup_frontend
    show_instructions
}

# Lancer l'installation
main