# Script de correction Backend Python pour Windows
# Usage: PowerShell -ExecutionPolicy Bypass -File fix-backend.ps1

Write-Host "🔧 Correction Backend Python - Anomalya Corp" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Yellow

# 1. Vérifier et corriger Python
Write-Host "`n1. 🐍 Vérification Python:" -ForegroundColor Cyan

try {
    $pythonVersion = python --version 2>$null
    if ($pythonVersion) {
        Write-Host "   ✅ Python trouvé: $pythonVersion" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Python non trouvé. Installation nécessaire..." -ForegroundColor Red
        
        if (Get-Command choco -ErrorAction SilentlyContinue) {
            Write-Host "   📦 Installation Python via Chocolatey..." -ForegroundColor Yellow
            choco install python -y
            refreshenv
        } else {
            Write-Host "   💡 Veuillez installer Python manuellement:" -ForegroundColor Yellow
            Write-Host "      - https://www.python.org/downloads/" -ForegroundColor Gray
            Write-Host "      - Cochez 'Add Python to PATH' durant l'installation" -ForegroundColor Gray
            return
        }
    }
} catch {
    Write-Host "   ❌ Erreur Python: $_" -ForegroundColor Red
    return
}

# 2. Aller dans le dossier backend
if (-not (Test-Path "backend")) {
    Write-Host "`n❌ Dossier 'backend' non trouvé!" -ForegroundColor Red
    Write-Host "💡 Exécutez ce script depuis la racine du projet anomalya-corp" -ForegroundColor Yellow
    return
}

Set-Location "backend"
Write-Host "`n2. 📁 Positionnement dans /backend" -ForegroundColor Cyan

# 3. Installer les dépendances
Write-Host "`n3. 📦 Installation des dépendances Python..." -ForegroundColor Cyan

if (Test-Path "requirements.txt") {
    Write-Host "   📋 Installation depuis requirements.txt..." -ForegroundColor Yellow
    
    try {
        # Mise à jour pip d'abord
        Write-Host "   🔄 Mise à jour pip..." -ForegroundColor Gray
        python -m pip install --upgrade pip 2>$null
        
        # Installation des dépendances
        Write-Host "   📦 Installation des packages..." -ForegroundColor Gray
        $installResult = python -m pip install -r requirements.txt 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✅ Dépendances installées avec succès!" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️ Installation avec des warnings:" -ForegroundColor Yellow
            Write-Host "      $installResult" -ForegroundColor Gray
        }
        
    } catch {
        Write-Host "   ❌ Erreur installation: $_" -ForegroundColor Red
        Write-Host "   💡 Essayez manuellement: cd backend && pip install -r requirements.txt" -ForegroundColor Yellow
    }
    
} else {
    Write-Host "   ❌ requirements.txt non trouvé!" -ForegroundColor Red
}

# 4. Vérifier le fichier .env
Write-Host "`n4. ⚙️ Vérification configuration (.env):" -ForegroundColor Cyan

if (Test-Path ".env") {
    Write-Host "   ✅ Fichier .env trouvé" -ForegroundColor Green
    
    # Vérifier les variables importantes
    $envContent = Get-Content ".env"
    $mongoUrl = $envContent | Where-Object { $_ -like "MONGO_URL*" }
    $secretKey = $envContent | Where-Object { $_ -like "SECRET_KEY*" }
    
    if ($mongoUrl -and $mongoUrl -match "mongodb://localhost:27017") {
        Write-Host "   ✅ MONGO_URL correcte" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️ MONGO_URL peut-être incorrecte" -ForegroundColor Yellow
    }
    
    if ($secretKey -and $secretKey.Length -gt 20) {
        Write-Host "   ✅ SECRET_KEY configurée" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️ SECRET_KEY faible ou manquante" -ForegroundColor Yellow
    }
    
} else {
    Write-Host "   ⚠️ Fichier .env manquant. Création depuis .env.example..." -ForegroundColor Yellow
    
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "   ✅ Fichier .env créé depuis .env.example" -ForegroundColor Green
    } else {
        Write-Host "   ❌ .env.example aussi manquant!" -ForegroundColor Red
    }
}

# 5. Test de démarrage du backend
Write-Host "`n5. 🚀 Test de démarrage Backend:" -ForegroundColor Cyan

try {
    Write-Host "   🧪 Test d'import des modules critiques..." -ForegroundColor Yellow
    
    $testScript = @"
import sys
import os

# Test des imports principaux
try:
    import fastapi
    print('✅ FastAPI: OK')
except Exception as e:
    print(f'❌ FastAPI: {e}')

try:
    import uvicorn
    print('✅ Uvicorn: OK') 
except Exception as e:
    print(f'❌ Uvicorn: {e}')

try:
    import pymongo
    print('✅ PyMongo: OK')
except Exception as e:
    print(f'❌ PyMongo: {e}')

try:
    from pymongo import MongoClient
    client = MongoClient('mongodb://localhost:27017')
    client.admin.command('ping')
    print('✅ MongoDB Connection: OK')
    client.close()
except Exception as e:
    print(f'❌ MongoDB Connection: {e}')

# Test import du serveur
try:
    import server
    print('✅ Server Import: OK')
except Exception as e:
    print(f'❌ Server Import: {e}')
"@
    
    $testResult = python -c $testScript 2>&1
    
    Write-Host "   📋 Résultats:" -ForegroundColor White
    $testResult -split "`n" | ForEach-Object {
        if ($_ -match "✅") {
            Write-Host "      $_" -ForegroundColor Green
        } elseif ($_ -match "❌") {
            Write-Host "      $_" -ForegroundColor Red
        } else {
            Write-Host "      $_" -ForegroundColor Gray
        }
    }
    
} catch {
    Write-Host "   ❌ Erreur lors du test: $_" -ForegroundColor Red
}

# 6. Tentative de démarrage réel
Write-Host "`n6. 🎯 Démarrage du serveur (test 10 secondes):" -ForegroundColor Cyan

try {
    Write-Host "   🚀 Lancement du serveur backend..." -ForegroundColor Yellow
    Write-Host "   (Appuyez sur Ctrl+C pour arrêter le test)" -ForegroundColor Gray
    
    # Démarrer le serveur en arrière-plan pour test
    $job = Start-Job -ScriptBlock {
        Set-Location $args[0]
        python server.py
    } -ArgumentList (Get-Location)
    
    # Attendre 5 secondes
    Start-Sleep -Seconds 5
    
    # Tester la connectivité
    try {
        $connection = Test-NetConnection -ComputerName "localhost" -Port 8001 -InformationLevel Quiet -WarningAction SilentlyContinue
        if ($connection) {
            Write-Host "   ✅ Backend accessible sur port 8001!" -ForegroundColor Green
            Write-Host "   🎉 SUCCESS: Backend fonctionne correctement!" -ForegroundColor Green
        } else {
            Write-Host "   ❌ Backend non accessible sur port 8001" -ForegroundColor Red
        }
    } catch {
        Write-Host "   ❌ Test de connectivité échoué" -ForegroundColor Red
    }
    
    # Arrêter le job de test
    Stop-Job $job -Force
    Remove-Job $job -Force
    
} catch {
    Write-Host "   ❌ Erreur démarrage: $_" -ForegroundColor Red
}

# Retourner à la racine
Set-Location ".."

# Recommandations finales
Write-Host "`n🎯 Prochaines étapes:" -ForegroundColor Yellow
Write-Host "====================" -ForegroundColor Yellow

Write-Host "✅ Pour démarrer le backend manuellement:" -ForegroundColor Green
Write-Host "   cd backend" -ForegroundColor Gray
Write-Host "   python server.py" -ForegroundColor Gray

Write-Host "`n✅ Pour démarrer l'application complète:" -ForegroundColor Green
Write-Host "   1. Terminal 1 - Backend:" -ForegroundColor Gray
Write-Host "      cd backend && python server.py" -ForegroundColor Gray
Write-Host "   2. Terminal 2 - Frontend:" -ForegroundColor Gray  
Write-Host "      cd frontend && npm start" -ForegroundColor Gray
Write-Host "   3. Ouvrir: http://localhost:3000" -ForegroundColor Gray

Write-Host "`n🔍 Si problèmes persistent:" -ForegroundColor Cyan
Write-Host "   .\diagnose-backend.ps1" -ForegroundColor Gray

Write-Host "`n✅ Script de correction terminé!" -ForegroundColor Green