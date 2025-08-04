# Script pour corriger le PATH MongoDB sur Windows
# Usage: PowerShell -ExecutionPolicy Bypass -File fix-mongodb-path.ps1

Write-Host "🔧 Correction PATH MongoDB" -ForegroundColor Yellow
Write-Host "===========================" -ForegroundColor Yellow

# Chercher MongoDB
$mongoClientPaths = @(
    "C:\Program Files\MongoDB\Server\*\bin\mongo.exe",
    "C:\Program Files\MongoDB\Server\*\bin\mongosh.exe",
    "C:\MongoDB\Server\*\bin\mongo.exe",
    "C:\MongoDB\Server\*\bin\mongosh.exe"
)

$mongoClient = $null
foreach ($clientPath in $mongoClientPaths) {
    $resolved = Resolve-Path $clientPath -ErrorAction SilentlyContinue
    if ($resolved) {
        $mongoClient = $resolved.Path | Select-Object -First 1
        break
    }
}

if ($mongoClient) {
    $mongoDir = Split-Path $mongoClient -Parent
    Write-Host "✅ MongoDB trouvé: $mongoDir" -ForegroundColor Green
    
    # Vérifier si déjà dans le PATH
    $currentUserPath = [Environment]::GetEnvironmentVariable("PATH", "User")
    $currentSystemPath = [Environment]::GetEnvironmentVariable("PATH", "Machine")
    
    if (($currentUserPath -like "*$mongoDir*") -or ($currentSystemPath -like "*$mongoDir*")) {
        Write-Host "✅ MongoDB déjà dans le PATH" -ForegroundColor Green
        Write-Host "💡 Si mongo/mongosh ne fonctionne pas, redémarrez votre terminal" -ForegroundColor Yellow
    } else {
        Write-Host "➕ Ajout de MongoDB au PATH utilisateur..." -ForegroundColor Cyan
        
        try {
            [Environment]::SetEnvironmentVariable("PATH", "$currentUserPath;$mongoDir", "User")
            Write-Host "✅ MongoDB ajouté au PATH avec succès!" -ForegroundColor Green
            Write-Host "🔄 Redémarrez PowerShell/CMD pour utiliser mongo/mongosh" -ForegroundColor Yellow
        } catch {
            Write-Host "❌ Erreur lors de l'ajout au PATH: $_" -ForegroundColor Red
            Write-Host "💡 Ajoutez manuellement ce chemin au PATH: $mongoDir" -ForegroundColor Yellow
        }
    }
    
    # Test rapide
    Write-Host "`n🧪 Test rapide:" -ForegroundColor Cyan
    try {
        $env:PATH = "$mongoDir;$env:PATH"  # Temporairement pour ce test
        
        if (Test-Path "$mongoDir\mongosh.exe") {
            $testResult = & "$mongoDir\mongosh.exe" --eval "db.runCommand('ping').ok" --quiet 2>$null
            $clientName = "mongosh"
        } else {
            $testResult = & "$mongoDir\mongo.exe" --eval "db.runCommand('ping').ok" admin --quiet 2>$null  
            $clientName = "mongo"
        }
        
        if ($testResult -match "1" -or $testResult -match "true") {
            Write-Host "✅ Test de connexion $clientName réussi!" -ForegroundColor Green
        } else {
            Write-Host "⚠️ MongoDB disponible mais connexion échouée" -ForegroundColor Yellow
            Write-Host "   Vérifiez que le service MongoDB est démarré" -ForegroundColor Gray
        }
    } catch {
        Write-Host "⚠️ Test échoué: $($_.Exception.Message)" -ForegroundColor Yellow
    }
    
} else {
    Write-Host "❌ MongoDB non trouvé dans les emplacements standards" -ForegroundColor Red
    Write-Host "💡 Vérifiez que MongoDB Community Edition est installé:" -ForegroundColor Yellow
    Write-Host "   - https://www.mongodb.com/try/download/community" -ForegroundColor Gray
    Write-Host "   - Ou via Chocolatey: choco install mongodb" -ForegroundColor Gray
}

Write-Host "`n✅ Script terminé" -ForegroundColor Green