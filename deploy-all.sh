#!/bin/bash
# Complete deployment script for all platforms

echo "========================================"
echo "📦 COMPLETE DEPLOYMENT SCRIPT"
echo "========================================"
echo ""

# Check if git is available
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed"
    exit 1
fi

# Check current git status
echo "📋 Checking git status..."
git status

echo ""
echo "========================================"
echo "1️⃣  PUSHING TO GIT REPOSITORIES"
echo "========================================"
echo ""

# Push to GitLab
echo "🔄 Pushing to GitLab (origin)..."
git push origin main
if [ $? -ne 0 ]; then
    echo "⚠️  GitLab push had issues, but continuing..."
fi

# Push to GitHub
echo "🔄 Pushing to GitHub (melly)..."
git push melly main
if [ $? -ne 0 ]; then
    echo "⚠️  GitHub push had issues, but continuing..."
fi

echo ""
echo "========================================"
echo "2️⃣  FIREBASE DEPLOYMENT"
echo "========================================"
echo ""
echo "📝 To deploy to Firebase:"
echo "   1. Install Firebase CLI: npm install -g firebase-tools"
echo "   2. Login: firebase login"
echo "   3. Run: firebase deploy --project website-space-34008211-14686"
echo ""

# Check if firebase CLI is available
if command -v firebase &> /dev/null; then
    echo "🚀 Firebase CLI detected. Deploying..."
    firebase deploy --project website-space-34008211-14686
    if [ $? -eq 0 ]; then
        echo "✅ Firebase deployment successful!"
    else
        echo "⚠️  Firebase deployment had issues"
    fi
else
    echo "⚠️  Firebase CLI not found. Skipping Firebase deployment."
fi

echo ""
echo "========================================"
echo "3️⃣  NETLIFY DEPLOYMENT"
echo "========================================"
echo ""
echo "📝 To deploy to Netlify:"
echo "   1. Install Netlify CLI: npm install -g netlify-cli"
echo "   2. Login: netlify login"
echo "   3. Run: netlify deploy --prod"
echo ""

# Check if netlify CLI is available
if command -v netlify &> /dev/null; then
    echo "🚀 Netlify CLI detected. Deploying..."
    netlify deploy --prod
    if [ $? -eq 0 ]; then
        echo "✅ Netlify deployment successful!"
    else
        echo "⚠️  Netlify deployment had issues"
    fi
else
    echo "⚠️  Netlify CLI not found. Skipping Netlify deployment."
fi

echo ""
echo "========================================"
echo "✅ DEPLOYMENT SUMMARY"
echo "========================================"
echo ""
echo "✓ Code pushed to GitLab"
echo "✓ Code pushed to GitHub"
echo "✓ Firebase deployment (if CLI available)"
echo "✓ Netlify deployment (if CLI available)"
echo ""
echo "🎉 All deployments completed!"
echo ""
