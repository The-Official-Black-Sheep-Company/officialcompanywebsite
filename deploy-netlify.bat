@echo off
REM Deploy to Netlify
REM Make sure you're logged in: netlify login

echo 🚀 Deploying to Netlify...
call netlify deploy --prod

if %ERRORLEVEL% EQU 0 (
    echo ✅ Netlify deployment successful!
) else (
    echo ❌ Netlify deployment failed!
    exit /b 1
)
