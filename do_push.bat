@echo off
cd /d C:\Users\DOM\Desktop\koon
git add -A
git commit -m "feat: tasks 1-4 section-publicites — DB migrations, adsRepo, IPC handlers, preload, types"
git push origin main
echo EXIT_CODE=%ERRORLEVEL%
