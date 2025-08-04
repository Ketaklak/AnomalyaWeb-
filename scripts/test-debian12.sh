#!/bin/bash
# Script de test pour vérifier les corrections Debian 12
# Usage: bash test-debian12.sh

echo "🧪 Test des corrections Debian 12"
echo "================================="

# Tester la détection de version Python
echo "🐍 Test de détection Python:"
if apt-cache policy python3.11 | grep -q "Candidate:" 2>/dev/null; then
    echo "✅ python3.11 disponible (normal sur Debian 12)"
elif apt-cache policy python3.10 | grep -q "Candidate:" 2>/dev/null; then
    echo "✅ python3.10 disponible"
else
    echo "✅ python3 par défaut sera utilisé"
fi

# Tester la disponibilité MongoDB
echo ""
echo "🗃️ Test de disponibilité MongoDB:"
if apt-cache policy mongodb-server | grep -q "Candidate:" 2>/dev/null; then
    echo "✅ mongodb-server disponible dans les repos"
elif apt-cache policy mongodb | grep -q "Candidate:" 2>/dev/null; then
    echo "⚠️ mongodb disponible (alternative à mongodb-server)"
else
    echo "❌ mongodb-server non disponible - installation depuis repos MongoDB officiel nécessaire"
    echo "🔧 Le script installera depuis https://repo.mongodb.org/apt/debian"
fi

# Tester la version Debian
echo ""
echo "🐧 Informations système:"
if [[ -f /etc/os-release ]]; then
    . /etc/os-release
    echo "Distribution: $NAME"
    echo "Version: $VERSION"
    
    if [[ $NAME == *"Debian"* ]] && [[ $VERSION == "12"* ]]; then
        echo "✅ Debian 12 détecté - corrections spéciales seront appliquées"
    else
        echo "ℹ️ Autre distribution - installation standard"
    fi
fi

# Test des clés GPG MongoDB (simulation)
echo ""
echo "🔑 Test disponibilité clé MongoDB:"
if curl -fsSL https://pgp.mongodb.com/server-7.0.asc >/dev/null 2>&1; then
    echo "✅ Clé GPG MongoDB accessible"
else
    echo "❌ Clé GPG MongoDB non accessible (problème réseau?)"
fi

# Test repository MongoDB (simulation)
echo ""
echo "📦 Test repository MongoDB:"
if curl -fsSL http://repo.mongodb.org/apt/debian/dists/bookworm/ >/dev/null 2>&1; then
    echo "✅ Repository MongoDB pour Debian 12 accessible"
else
    echo "❌ Repository MongoDB non accessible (problème réseau?)"
fi

echo ""
echo "✅ Tests terminés"
echo "💡 Pour tester l'installation complète:"
echo "   sudo ./install-linux.sh --dry-run"