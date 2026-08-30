@echo off
cd /d C:\Users\DOM\Desktop\koon
git add -A
git commit -m "feat: section-publicites complete v1.1.0 — stores, composants, integration, snooze"
git push origin main
echo EXIT_CODE=%ERRORLEVEL%
