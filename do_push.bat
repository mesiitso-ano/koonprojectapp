@echo off
cd /d C:\Users\DOM\Desktop\koon
git add -A
git commit -m "fix: corriger les 22 problemes identifies (securite, reseau, types, stores)"
git push origin main
echo EXIT_CODE=%ERRORLEVEL%
