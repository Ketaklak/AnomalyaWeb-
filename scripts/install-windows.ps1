# Script d'installation PowerShell pour Windows
# Usage: PowerShell -ExecutionPolicy Bypass -File install-windows.ps1

param(
    [switch]$InstallChocolatey = $false,
    [switch]$InstallAsService = $false,
    [switch]$SkipDependencies = $false
)

# Configuration des couleurs pour les messages
$Host.UI.RawUI.BackgroundColor = "Black"
$Host.UI.RawUI.ForegroundColor = "White"

function Write-Info { 
    param($Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue 
}

function Write-Success { 
    param($Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green 
}

function Write-Warning { 
    param($Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow 
}

function Write-Error { 
    param($Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red 
}

# Vérifier les privilèges administrateur
function Test-Administrator {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = [Security.Principal.WindowsPrincipal]($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

# Installation de Chocolatey
function Install-Chocolatey {
    if (Get-Command choco -ErrorAction SilentlyContinue) {
        Write-Info "Chocolatey déjà installé"
        return
    }
    
    Write-Info "Installation de Chocolatey..."
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    
    # Actualiser les variables d'environnement
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    
    Write-Success "Chocolatey installé"
}

# Installation des dépendances
function Install-Dependencies {
    Write-Info "Installation des dépendances..."
    
    try {
        # Installer Python, Node.js, MongoDB, Git, Yarn
        choco install python nodejs mongodb git yarn -y
        
        # Vérifier les installations
        $tools = @("python", "node", "npm", "git", "yarn")
        foreach ($tool in $tools) {
            if (Get-Command $tool -ErrorAction SilentlyContinue) {
                Write-Success "$tool installé avec succès"
            } else {
                Write-Warning "$tool non trouvé dans PATH. Redémarrage requis."
            }
        }
        
    } catch {
        Write-Error "Erreur lors de l'installation des dépendances: $_"
        exit 1
    }
}

# Configuration de MongoDB
function Setup-MongoDB {
    Write-Info "Configuration de MongoDB..."
    
    try {
        # Démarrer le service MongoDB
        Start-Service MongoDB -ErrorAction SilentlyContinue
        Set-Service MongoDB -StartupType Automatic -ErrorAction SilentlyContinue
        
        # Attendre que MongoDB soit prêt
        Start-Sleep -Seconds 5
        
        Write-Success "MongoDB configuré et démarré"
        
    } catch {
        Write-Warning "Impossible de configurer MongoDB automatiquement. Configuration manuelle requise."
    }
}

# Configuration du projet
function Setup-Project {
    Write-Info "Configuration du projet Anomalya Corp..."
    
    # Vérifier le répertoire du projet
    if (-not (Test-Path "backend") -or -not (Test-Path "frontend")) {
        Write-Error "Veuillez exécuter ce script depuis le répertoire racine du projet"
        exit 1
    }
    
    # Configuration Backend
    Write-Info "Configuration du backend..."
    Set-Location backend
    
    try {
        # Créer environnement virtuel
        python -m venv venv
        
        # Activer l'environnement virtuel et installer les dépendances
        & ".\venv\Scripts\Activate.ps1"
        python -m pip install --upgrade pip
        pip install -r requirements.txt
        
        # Copier fichier de configuration
        if (-not (Test-Path ".env")) {
            Copy-Item ".env.example" ".env"
            Write-Warning "Fichier .env créé. Veuillez le configurer avant de lancer l'application."
        }
        
        # Initialiser la base de données
        python init_db.py
        
        deactivate
        Write-Success "Backend configuré"
        
    } catch {
        Write-Error "Erreur lors de la configuration du backend: $_"
        exit 1
    }
    
    Set-Location ..
    
    # Configuration Frontend
    Write-Info "Configuration du frontend..."
    Set-Location frontend
    
    try {
        # Installer les dépendances
        yarn install
        
        # Copier fichier de configuration
        if (-not (Test-Path ".env")) {
            Copy-Item ".env.example" ".env"
            Write-Warning "Fichier .env créé. Veuillez le configurer avant de lancer l'application."
        }
        
        Write-Success "Frontend configuré"
        
    } catch {
        Write-Error "Erreur lors de la configuration du frontend: $_"
        exit 1
    }
    
    Set-Location ..
}

# Créer les scripts de démarrage
function Create-StartupScripts {
    Write-Info "Création des scripts de démarrage..."
    
    # Script de démarrage batch
    $startScript = @"
@echo off
echo 🚀 Démarrage d'Anomalya Corp...

echo ⚡ Démarrage du backend...
start /D backend cmd /c "venv\Scripts\activate && python server.py"

echo 🌐 Démarrage du frontend...
timeout /t 5 /nobreak >nul
start /D frontend cmd /c "yarn start"

echo ✅ Anomalya Corp démarré !
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:8001
echo 📚 Documentation API: http://localhost:8001/docs  
echo 👤 Compte admin: admin / admin123
echo.
echo Appuyez sur une touche pour fermer cette fenêtre...
pause >nul
"@
    
    $startScript | Out-File -FilePath "start.bat" -Encoding ASCII
    
    # Script d'arrêt
    $stopScript = @"
@echo off
echo 🛑 Arrêt d'Anomalya Corp...

taskkill /f /im python.exe >nul 2>&1
taskkill /f /im node.exe >nul 2>&1

echo ✅ Services arrêtés
pause
"@
    
    $stopScript | Out-File -FilePath "stop.bat" -Encoding ASCII
    
    Write-Success "Scripts de démarrage créés (start.bat, stop.bat)"
}

# Installation comme service Windows
function Install-WindowsService {
    if (-not $InstallAsService) {
        $response = Read-Host "Installer Anomalya Corp comme service Windows ? (y/N)"
        if ($response -ne "y" -and $response -ne "Y") {
            return
        }
    }
    
    Write-Info "Installation comme service Windows..."
    
    try {
        # Installer NSSM si pas présent
        if (-not (Get-Command nssm -ErrorAction SilentlyContinue)) {
            choco install nssm -y
        }
        
        $projectPath = Get-Location
        
        # Service Backend
        nssm install AnomalyaBackend "$projectPath\backend\venv\Scripts\python.exe" "$projectPath\backend\server.py"
        nssm set AnomalyaBackend AppDirectory "$projectPath\backend"
        nssm set AnomalyaBackend DisplayName "Anomalya Corp Backend"
        nssm set AnomalyaBackend Description "Anomalya Corp Backend API Service"
        
        # Service Frontend (plus complexe avec Node.js)
        nssm install AnomalyaFrontend "cmd" "/c cd /d $projectPath\frontend && yarn start"
        nssm set AnomalyaFrontend AppDirectory "$projectPath\frontend"
        nssm set AnomalyaFrontend DisplayName "Anomalya Corp Frontend"
        nssm set AnomalyaFrontend Description "Anomalya Corp Frontend Service"
        
        Write-Success "Services Windows installés. Utilisez 'net start AnomalyaBackend' et 'net start AnomalyaFrontend'"
        
    } catch {
        Write-Error "Erreur lors de l'installation des services: $_"
    }
}

# Configuration du firewall Windows
function Configure-Firewall {
    $response = Read-Host "Configurer le pare-feu Windows pour autoriser les ports 3000 et 8001 ? (y/N)"
    if ($response -eq "y" -or $response -eq "Y") {
        Write-Info "Configuration du pare-feu..."
        
        try {
            New-NetFirewallRule -DisplayName "Anomalya Frontend" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow
            New-NetFirewallRule -DisplayName "Anomalya Backend" -Direction Inbound -Protocol TCP -LocalPort 8001 -Action Allow
            Write-Success "Règles de pare-feu ajoutées"
        } catch {
            Write-Warning "Impossible de configurer le pare-feu automatiquement"
        }
    }
}

# Fonction principale
function Main {
    Write-Host "🚀 Installation d'Anomalya Corp pour Windows" -ForegroundColor Cyan
    Write-Host "=============================================" -ForegroundColor Cyan
    
    # Vérifier les privilèges administrateur
    if (-not (Test-Administrator)) {
        Write-Error "Ce script doit être exécuté en tant qu'administrateur"
        Write-Info "Clic droit sur PowerShell > 'Exécuter en tant qu'administrateur'"
        exit 1
    }
    
    if ($InstallChocolatey -or -not (Get-Command choco -ErrorAction SilentlyContinue)) {
        Install-Chocolatey
    }
    
    if (-not $SkipDependencies) {
        Install-Dependencies
    }
    
    Setup-MongoDB
    Setup-Project
    Create-StartupScripts
    Install-WindowsService
    Configure-Firewall
    
    Write-Host ""
    Write-Success "🎉 Installation terminée avec succès !"
    Write-Host ""
    Write-Host "📋 Prochaines étapes:" -ForegroundColor Yellow
    Write-Host "1. Configurez les fichiers .env dans backend\ et frontend\"
    Write-Host "2. Lancez l'application avec: start.bat"
    Write-Host "3. Accédez à http://localhost:3000"
    Write-Host "4. Connectez-vous avec admin / admin123"
    Write-Host ""
    Write-Host "📚 Documentation complète: README.md"
    Write-Host "🐛 En cas de problème: https://github.com/anomalya/corp/issues"
}

# Exécuter l'installation
Main