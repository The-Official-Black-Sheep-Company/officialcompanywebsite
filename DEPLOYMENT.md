# Deployment Guide

## Quick Start

Your code has already been pushed to GitLab and GitHub! ✅

### Current Status
- **GitLab**: ✅ Pushed to `origin/main`
- **GitHub**: ✅ Pushed to `melly/main`

## Deploy to Firebase Hosting

### Prerequisites
```bash
npm install -g firebase-tools
firebase login
```

### Deploy
```bash
firebase deploy --project website-space-34008211-14686
```

Or use the script:
```bash
# Windows
deploy-firebase.bat

# macOS/Linux
bash deploy-firebase.sh
```

## Deploy to Netlify

### Prerequisites
```bash
npm install -g netlify-cli
netlify login
```

### Deploy
```bash
netlify deploy --prod
```

Or use the script:
```bash
# Windows
deploy-netlify.bat

# macOS/Linux
bash deploy-netlify.sh
```

## Deploy Everything at Once

### Windows
```bash
deploy-all.bat
```

### macOS/Linux
```bash
bash deploy-all.sh
```

## Environment Variables

### Firebase Project
- **Project ID**: `website-space-34008211-14686`
- **Config File**: `firebase.json`
- **RC File**: `.firebaserc`

### Netlify
- **Config File**: `netlify.toml`
- **Publish Directory**: `public`

## Deployment Checklist

- [ ] Code committed and pushed to GitLab
- [ ] Code pushed to GitHub
- [ ] Firebase CLI installed and authenticated
- [ ] Netlify CLI installed and authenticated
- [ ] Firebase deployment successful
- [ ] Netlify deployment successful
- [ ] Test deployed sites

## Troubleshooting

### Firebase Issues
```bash
# Check authentication
firebase auth:list

# Check project
firebase projects:list

# View deployment logs
firebase functions:log
```

### Netlify Issues
```bash
# Check authentication
netlify status

# View deployment logs
netlify deploy --prod --verbose
```

## Useful Links

- **GitLab**: https://gitlab.com/blackshepherddeveloper-group/blackshepherddeveloper-project
- **GitHub**: https://github.com/The-Official-Black-Sheep-Company/officialcompanywebsite
- **Firebase Console**: https://console.firebase.google.com/project/website-space-34008211-14686
- **Netlify Dashboard**: https://app.netlify.com

## Next Steps

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login to Firebase: `firebase login`
3. Deploy: `firebase deploy --project website-space-34008211-14686`
4. Install Netlify CLI: `npm install -g netlify-cli`
5. Login to Netlify: `netlify login`
6. Deploy: `netlify deploy --prod`
