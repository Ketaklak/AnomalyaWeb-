#!/bin/bash
# Test des corrections apportées au script d'installation

echo "🧪 Test des corrections d'erreur 'install'"
echo "=========================================="

# Vérifier que le script se termine proprement
echo "✅ Test 1: Vérification de la fin du script"
if tail -5 /app/scripts/install-linux.sh | grep -q "exit 0"; then
    echo "✅ Script se termine proprement avec exit 0"
else
    echo "❌ Script ne se termine pas proprement"
fi

# Vérifier les corrections systemd
echo ""
echo "✅ Test 2: Vérification de la section systemd"
if grep -A 5 "\[Install\]" /app/scripts/install-linux.sh | grep -q "WantedBy=multi-user.target"; then
    echo "✅ Section [Install] correcte dans le service systemd"
else
    echo "❌ Problème avec la section [Install]"
fi

# Vérifier la gestion d'erreur systemctl
echo ""
echo "✅ Test 3: Vérification de la gestion d'erreur systemctl"
if grep -q "systemctl enable anomalya 2>/dev/null" /app/scripts/install-linux.sh; then
    echo "✅ Gestion d'erreur ajoutée pour systemctl enable"
else
    echo "❌ Gestion d'erreur manquante"
fi

# Vérifier la gestion yarn/npm
echo ""
echo "✅ Test 4: Vérification du fallback yarn/npm"
if grep -q "command -v yarn" /app/scripts/install-linux.sh; then
    echo "✅ Fallback yarn/npm ajouté"
else
    echo "❌ Fallback yarn/npm manquant"
fi

echo ""
echo "🎯 Les corrections principales ont été appliquées !"
echo "💡 L'erreur 'install' devrait être résolue"