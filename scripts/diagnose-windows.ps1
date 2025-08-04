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

# Chercher les clients MongoDB disponibles
$mongoClientPaths = @(
    "C:\Program Files\MongoDB\Server\*\bin\mongo.exe",
    "C:\Program Files\MongoDB\Server\*\bin\mongosh.exe", 
    "C:\MongoDB\Server\*\bin\mongo.exe",
    "C:\MongoDB\Server\*\bin\mongosh.exe"
)

$mongoClient = $null
$clientType = $null

foreach ($clientPath in $mongoClientPaths) {
    $resolved = Resolve-Path $clientPath -ErrorAction SilentlyContinue
    if ($resolved) {
        $mongoClient = $resolved.Path | Select-Object -First 1
        $clientType = if ($mongoClient -match "mongosh") { "mongosh" } else { "mongo" }
        Write-Host "   ✅ Client MongoDB trouvé: $mongoClient" -ForegroundColor Green
        break
    }
}

if (-not $mongoClient) {
    Write-Host "   ❌ Aucun client MongoDB trouvé (mongo.exe ou mongosh.exe)" -ForegroundColor Red
    Write-Host "   💡 Vérifiez les chemins:" -ForegroundColor Yellow
    foreach ($path in $mongoClientPaths) {
        Write-Host "      - $path" -ForegroundColor Gray
    }
} else {
    # Test de connexion avec le client trouvé
    try {
        if ($clientType -eq "mongosh") {
            $result = & $mongoClient --eval "db.runCommand('ping').ok" --quiet 2>$null
        } else {
            $result = & $mongoClient --eval "db.runCommand('ping').ok" admin --quiet 2>$null
        }
        
        if ($result -match "1" -or $result -match "true") {
            Write-Host "   ✅ Connexion MongoDB réussie via $clientType" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️ Connexion MongoDB échouée mais service peut fonctionner" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "   ❌ Erreur de connexion: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Vérifier si MongoDB est dans le PATH
Write-Host "`n   📁 Vérification PATH:" -ForegroundColor Cyan
$mongoInPath = (Get-Command mongo -ErrorAction SilentlyContinue) -or (Get-Command mongosh -ErrorAction SilentlyContinue)
if ($mongoInPath) {
    Write-Host "   ✅ Client MongoDB disponible dans PATH" -ForegroundColor Green
} else {
    Write-Host "   ❌ Client MongoDB non disponible dans PATH" -ForegroundColor Red
    if ($mongoClient) {
        $mongoDir = Split-Path $mongoClient -Parent
        Write-Host "   💡 Ajoutez au PATH: $mongoDir" -ForegroundColor Yellow
    }
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

if (-not $mongoClient) {
    Write-Host "❗ PRIORITÉ 3: Installer le client MongoDB" -ForegroundColor Red
    Write-Host "   - Réinstallez MongoDB Community Edition complète" -ForegroundColor White
    Write-Host "   - Ou téléchargez MongoDB Shell depuis mongodb.com/try/download/shell" -ForegroundColor White
    Write-Host "   - L'application peut fonctionner même sans client si le service tourne" -ForegroundColor Yellow
} elseif (-not $mongoInPath) {
    Write-Host "❗ INFO: Ajouter MongoDB au PATH" -ForegroundColor Yellow
    Write-Host "   - Le script d'installation devrait l'avoir fait automatiquement" -ForegroundColor White
    Write-Host "   - Redémarrez PowerShell/Command Prompt après installation" -ForegroundColor White
}

Write-Host "`n✅ Diagnostic terminé" -ForegroundColor Green