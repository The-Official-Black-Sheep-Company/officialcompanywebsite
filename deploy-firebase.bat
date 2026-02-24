@echo off
REM Deploy to Firebase Hosting
REM Make sure you're logged in: firebase login

echo 🚀 Deploying to Firebase Hosting...
call firebase deploy --project website-space-34008211-14686

if %ERRORLEVEL% EQU 0 (
    echo ✅ Firebase deployment successful!
) else (
    echo ❌ Firebase deployment failed!
    exit /b 1
)
