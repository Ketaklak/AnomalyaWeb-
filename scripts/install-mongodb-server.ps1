# Script d'installation MongoDB Server pour Windows
# Usage: PowerShell -ExecutionPolicy Bypass -File install-mongodb-server.ps1

Write-Host "🗃️ Installation MongoDB Server pour Windows" -ForegroundColor Yellow
Write-Host "=============================================" -ForegroundColor Yellow

# Vérifier si MongoDB Server est déjà installé
$mongoServerPaths = @(
    "C:\Program Files\MongoDB\Server\*\bin\mongod.exe",
    "C:\MongoDB\Server\*\bin\mongod.exe"
)

$existingMongo = $false
foreach ($path in $mongoServerPaths) {
    $resolved = Resolve-Path $path -ErrorAction SilentlyContinue
    if ($resolved) {
        $existingMongo = $true
        Write-Host "✅ MongoDB Server déjà installé: $($resolved.Path)" -ForegroundColor Green
        break
    }
}

if ($existingMongo) {
    Write-Host "🔄 Vérification du service..." -ForegroundColor Cyan
    
    $service = Get-Service "MongoDB" -ErrorAction SilentlyContinue
    if ($service) {
        if ($service.Status -eq "Running") {
            Write-Host "✅ Service MongoDB déjà démarré" -ForegroundColor Green
        } else {
            Write-Host "🔧 Démarrage du service MongoDB..." -ForegroundColor Yellow
            try {
                Start-Service "MongoDB"
                Write-Host "✅ Service MongoDB démarré avec succès" -ForegroundColor Green
            } catch {
                Write-Host "❌ Erreur démarrage service: $_" -ForegroundColor Red
            }
        }
    }
} else {
    Write-Host "🔍 MongoDB Server non trouvé. Installation nécessaire..." -ForegroundColor Yellow
    
    # Vérifier si Chocolatey est disponible
    if (Get-Command choco -ErrorAction SilentlyContinue) {
        Write-Host "✅ Chocolatey trouvé. Installation via choco..." -ForegroundColor Green
        
        try {
            Write-Host "📦 Installation de MongoDB Server..." -ForegroundColor Cyan
            choco install mongodb -y
            
            Write-Host "🔄 Démarrage du service MongoDB..." -ForegroundColor Cyan
            Start-Sleep -Seconds 5
            Start-Service "MongoDB" -ErrorAction SilentlyContinue
            
            Write-Host "✅ MongoDB Server installé et démarré!" -ForegroundColor Green
            
        } catch {
            Write-Host "❌ Erreur installation via Chocolatey: $_" -ForegroundColor Red
            $manualInstall = $true
        }
        
    } else {
        Write-Host "⚠️ Chocolatey non trouvé. Installation manuelle requise." -ForegroundColor Yellow
        $manualInstall = $true
    }
    
    if ($manualInstall) {
        Write-Host "`n📋 Instructions d'installation manuelle:" -ForegroundColor Yellow
        Write-Host "=========================================" -ForegroundColor Yellow
        Write-Host "1. 🌐 Allez sur: https://www.mongodb.com/try/download/community" -ForegroundColor White
        Write-Host "2. 🎯 Sélectionnez:" -ForegroundColor White
        Write-Host "   - Version: Latest (7.0 ou plus récent)" -ForegroundColor Gray
        Write-Host "   - Platform: Windows" -ForegroundColor Gray  
        Write-Host "   - Package: msi (pas zip)" -ForegroundColor Gray
        Write-Host "3. 📥 Téléchargez et installez le fichier .msi" -ForegroundColor White
        Write-Host "4. ⚙️ Durant l'installation:" -ForegroundColor White
        Write-Host "   - Cochez 'Install MongoDB as a Service'" -ForegroundColor Gray
        Write-Host "   - Cochez 'Install MongoDB Compass' (optionnel)" -ForegroundColor Gray
        Write-Host "5. 🔄 Après installation, redémarrez ce script" -ForegroundColor White
        
        Write-Host "`n💡 Installation rapide Chocolatey:" -ForegroundColor Cyan
        Write-Host "Si vous voulez installer Chocolatey d'abord:" -ForegroundColor White
        Write-Host 'Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString("https://community.chocolatey.org/install.ps1"))' -ForegroundColor Gray
        Write-Host "Puis relancez ce script." -ForegroundColor White
    }
}

# Test final
Write-Host "`n🧪 Test de l'installation:" -ForegroundColor Cyan
$service = Get-Service "MongoDB" -ErrorAction SilentlyContinue
if ($service -and $service.Status -eq "Running") {
    Write-Host "✅ Service MongoDB: $($service.Status)" -ForegroundColor Green
    
    # Test de connectivité
    try {
        $connection = Test-NetConnection -ComputerName "localhost" -Port 27017 -InformationLevel Quiet -WarningAction SilentlyContinue
        if ($connection) {
            Write-Host "✅ Port 27017 accessible" -ForegroundColor Green
            Write-Host "🎉 MongoDB Server prêt pour Anomalya Corp!" -ForegroundColor Green
        } else {
            Write-Host "⚠️ Port 27017 non accessible - Vérifiez la configuration" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "⚠️ Test de connectivité échoué" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Service MongoDB non démarré" -ForegroundColor Red
    Write-Host "💡 Essayez de démarrer manuellement:" -ForegroundColor Yellow
    Write-Host "   - Ouvrez Services (services.msc)" -ForegroundColor Gray
    Write-Host "   - Cherchez 'MongoDB' et démarrez le service" -ForegroundColor Gray
}

Write-Host "`n✅ Script terminé" -ForegroundColor Green
Write-Host "🔄 Relancez le diagnostic: .\diagnose-windows.ps1" -ForegroundColor Cyan