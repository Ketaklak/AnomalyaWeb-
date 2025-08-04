# Script de démarrage Anomalya Corp pour Windows
# Usage: PowerShell -ExecutionPolicy Bypass -File start-windows.ps1

Write-Host "🚀 Démarrage Anomalya Corp" -ForegroundColor Yellow
Write-Host "==========================" -ForegroundColor Yellow

# Vérifier MongoDB
Write-Host "`n1. 🗃️ Vérification MongoDB..." -ForegroundColor Cyan
$mongoService = Get-Service "MongoDB" -ErrorAction SilentlyContinue
if ($mongoService -and $mongoService.Status -eq "Running") {
    Write-Host "   ✅ MongoDB: Running" -ForegroundColor Green
} else {
    Write-Host "   ⚠️ MongoDB non démarré. Tentative de démarrage..." -ForegroundColor Yellow
    try {
        Start-Service "MongoDB" -ErrorAction Stop
        Write-Host "   ✅ MongoDB démarré avec succès" -ForegroundColor Green
    } catch {
        Write-Host "   ❌ Impossible de démarrer MongoDB" -ForegroundColor Red
        Write-Host "   💡 Vérifiez l'installation: .\scripts\install-mongodb-server.ps1" -ForegroundColor Yellow
    }
}

# Vérifier les dépendances backend
Write-Host "`n2. 🐍 Vérification Backend..." -ForegroundColor Cyan
if (Test-Path "backend\server.py") {
    Write-Host "   ✅ Serveur backend trouvé" -ForegroundColor Green
} else {
    Write-Host "   ❌ backend\server.py manquant!" -ForegroundColor Red
    return
}

# Démarrer le backend
Write-Host "`n3. 🚀 Démarrage Backend (port 8001)..." -ForegroundColor Cyan
$backendJob = Start-Job -ScriptBlock {
    Set-Location "$($args[0])\backend"
    python server.py
} -ArgumentList (Get-Location)

Write-Host "   📡 Backend en cours de démarrage..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Vérifier que le backend est accessible
$backendReady = $false
for ($i = 1; $i -le 5; $i++) {
    try {
        $connection = Test-NetConnection -ComputerName "localhost" -Port 8001 -InformationLevel Quiet -WarningAction SilentlyContinue
        if ($connection) {
            Write-Host "   ✅ Backend accessible sur http://localhost:8001" -ForegroundColor Green
            $backendReady = $true
            break
        }
    } catch {}
    
    Write-Host "   ⏳ Attente backend... ($i/5)" -ForegroundColor Gray
    Start-Sleep -Seconds 2
}

if (-not $backendReady) {
    Write-Host "   ❌ Backend non accessible. Vérifiez les erreurs:" -ForegroundColor Red
    Write-Host "   💡 Diagnostic: .\scripts\diagnose-backend.ps1" -ForegroundColor Yellow
    Write-Host "   💡 Correction: .\scripts\fix-backend.ps1" -ForegroundColor Yellow
}

# Démarrer le frontend
Write-Host "`n4. 🌐 Démarrage Frontend (port 3000)..." -ForegroundColor Cyan
if (Test-Path "frontend\package.json") {
    Write-Host "   ✅ Configuration frontend trouvée" -ForegroundColor Green
    
    $frontendJob = Start-Job -ScriptBlock {
        Set-Location "$($args[0])\frontend"
        if (Get-Command yarn -ErrorAction SilentlyContinue) {
            yarn start
        } else {
            npm start
        }
    } -ArgumentList (Get-Location)
    
    Write-Host "   📡 Frontend en cours de démarrage..." -ForegroundColor Yellow
    Write-Host "   🌐 Ouverture automatique dans le navigateur..." -ForegroundColor Gray
    
} else {
    Write-Host "   ❌ frontend\package.json manquant!" -ForegroundColor Red
}

# Attendre un peu puis ouvrir le navigateur
Start-Sleep -Seconds 5
try {
    Start-Process "http://localhost:3000"
    Write-Host "   ✅ Navigateur ouvert sur http://localhost:3000" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️ Ouverture navigateur échouée. Allez sur http://localhost:3000" -ForegroundColor Yellow
}

# Instructions finales
Write-Host "`n🎯 Application Démarrée!" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Green
Write-Host "📱 Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "🔧 Backend API: http://localhost:8001" -ForegroundColor White
Write-Host "👤 Admin Login: admin / admin123" -ForegroundColor White

Write-Host "`n🔄 Contrôle des services:" -ForegroundColor Cyan
Write-Host "- Backend Job ID: $($backendJob.Id)" -ForegroundColor Gray
Write-Host "- Frontend Job ID: $($frontendJob.Id)" -ForegroundColor Gray
Write-Host "- Pour arrêter: Stop-Job $($backendJob.Id), $($frontendJob.Id)" -ForegroundColor Gray

Write-Host "`n⚠️ Gardez cette fenêtre ouverte pour maintenir les services actifs" -ForegroundColor Yellow
Write-Host "   Appuyez sur Ctrl+C pour arrêter tous les services" -ForegroundColor Gray

# Attendre indéfiniment (jusqu'à Ctrl+C)
try {
    while ($true) {
        Start-Sleep -Seconds 5
        
        # Vérifier périodiquement que les jobs tournent
        if (Get-Job $backendJob.Id -ErrorAction SilentlyContinue | Where-Object {$_.State -eq "Failed"}) {
            Write-Host "`n❌ Backend s'est arrêté de manière inattendue!" -ForegroundColor Red
            break
        }
        if (Get-Job $frontendJob.Id -ErrorAction SilentlyContinue | Where-Object {$_.State -eq "Failed"}) {
            Write-Host "`n❌ Frontend s'est arrêté de manière inattendue!" -ForegroundColor Red
            break
        }
    }
} catch {
    Write-Host "`n🛑 Arrêt demandé par l'utilisateur" -ForegroundColor Yellow
} finally {
    # Nettoyer les jobs
    Write-Host "`n🧹 Arrêt des services..." -ForegroundColor Yellow
    Stop-Job $backendJob -Force -ErrorAction SilentlyContinue
    Stop-Job $frontendJob -Force -ErrorAction SilentlyContinue
    Remove-Job $backendJob -Force -ErrorAction SilentlyContinue  
    Remove-Job $frontendJob -Force -ErrorAction SilentlyContinue
    Write-Host "✅ Services arrêtés" -ForegroundColor Green
}