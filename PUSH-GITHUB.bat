@echo off
echo ════════════════════════════════════════════════════
echo    PUSH VERS GITHUB + ACTIVATION AUTO-BUILD
echo ════════════════════════════════════════════════════
echo.

cd /d "%~dp0"

echo [1/4] Ajout de tous les fichiers...
git add .

echo.
echo [2/4] Commit des changements...
set /p MESSAGE="Message du commit (ou Entrée pour 'Update'): "
if "%MESSAGE%"=="" set MESSAGE=Update: GitHub Actions + optimisations

git commit -m "%MESSAGE%"

echo.
echo [3/4] Push vers GitHub...
git push origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [INFO] Si vous n'avez pas encore configuré le remote:
    echo   git remote add origin https://github.com/mesiitso-ano/koonprojectapp.git
    echo   git branch -M main
    echo   git push -u origin main
    pause
    exit /b 1
)

echo.
echo [4/4] Push des tags (si existants)...
git push --tags

echo.
echo ════════════════════════════════════════════════════
echo   ✅ PUSH RÉUSSI !
echo ════════════════════════════════════════════════════
echo.
echo GitHub Actions va maintenant compiler automatiquement !
echo.
echo Voir les builds : 
echo   https://github.com/mesiitso-ano/koonprojectapp/actions
echo.
pause
