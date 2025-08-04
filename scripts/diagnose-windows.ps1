# Script de diagnostic pour Windows - Anomalya Corp
# Usage: PowerShell -ExecutionPolicy Bypass -File diagnose-windows.ps1

Write-Host "🔍 Diagnostic Anomalya Corp Windows" -ForegroundColor Yellow
Write-Host "====================================" -ForegroundColor Yellow

# 1. Vérifier MongoDB
Write-Host "`n1. 📊 État de MongoDB:" -ForegroundColor Cyan
$mongoServices = @("MongoDB", "mongod", "MongoDBCompass")
$mongoRunning = $false

foreach ($serviceName in $mongoServices) {
    $service = Get-Service $serviceName -ErrorAction SilentlyContinue
    if ($service) {
        Write-Host "   Service $serviceName : $($service.Status)" -ForegroundColor $(if ($service.Status -eq "Running") { "Green" } else { "Red" })
        if ($service.Status -eq "Running") { $mongoRunning = $true }
    }
}

if (-not $mongoRunning) {
    Write-Host "   ❌ Aucun service MongoDB en cours d'exécution" -ForegroundColor Red
    
    # Chercher MongoDB manuellement
    $mongoPaths = @(
        "C:\Program Files\MongoDB\Server\*\bin\mongod.exe",
        "C:\MongoDB\Server\*\bin\mongod.exe"
    )
    
    foreach ($path in $mongoPaths) {
        $resolved = Resolve-Path $path -ErrorAction SilentlyContinue
        if ($resolved) {
            Write-Host "   💡 MongoDB trouvé: $($resolved.Path)" -ForegroundColor Yellow
        }
    }
}

# 2. Tester la connexion MongoDB
Write-Host "`n2. 🔌 Test de connexion MongoDB:" -ForegroundColor Cyan
try {
    if (Get-Command mongo -ErrorAction SilentlyContinue) {
        $result = & mongo --eval "db.runCommand('ping').ok" admin 2>$null
        if ($result -match "1") {
            Write-Host "   ✅ Connexion MongoDB réussie" -ForegroundColor Green
        } else {
            Write-Host "   ❌ Connexion MongoDB échouée" -ForegroundColor Red
        }
    } else {
        Write-Host "   ⚠️ Client mongo non disponible" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ Erreur de connexion: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Vérifier le fichier .env backend
Write-Host "`n3. ⚙️ Configuration Backend (.env):" -ForegroundColor Cyan
$envPath = "backend\.env"
if (Test-Path $envPath) {
    Write-Host "   ✅ Fichier .env trouvé" -ForegroundColor Green
    
    $envContent = Get-Content $envPath
    $mongoUrl = $envContent | Where-Object { $_ -like "MONGO_URL*" }
    $secretKey = $envContent | Where-Object { $_ -like "SECRET_KEY*" }
    
    if ($mongoUrl) {
        Write-Host "   📊 MONGO_URL: $mongoUrl" -ForegroundColor White
    } else {
        Write-Host "   ❌ MONGO_URL manquant dans .env" -ForegroundColor Red
    }
    
    if ($secretKey) {
        Write-Host "   🔑 SECRET_KEY: [CONFIGURÉ]" -ForegroundColor Green
    } else {
        Write-Host "   ❌ SECRET_KEY manquant dans .env" -ForegroundColor Red
    }
} else {
    Write-Host "   ❌ Fichier .env non trouvé dans backend/" -ForegroundColor Red
    Write-Host "   💡 Copiez .env.example vers .env et configurez-le" -ForegroundColor Yellow
}

# 4. Vérifier les processus Python/Node
Write-Host "`n4. 🔄 Processus de l'application:" -ForegroundColor Cyan
$pythonProc = Get-Process python -ErrorAction SilentlyContinue | Where-Object { $_.ProcessName -eq "python" }
$nodeProc = Get-Process node -ErrorAction SilentlyContinue

if ($pythonProc) {
    Write-Host "   ✅ Backend Python en cours d'exécution (PID: $($pythonProc.Id))" -ForegroundColor Green
} else {
    Write-Host "   ❌ Backend Python non démarré" -ForegroundColor Red
}

if ($nodeProc) {
    Write-Host "   ✅ Frontend Node.js en cours d'exécution (PID: $($nodeProc.Id))" -ForegroundColor Green
} else {
    Write-Host "   ❌ Frontend Node.js non démarré" -ForegroundColor Red
}

# 5. Test de connectivité des ports
Write-Host "`n5. 🌐 Test de connectivité des ports:" -ForegroundColor Cyan
$ports = @(
    @{Name="MongoDB"; Port=27017},
    @{Name="Backend"; Port=8001},
    @{Name="Frontend"; Port=3000}
)

foreach ($portTest in $ports) {
    try {
        $connection = Test-NetConnection -ComputerName "localhost" -Port $portTest.Port -InformationLevel Quiet -WarningAction SilentlyContinue
        if ($connection) {
            Write-Host "   ✅ Port $($portTest.Port) ($($portTest.Name)): Accessible" -ForegroundColor Green
        } else {
            Write-Host "   ❌ Port $($portTest.Port) ($($portTest.Name)): Non accessible" -ForegroundColor Red
        }
    } catch {
        Write-Host "   ❌ Port $($portTest.Port) ($($portTest.Name)): Erreur de test" -ForegroundColor Red
    }
}

# Résumé et recommandations
Write-Host "`n🎯 Recommandations:" -ForegroundColor Yellow
Write-Host "===================" -ForegroundColor Yellow

if (-not $mongoRunning) {
    Write-Host "❗ PRIORITÉ 1: Démarrer MongoDB" -ForegroundColor Red
    Write-Host "   - Ouvrez les Services Windows (services.msc)" -ForegroundColor White
    Write-Host "   - Cherchez MongoDB et démarrez le service" -ForegroundColor White
    Write-Host "   - Ou lancez mongod.exe manuellement" -ForegroundColor White
}

if (-not (Test-Path "backend\.env")) {
    Write-Host "❗ PRIORITÉ 2: Configurer le fichier .env" -ForegroundColor Red
    Write-Host "   - Copiez backend\.env.example vers backend\.env" -ForegroundColor White
    Write-Host "   - Modifiez la SECRET_KEY dans le fichier .env" -ForegroundColor White
}

Write-Host "`n✅ Diagnostic terminé" -ForegroundColor Green