#!/bin/bash
# Script de démarrage principal pour Anomalya Corp

echo "🚀 Démarrage d'Anomalya Corp..."

# Vérifier et démarrer MongoDB
echo "📊 Vérification de MongoDB..."
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚡ Démarrage de MongoDB..."
    sudo systemctl start mongod 2>/dev/null || sudo systemctl start mongodb 2>/dev/null || {
        echo "❌ Impossible de démarrer MongoDB automatiquement"
        echo "📝 Démarrez MongoDB manuellement avec: sudo systemctl start mongod"
        exit 1
    }
else
    echo "✅ MongoDB déjà en cours d'exécution"
fi

# Démarrer le backend
echo "⚡ Démarrage du backend..."
cd backend
source venv/bin/activate 2>/dev/null || {
    echo "❌ Environnement virtuel Python non trouvé"
    echo "📝 Exécutez d'abord: python -m venv venv && source venv/bin/activate && pip install -r requirements.txt"
    exit 1
}

python server.py &
BACKEND_PID=$!
echo "✅ Backend démarré (PID: $BACKEND_PID)"

cd ..

# Attendre que le backend soit prêt
echo "⏳ Attente du backend..."
for i in {1..30}; do
    if curl -f http://localhost:8001/health > /dev/null 2>&1; then
        echo "✅ Backend prêt !"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Timeout: Backend non accessible"
        kill $BACKEND_PID 2>/dev/null
        exit 1
    fi
    sleep 1
done

# Démarrer le frontend
echo "🌐 Démarrage du frontend..."
cd frontend
yarn start &
FRONTEND_PID=$!
echo "✅ Frontend démarré (PID: $FRONTEND_PID)"

cd ..

echo ""
echo "🎉 Anomalya Corp démarré avec succès !"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8001"
echo "📚 Documentation API: http://localhost:8001/docs"
echo "💾 Base de données: MongoDB sur port 27017"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "👤 Compte admin par défaut:"
echo "   📧 Utilisateur: admin"
echo "   🔑 Mot de passe: admin123"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Pour arrêter les services, exécutez: ./stop.sh"
echo "Ou utilisez: kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "📝 Logs backend disponibles dans backend/logs/"
echo "🔍 Surveillez les logs avec: tail -f backend/logs/app.log"
echo ""

# Garder le script actif et surveiller les processus
trap 'echo "🛑 Arrêt demandé..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0' INT TERM

# Attendre que les processus se terminent
wait