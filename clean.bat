@echo off
echo Nettoyage du projet Koon...
echo.

echo [1/4] Suppression de node_modules...
if exist node_modules (
    rmdir /s /q node_modules
    echo ✓ node_modules supprimé
) else (
    echo → node_modules déjà absent
)

echo.
echo [2/4] Suppression du cache Rust...
if exist src-tauri\target (
    rmdir /s /q src-tauri\target
    echo ✓ target/ supprimé
) else (
    echo → target/ déjà absent
)

echo.
echo [3/4] Suppression du build Vite...
if exist dist (
    rmdir /s /q dist
    echo ✓ dist/ supprimé
) else (
    echo → dist/ déjà absent
)

echo.
echo [4/4] Suppression de la base de données...
if exist "%LOCALAPPDATA%\koon\koon.db" (
    del /q "%LOCALAPPDATA%\koon\koon.db"
    echo ✓ Base de données supprimée
) else (
    echo → Base de données déjà absente
)

echo.
echo ═══════════════════════════════════════
echo ✓ Nettoyage terminé !
echo.
echo Pour réinstaller :
echo   npm.cmd install
echo.
pause
