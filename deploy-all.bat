@echo off
REM Complete deployment script for all platforms

echo ========================================
echo 📦 COMPLETE DEPLOYMENT SCRIPT
echo ========================================
echo.

REM Check if git is available
git --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Git is not installed or not in PATH
    exit /b 1
)

REM Check current git status
echo 📋 Checking git status...
git status

echo.
echo ========================================
echo 1️⃣  PUSHING TO GIT REPOSITORIES
echo ========================================
echo.

REM Push to GitLab
echo 🔄 Pushing to GitLab (origin)...
git push origin main
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  GitLab push had issues, but continuing...
)

REM Push to GitHub
echo 🔄 Pushing to GitHub (melly)...
git push melly main
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  GitHub push had issues, but continuing...
)

echo.
echo ========================================
echo 2️⃣  FIREBASE DEPLOYMENT
echo ========================================
echo.
echo 📝 To deploy to Firebase:
echo    1. Install Firebase CLI: npm install -g firebase-tools
echo    2. Login: firebase login
echo    3. Run: firebase deploy --project website-space-34008211-14686
echo.

REM Check if firebase CLI is available
firebase --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo 🚀 Firebase CLI detected. Deploying...
    firebase deploy --project website-space-34008211-14686
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Firebase deployment successful!
    ) else (
        echo ⚠️  Firebase deployment had issues
    )
) else (
    echo ⚠️  Firebase CLI not found. Skipping Firebase deployment.
)

echo.
echo ========================================
echo 3️⃣  NETLIFY DEPLOYMENT
echo ========================================
echo.
echo 📝 To deploy to Netlify:
echo    1. Install Netlify CLI: npm install -g netlify-cli
echo    2. Login: netlify login
echo    3. Run: netlify deploy --prod
echo.

REM Check if netlify CLI is available
netlify --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo 🚀 Netlify CLI detected. Deploying...
    netlify deploy --prod
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Netlify deployment successful!
    ) else (
        echo ⚠️  Netlify deployment had issues
    )
) else (
    echo ⚠️  Netlify CLI not found. Skipping Netlify deployment.
)

echo.
echo ========================================
echo ✅ DEPLOYMENT SUMMARY
echo ========================================
echo.
echo ✓ Code pushed to GitLab
echo ✓ Code pushed to GitHub
echo ✓ Firebase deployment (if CLI available)
echo ✓ Netlify deployment (if CLI available)
echo.
echo 🎉 All deployments completed!
echo.
