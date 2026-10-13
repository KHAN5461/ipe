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

$AvailableDirs = Get-ChildItem -Path $AssetsDir -Directory | Sort-Object { 
    if ($_.Name -match '^\D*(\d+)') { [int]$matches[1] } else { 999 } 
}

# 2. Prompt user if question argument was not provided
if ([string]::IsNullOrWhiteSpace($Question)) {
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "       React Question Switcher (IPE III)  " -ForegroundColor Cyan
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "Available questions in assets:" -ForegroundColor Yellow
    $AvailableDirs | ForEach-Object { Write-Host " - $($_.Name)" }
    Write-Host ""
    $Question = Read-Host "Enter question name, number, or keyword (e.g. 'q1', '1', 'product')"
}

# Normalize input (e.g. '1' -> 'q1', 'Q1' -> 'q1')
$CleanInput = $Question.Trim().ToLower()
if ($CleanInput -match "^\d+$") {
    $CleanInput = "q$CleanInput"
}

# Find matching directory:
# 1. Exact match on directory name
# 2. Prefix match like 'q1-' (avoids matching 'q10-' when searching for 'q1')
# 3. Substring match
$MatchedDir = $AvailableDirs | Where-Object { $_.Name.ToLower() -eq $CleanInput } | Select-Object -First 1

if (-not $MatchedDir) {
    $MatchedDir = $AvailableDirs | Where-Object { $_.Name.ToLower() -like "$CleanInput-*" } | Select-Object -First 1
}

if (-not $MatchedDir) {
    $MatchedDir = $AvailableDirs | Where-Object { $_.Name.ToLower() -like "*$CleanInput*" } | Select-Object -First 1
}

if (-not $MatchedDir) {
    Write-Host "Error: Could not find any question matching '$Question'." -ForegroundColor Red
    Write-Host "Available questions:" -ForegroundColor Yellow
    $AvailableDirs | ForEach-Object { Write-Host " - $($_.Name)" }
    exit 1
}

$SourceDir = $MatchedDir.FullName
$QuestionName = $MatchedDir.Name

Write-Host "Processing question: $QuestionName..." -ForegroundColor Cyan

# 3. Clean previous question components in my-app/src and components/
if (-not (Test-Path -Path $TargetSrcDir)) {
    New-Item -ItemType Directory -Path $TargetSrcDir -Force | Out-Null
} else {
    Get-ChildItem -Path $TargetSrcDir -Filter "*.jsx" | Remove-Item -Force -ErrorAction SilentlyContinue
}

if (Test-Path -Path $TargetCompDir) {
    Remove-Item -Path $TargetCompDir -Recurse -Force -ErrorAction SilentlyContinue
}
New-Item -ItemType Directory -Path $TargetCompDir -Force | Out-Null

# 4. Copy App component
$SourceAppJsx = Join-Path -Path $SourceDir -ChildPath "App.jsx"
$SourceAppJs = Join-Path -Path $SourceDir -ChildPath "App.js"
$TargetAppJsx = Join-Path -Path $TargetSrcDir -ChildPath "App.jsx"

if (Test-Path -Path $SourceAppJsx) {
    Copy-Item -Path $SourceAppJsx -Destination $TargetAppJsx -Force
    Write-Host "Copied: App.jsx -> my-app/src/App.jsx" -ForegroundColor Green
} elseif (Test-Path -Path $SourceAppJs) {
    Copy-Item -Path $SourceAppJs -Destination (Join-Path -Path $TargetSrcDir -ChildPath "App.js") -Force
    Write-Host "Copied: App.js -> my-app/src/App.js" -ForegroundColor Green
} else {
    Write-Host "Warning: No App.jsx or App.js found in $SourceDir" -ForegroundColor Yellow
}

# 5. Copy other components into my-app/src/ and my-app/src/components/
$ComponentFiles = Get-ChildItem -Path $SourceDir -File | Where-Object { $_.Name -ne "App.jsx" -and $_.Name -ne "App.js" }
foreach ($file in $ComponentFiles) {
    Copy-Item -Path $file.FullName -Destination (Join-Path -Path $TargetSrcDir -ChildPath $file.Name) -Force
    Copy-Item -Path $file.FullName -Destination (Join-Path -Path $TargetCompDir -ChildPath $file.Name) -Force
    Write-Host "Copied: $($file.Name) -> my-app/src/ & my-app/src/components/" -ForegroundColor Green
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host " Successfully loaded $QuestionName into my-app! " -ForegroundColor Green
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
