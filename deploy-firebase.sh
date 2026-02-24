#!/bin/bash
# Deploy to Firebase Hosting
# Make sure you're logged in: firebase login

echo "🚀 Deploying to Firebase Hosting..."
firebase deploy --project website-space-34008211-14686

if [ $? -eq 0 ]; then
    echo "✅ Firebase deployment successful!"
else
    echo "❌ Firebase deployment failed!"
    exit 1
fi
