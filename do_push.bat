@echo off
cd /d C:\Users\DOM\Desktop\koon
git config user.email koon@koon.app
git config user.name Koon
git add -A
git commit -m "feat: Koon Chat v1.0"
git push -u origin main --force
echo EXIT_CODE=%ERRORLEVEL%
