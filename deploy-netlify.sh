#!/bin/bash
# Deploy to Netlify
# Make sure you're logged in: netlify login

echo "🚀 Deploying to Netlify..."
netlify deploy --prod

if [ $? -eq 0 ]; then
    echo "✅ Netlify deployment successful!"
else
    echo "❌ Netlify deployment failed!"
    exit 1
fi
