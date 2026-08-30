@echo off
echo Installation des dépendances...
call npm.cmd install
echo.
echo Build de production...
call npm.cmd run tauri build
echo.
echo Build terminé ! L'exécutable se trouve dans src-tauri/target/release/
pause
