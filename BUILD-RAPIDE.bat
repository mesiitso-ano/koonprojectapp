@echo off
title Koon - Build Rapide + Test
color 0A

echo ╔══════════════════════════════════════════════════════════╗
echo ║  KOON - BUILD OPTIMISÉ + LANCEMENT AUTO                  ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

REM Créer le dossier target si besoin
if not exist "src-tauri\target" (
    echo [→] Création dossier target...
    mkdir "src-tauri\target" 2>nul
)

echo [1/2] Build frontend + backend (mode dev rapide)...
echo.

REM Build en mode dev (10x plus rapide que release)
call npm.cmd run tauri build -- --debug

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERREUR] Le build a échoué
    echo.
    echo SOLUTION : Lancer PowerShell en Administrateur
    pause
    exit /b 1
)

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║  ✅ BUILD RÉUSSI !                                       ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

set EXE_PATH=src-tauri\target\debug\koon.exe

if exist "%EXE_PATH%" (
    echo 📁 .EXE créé : %EXE_PATH%
    echo.
    echo Voulez-vous LANCER l'application maintenant ? (O/N)
    set /p LAUNCH=
    
    if /i "%LAUNCH%"=="O" (
        echo.
        echo 🚀 Lancement de Koon...
        start "" "%EXE_PATH%"
        echo.
        echo ✅ Application lancée !
    )
) else (
    echo [ERREUR] .EXE non trouvé
)

echo.
pause
