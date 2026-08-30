@echo off
title Koon - Build Production
color 0A

echo ════════════════════════════════════════════════════
echo    KOON - COMPILATION PRODUCTION .EXE
echo ════════════════════════════════════════════════════
echo.

REM Vérifier si Node.js est installé
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERREUR] Node.js n'est pas installé !
    echo Téléchargez-le sur : https://nodejs.org/
    pause
    exit /b 1
)

REM Vérifier si Rust est installé
where rustc >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERREUR] Rust n'est pas installé !
    echo Installez-le avec : https://rustup.rs/
    pause
    exit /b 1
)

echo [✓] Node.js détecté : 
node --version
echo.

echo [✓] Rust détecté :
rustc --version
echo.

echo ════════════════════════════════════════════════════
echo  ÉTAPE 1/5 : Installation des dépendances NPM
echo ════════════════════════════════════════════════════
echo.

call npm.cmd install
if %ERRORLEVEL% NEQ 0 (
    echo [ERREUR] Échec de l'installation des dépendances !
    pause
    exit /b 1
)

echo.
echo [✓] Dépendances NPM installées avec succès
echo.

echo ════════════════════════════════════════════════════
echo  ÉTAPE 2/5 : Vérification TypeScript
echo ════════════════════════════════════════════════════
echo.

call npx tsc --noEmit
if %ERRORLEVEL% NEQ 0 (
    echo [ATTENTION] Erreurs TypeScript détectées !
    echo Continuer quand même ? (O/N)
    set /p CONTINUE=
    if /i not "%CONTINUE%"=="O" (
        echo Build annulé.
        pause
        exit /b 1
    )
)

echo.
echo [✓] Vérification TypeScript terminée
echo.

echo ════════════════════════════════════════════════════
echo  ÉTAPE 3/5 : Compilation React + Vite
echo ════════════════════════════════════════════════════
echo.

call npm.cmd run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERREUR] Échec de la compilation frontend !
    pause
    exit /b 1
)

echo.
echo [✓] Frontend compilé avec succès
echo.

echo ════════════════════════════════════════════════════
echo  ÉTAPE 4/5 : Compilation Rust + Tauri
echo ════════════════════════════════════════════════════
echo.
echo ⚠️  ATTENTION : Cette étape peut prendre 10-20 minutes
echo     la première fois (téléchargement + compilation)
echo.

call npm.cmd run tauri build
if %ERRORLEVEL% NEQ 0 (
    echo [ERREUR] Échec de la compilation Tauri !
    pause
    exit /b 1
)

echo.
echo [✓] Tauri compilé avec succès
echo.

echo ════════════════════════════════════════════════════
echo  ÉTAPE 5/5 : Vérification du .EXE
echo ════════════════════════════════════════════════════
echo.

set EXE_PATH=src-tauri\target\release\koon.exe
if exist "%EXE_PATH%" (
    echo [✓] Fichier .EXE créé avec succès !
    echo.
    echo 📁 Emplacement : %CD%\%EXE_PATH%
    echo.
    for %%A in ("%EXE_PATH%") do (
        echo 📏 Taille : %%~zA octets
    )
    echo.
    echo ════════════════════════════════════════════════════
    echo   ✅ BUILD RÉUSSIE !
    echo ════════════════════════════════════════════════════
    echo.
    echo Voulez-vous ouvrir le dossier contenant le .EXE ? (O/N)
    set /p OPEN_FOLDER=
    if /i "%OPEN_FOLDER%"=="O" (
        explorer /select,"%EXE_PATH%"
    )
) else (
    echo [ERREUR] Le fichier .EXE n'a pas été créé !
    echo Vérifiez les logs ci-dessus pour diagnostiquer le problème.
)

echo.
echo ════════════════════════════════════════════════════
pause
