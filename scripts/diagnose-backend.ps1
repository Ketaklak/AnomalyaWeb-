# Script de diagnostic Backend Python pour Windows
# Usage: PowerShell -ExecutionPolicy Bypass -File diagnose-backend.ps1

Write-Host "🐍 Diagnostic Backend Python - Anomalya Corp" -ForegroundColor Yellow
Write-Host "=============================================" -ForegroundColor Yellow

# 1. Vérifier Python
Write-Host "`n1. 🐍 Installation Python:" -ForegroundColor Cyan
try {
    $pythonVersion = python --version 2>$null
    if ($pythonVersion) {
        Write-Host "   ✅ Python installé: $pythonVersion" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Python non trouvé dans PATH" -ForegroundColor Red
    }
    
    $pipVersion = pip --version 2>$null
    if ($pipVersion) {
        Write-Host "   ✅ pip disponible: $pipVersion" -ForegroundColor Green
    } else {
        Write-Host "   ❌ pip non trouvé" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Erreur lors de la vérification Python: $_" -ForegroundColor Red
}

# 2. Vérifier le répertoire backend
Write-Host "`n2. 📁 Structure Backend:" -ForegroundColor Cyan
if (Test-Path "backend") {
    Write-Host "   ✅ Dossier backend trouvé" -ForegroundColor Green
    
    $backendFiles = @("server.py", "requirements.txt", ".env")
    foreach ($file in $backendFiles) {
        $fullPath = "backend\$file"
        if (Test-Path $fullPath) {
            Write-Host "   ✅ $file trouvé" -ForegroundColor Green
        } else {
            Write-Host "   ❌ $file manquant" -ForegroundColor Red
        }
    }
} else {
    Write-Host "   ❌ Dossier backend non trouvé!" -ForegroundColor Red
    Write-Host "   💡 Exécutez ce script depuis la racine du projet anomalya-corp" -ForegroundColor Yellow
}

# 3. Vérifier les dépendances Python
Write-Host "`n3. 📦 Dépendances Python:" -ForegroundColor Cyan
if (Test-Path "backend\requirements.txt") {
    Write-Host "   📋 Contenu requirements.txt:" -ForegroundColor White
    $requirements = Get-Content "backend\requirements.txt" | Select-Object -First 10
    foreach ($req in $requirements) {
        Write-Host "      $req" -ForegroundColor Gray
    }
    
    # Test d'installation des dépendances
    Write-Host "`n   🧪 Test des dépendances installées:" -ForegroundColor Cyan
    $testPackages = @("fastapi", "uvicorn", "pymongo", "python-jose", "passlib")
    foreach ($package in $testPackages) {
        try {
            $result = pip show $package 2>$null
            if ($result) {
                Write-Host "   ✅ $package: Installé" -ForegroundColor Green
            } else {
                Write-Host "   ❌ $package: Non installé" -ForegroundColor Red
            }
        } catch {
            Write-Host "   ❌ $package: Erreur de vérification" -ForegroundColor Red
        }
    }
}

# 4. Test de démarrage backend
Write-Host "`n4. 🚀 Test de démarrage Backend:" -ForegroundColor Cyan
if (Test-Path "backend\server.py") {
    Write-Host "   🧪 Tentative de démarrage du backend (test rapide)..." -ForegroundColor Yellow
    
    try {
        Set-Location "backend"
        
        # Test d'import des modules principaux
        $importTest = python -c "
import sys
sys.path.append('.')
try:
    import fastapi
    print('✅ FastAPI OK')
except ImportError as e:
    print(f'❌ FastAPI: {e}')
    
try:
    import uvicorn
    print('✅ Uvicorn OK') 
except ImportError as e:
    print(f'❌ Uvicorn: {e}')
    
try:
    import pymongo
    print('✅ PyMongo OK')
except ImportError as e:
    print(f'❌ PyMongo: {e}')
    
try:
    from server import app
    print('✅ Server.py import OK')
except Exception as e:
    print(f'❌ Server.py: {e}')
" 2>&1
        
        Write-Host "   📋 Résultats des tests d'import:" -ForegroundColor White
        $importTest -split "`n" | ForEach-Object {
            if ($_ -match "✅") {
                Write-Host "      $_" -ForegroundColor Green
            } elseif ($_ -match "❌") {
                Write-Host "      $_" -ForegroundColor Red
            } else {
                Write-Host "      $_" -ForegroundColor Gray
            }
        }
        
        Set-Location ".."
        
    } catch {
        Write-Host "   ❌ Erreur lors du test: $_" -ForegroundColor Red
        Set-Location ".."
    }
}

# 5. Vérifier les logs/erreurs
Write-Host "`n5. 📋 Recherche d'erreurs:" -ForegroundColor Cyan
$logFiles = @("backend\server.log", "backend\error.log", "backend\debug.log")
$logsFound = $false

foreach ($logFile in $logFiles) {
    if (Test-Path $logFile) {
        $logsFound = $true
        Write-Host "   📄 Log trouvé: $logFile" -ForegroundColor Yellow
        $lastLines = Get-Content $logFile -Tail 5 -ErrorAction SilentlyContinue
        if ($lastLines) {
            Write-Host "   📋 Dernières lignes:" -ForegroundColor White
            $lastLines | ForEach-Object { Write-Host "      $_" -ForegroundColor Gray }
        }
    }
}

if (-not $logsFound) {
    Write-Host "   ℹ️ Aucun fichier de log trouvé" -ForegroundColor Gray
}

# Recommandations
Write-Host "`n🎯 Recommandations:" -ForegroundColor Yellow
Write-Host "===================" -ForegroundColor Yellow

$pythonVersion = python --version 2>$null
if (-not $pythonVersion) {
    Write-Host "❗ PRIORITÉ 1: Installer Python" -ForegroundColor Red
    Write-Host "   - Téléchargez Python depuis python.org" -ForegroundColor White
    Write-Host "   - Ou via Chocolatey: choco install python" -ForegroundColor White
}

if (Test-Path "backend\requirements.txt") {
    Write-Host "❗ PRIORITÉ 2: Installer les dépendances Python" -ForegroundColor Red
    Write-Host "   cd backend" -ForegroundColor Gray
    Write-Host "   pip install -r requirements.txt" -ForegroundColor Gray
}

Write-Host "❗ PRIORITÉ 3: Test de démarrage manuel" -ForegroundColor Yellow
Write-Host "   cd backend" -ForegroundColor Gray
Write-Host "   python server.py" -ForegroundColor Gray
Write-Host "   (Regardez les messages d'erreur qui apparaissent)" -ForegroundColor Gray

Write-Host "`n✅ Diagnostic backend terminé" -ForegroundColor Green
Write-Host "💡 MongoDB fonctionne - Le problème vient du backend Python" -ForegroundColor Cyan