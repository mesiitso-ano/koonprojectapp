@echo off
title Push vers GitHub - Configuration Automatique
color 0A

cls
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                                                               ║
echo ║              PUSH VERS GITHUB + AUTO-BUILD                    ║
echo ║                                                               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo.

cd /d "%~dp0"

echo [1/5] Ajout de tous les fichiers...
git add .

echo.
echo [2/5] Commit...
git commit -m "✨ Configuration complète: GitHub Actions + Mise à jour auto + Optimisations"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [INFO] Aucun changement à commiter ou déjà commité
)

echo.
echo [3/5] Configuration du remote (si nécessaire)...
git remote get-url origin >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Configuration du remote GitHub...
    git remote add origin https://github.com/mesiitso-ano/koonprojectapp.git
    git branch -M main
)

echo.
echo [4/5] Push vers GitHub...
git push -u origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERREUR] Le push a échoué
    echo.
    echo Vérifiez :
    echo   1. Votre connexion Internet
    echo   2. Vos permissions sur le repo
    echo   3. Votre authentification Git
    echo.
    pause
    exit /b 1
)

echo.
echo [5/5] Push des tags (releases)...
git push --tags 2>nul

echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║                                                               ║
echo ║   ✅ PUSH RÉUSSI !                                            ║
echo ║                                                               ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.
echo 🚀 GitHub Actions est maintenant actif !
echo.
echo Voir les builds en cours :
echo   https://github.com/mesiitso-ano/koonprojectapp/actions
echo.
echo Dans ~15 minutes, le .exe sera disponible dans :
echo   https://github.com/mesiitso-ano/koonprojectapp/releases
echo.
echo ════════════════════════════════════════════════════════════════
echo.
echo Voulez-vous ouvrir GitHub Actions dans le navigateur ? (O/N)
set /p OPEN=
if /i "%OPEN%"=="O" (
    start https://github.com/mesiitso-ano/koonprojectapp/actions
)

echo.
pause
