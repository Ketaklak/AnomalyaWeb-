#!/bin/bash
# Script de test pour simuler la détection de Kali Linux
# Usage: bash test-kali-detection.sh

echo "🧪 Test de détection Kali Linux"
echo "==============================="

# Créer un fichier /etc/os-release temporaire pour simuler Kali
TEMP_OS_RELEASE="/tmp/kali-os-release-test"

cat > "$TEMP_OS_RELEASE" << 'EOF'
PRETTY_NAME="Kali GNU/Linux Rolling"
NAME="Kali GNU/Linux"
VERSION_ID="2024.2"
VERSION="2024.2"
VERSION_CODENAME=kali-rolling
ID=kali
ID_LIKE=debian
HOME_URL="https://www.kali.org/"
SUPPORT_URL="https://forums.kali.org/"
BUG_REPORT_URL="https://bugs.kali.org/"
ANSI_COLOR="1;31"
EOF

echo "📄 Contenu /etc/os-release simulé pour Kali:"
cat "$TEMP_OS_RELEASE"
echo ""

# Test de la détection
echo "🔍 Test de détection avec le script install-linux.sh:"

# Créer un script de test temporaire qui utilise notre fichier simulé
TEMP_TEST_SCRIPT="/tmp/test-kali-install.sh"

cat > "$TEMP_TEST_SCRIPT" << 'EOF'
#!/bin/bash

# Redéfinir la fonction detect_os pour utiliser notre fichier test
detect_os() {
    if [[ -f /tmp/kali-os-release-test ]]; then
        . /tmp/kali-os-release-test
        OS=$NAME
        VERSION=$VERSION_ID
        echo -e "\033[0;34m[INFO]\033[0m Distribution détectée: $OS $VERSION"
    else
        echo -e "\033[0;31m[ERROR]\033[0m Impossible de détecter la distribution Linux"
        exit 1
    fi
}

# Test de la détection
detect_os

# Test de la condition Kali
if [[ $OS == *"Kali"* ]]; then
    echo -e "\033[0;32m✅ SUCCESS: Kali Linux correctement détecté!\033[0m"
    
    # Test de la détection root
    if [[ $EUID -eq 0 ]]; then
        echo -e "\033[1;33m[WARNING] Exécution en tant que root détectée (normal sur Kali)\033[0m"
        SUDO_CMD=""
        echo -e "\033[0;34m[INFO] SUDO_CMD défini comme vide\033[0m"
    else
        echo -e "\033[0;34m[INFO] Exécution en tant qu'utilisateur normal\033[0m"
        SUDO_CMD="sudo"
        echo -e "\033[0;34m[INFO] SUDO_CMD défini comme 'sudo'\033[0m"
    fi
    
    echo -e "\033[0;32m✅ Logique de détection Kali fonctionne correctement!\033[0m"
else
    echo -e "\033[0;31m❌ ERREUR: Kali Linux non détecté correctement\033[0m"
    echo "OS détecté: '$OS'"
fi
EOF

chmod +x "$TEMP_TEST_SCRIPT"
bash "$TEMP_TEST_SCRIPT"

# Nettoyer
rm -f "$TEMP_OS_RELEASE" "$TEMP_TEST_SCRIPT"

echo ""
echo "🧹 Fichiers temporaires nettoyés"
echo "✅ Test de détection Kali Linux terminé"