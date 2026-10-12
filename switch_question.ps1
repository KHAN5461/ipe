# ==============================================================================
# Script: switch_question.ps1
# Description: Copies selected question components from assets/ to my-app/src/
# Usage:
#   powershell -ExecutionPolicy Bypass -File .\switch_question.ps1
#   powershell -ExecutionPolicy Bypass -File .\switch_question.ps1 -Question q1
# ==============================================================================

param (
    [string]$Question = "",
    [switch]$NoStart = $false
)

$AssetsDir = "assets"
$TargetAppDir = "my-app"
$TargetSrcDir = Join-Path -Path $TargetAppDir -ChildPath "src"
$TargetCompDir = Join-Path -Path $TargetSrcDir -ChildPath "components"

# 1. Verify environment
if (-not (Test-Path -Path $AssetsDir -PathType Container)) {
    Write-Host "Error: '$AssetsDir' directory not found. Please run this script from the project root." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path -Path $TargetAppDir -PathType Container)) {
    Write-Host "Error: '$TargetAppDir' directory not found." -ForegroundColor Red
    exit 1
}

# 2. Prompt user if question argument was not provided
if ([string]::IsNullOrWhiteSpace($Question)) {
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "       React Question Switcher (IPE III)  " -ForegroundColor Cyan
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "Available questions in assets:" -ForegroundColor Yellow
    Get-ChildItem -Path $AssetsDir -Directory | ForEach-Object { Write-Host " - $($_.Name)" }
    Write-Host ""
    $Question = Read-Host "Enter the question name to run (e.g. 'q1' or '1')"
}

# Normalize input (e.g. '1' -> 'q1', 'Q1' -> 'q1')
$Question = $Question.Trim().ToLower()
if ($Question -match "^\d+$") {
    $Question = "q$Question"
}

$SourceDir = Join-Path -Path $AssetsDir -ChildPath $Question
if (-not (Test-Path -Path $SourceDir -PathType Container)) {
    Write-Host "Error: Question directory '$SourceDir' does not exist." -ForegroundColor Red
    Write-Host "Available: $( (Get-ChildItem -Path $AssetsDir -Directory).Name -join ', ' )" -ForegroundColor Yellow
    exit 1
}

Write-Host "Processing question: $Question..." -ForegroundColor Cyan

# 3. Ensure target directories exist
if (-not (Test-Path -Path $TargetSrcDir)) {
    New-Item -ItemType Directory -Path $TargetSrcDir -Force | Out-Null
}
if (-not (Test-Path -Path $TargetCompDir)) {
    New-Item -ItemType Directory -Path $TargetCompDir -Force | Out-Null
}

# 4. Remove stale App files in my-app/src
$StaleAppJs = Join-Path -Path $TargetSrcDir -ChildPath "App.js"
$StaleAppJsx = Join-Path -Path $TargetSrcDir -ChildPath "App.jsx"
if (Test-Path -Path $StaleAppJs) { Remove-Item -Path $StaleAppJs -Force }
if (Test-Path -Path $StaleAppJsx) { Remove-Item -Path $StaleAppJsx -Force }

# 5. Copy App component
$SourceAppJsx = Join-Path -Path $SourceDir -ChildPath "App.jsx"
$SourceAppJs = Join-Path -Path $SourceDir -ChildPath "App.js"

if (Test-Path -Path $SourceAppJsx) {
    Copy-Item -Path $SourceAppJsx -Destination $StaleAppJsx -Force
    Write-Host "Copied: App.jsx -> my-app/src/App.jsx" -ForegroundColor Green
} elseif (Test-Path -Path $SourceAppJs) {
    Copy-Item -Path $SourceAppJs -Destination $StaleAppJs -Force
    Write-Host "Copied: App.js -> my-app/src/App.js" -ForegroundColor Green
} else {
    Write-Host "Warning: No App.jsx or App.js found in $SourceDir" -ForegroundColor Yellow
}

# 6. Copy other components into my-app/src/ and my-app/src/components/
$ComponentFiles = Get-ChildItem -Path $SourceDir -File | Where-Object { $_.Name -ne "App.jsx" -and $_.Name -ne "App.js" }
foreach ($file in $ComponentFiles) {
    Copy-Item -Path $file.FullName -Destination (Join-Path -Path $TargetSrcDir -ChildPath $file.Name) -Force
    Copy-Item -Path $file.FullName -Destination (Join-Path -Path $TargetCompDir -ChildPath $file.Name) -Force
    Write-Host "Copied: $($file.Name) -> my-app/src/ & my-app/src/components/" -ForegroundColor Green
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host " Successfully loaded $Question into my-app! " -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "To run the app manually:" -ForegroundColor Yellow
Write-Host "  cd my-app" -ForegroundColor White
Write-Host "  npm start" -ForegroundColor White
Write-Host ""

if (-not $NoStart) {
    $StartNow = Read-Host "Do you want to start the app now? (y/n) [default: y]"
    if ([string]::IsNullOrWhiteSpace($StartNow) -or $StartNow.ToLower() -eq "y" -or $StartNow.ToLower() -eq "yes") {
        Write-Host "Starting React app in my-app..." -ForegroundColor Cyan
        Set-Location -Path $TargetAppDir
        npm start
    }
}
