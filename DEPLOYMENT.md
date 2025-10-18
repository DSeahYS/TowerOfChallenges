# Deployment Guide for Tower of Challenges

This document provides comprehensive instructions for deploying the Tower of Challenges application to production using Firebase.

## Overview

The Tower of Challenges application consists of multiple components:
- **Frontend**: React/Vite application deployed via Firebase Hosting
- **Reddit Integration**: Devvit Bolt app for Reddit functionality
- **Backend**: Firebase Functions for score handling and GIF sharing
- **Database**: Firestore for score storage
- **Storage**: Firebase Storage for GIF files

## Prerequisites

### System Requirements
- Node.js 18+
- Firebase CLI installed (`npm install -g firebase-tools`)
- Firebase project created in Firebase Console
- Reddit Developer account with app credentials

### Firebase Project Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Firestore Database
4. Enable Firebase Storage
5. Enable Firebase Functions
6. Enable Firebase Hosting

### Environment Setup

1. **Firebase CLI Authentication**
    ```bash
    firebase login
    firebase use --add
    # Select your Firebase project
    ```

2. **Reddit App Setup**
    - Go to [Reddit Apps](https://www.reddit.com/prefs/apps)
    - Create a new app (type: script)
    - Note down: Client ID, Client Secret, Username, Password

3. **Environment Variables**
    Create `.env.production` file:
    ```env
    # Firebase
    FIREBASE_PROJECT_ID=your-project-id

    # Reddit API
    REDDIT_CLIENT_ID=your-client-id
    REDDIT_CLIENT_SECRET=your-client-secret
    REDDIT_USERNAME=your-username
    REDDIT_PASSWORD=your-password

    # Application
    APP_ENV=production
    FIRESTORE_COLLECTION=TowerScores
    FIREBASE_STORAGE_BUCKET=tower-challenges-gifs
    ```

## Deployment Steps

### One-Command Production Deployment

The simplest way to deploy everything is using Firebase CLI:

```bash
# From the TowerOfChallenges directory
firebase deploy --only hosting,functions,firestore
```

This command will:
1. Build the frontend application
2. Deploy Firebase Functions
3. Deploy Firestore rules and indexes
4. Deploy the hosting site
5. Update Firebase Storage rules

### Manual Deployment Steps

If you need more control, deploy components individually:

#### 1. Initialize Firebase in Project
```bash
firebase init
# Select: Hosting, Functions, Firestore
```

#### 2. Deploy Firestore
```bash
firebase deploy --only firestore
```

#### 3. Deploy Functions
```bash
firebase deploy --only functions
```

#### 4. Deploy Hosting
```bash
npm run build
firebase deploy --only hosting
```

### Staging Deployment

For testing before production:

```bash
# Deploy to staging (if you have multiple Firebase projects)
firebase use staging-project
firebase deploy --only hosting,functions

# Test your staging deployment
# When ready, switch back to production
firebase use production-project
firebase deploy --only hosting,functions
```

## Configuration Files

### firebase.json
Firebase project configuration including:
- Hosting settings (public directory, rewrites)
- Functions configuration
- Firestore rules and indexes paths

### firestore.rules
Security rules for Firestore database:
- Score collection access rules
- User authentication requirements
- Data validation rules

### firestore.indexes.json
Database indexes for efficient queries:
- Score queries by tower ID
- Leaderboard sorting indexes
- Timestamp-based indexes

## Monitoring and Health Checks

### Health Check Command
```bash
firebase functions:list
firebase hosting:channel:list
```

This checks:
- Functions deployment status
- Hosting site availability
- Firestore connectivity

### Logs and Monitoring
- **Functions Logs**: Available in Firebase Console > Functions > Logs
- **Hosting**: Access logs in Firebase Console > Hosting
- **Firestore**: Metrics and logs in Firebase Console > Firestore
- **Storage**: Access logs in Firebase Console > Storage

## Troubleshooting

### Common Issues

#### Firebase Deployment Fails
- Check Firebase CLI authentication (`firebase login`)
- Verify project selection (`firebase use`)
- Ensure billing is enabled for Functions

#### Functions Timeout
- Check function logs in Firebase Console
- Verify Firestore permissions
- Ensure proper environment variables

#### Hosting Deployment Issues
- Check build process completes successfully
- Verify `dist` directory exists
- Check Firebase Hosting configuration

#### Firestore Connection Issues
- Verify Firestore is enabled in Firebase Console
- Check security rules allow access
- Ensure proper collection names

### Rollback Procedures

If deployment fails:

```bash
# Rollback functions to previous version
firebase functions:rollback

# Redeploy hosting from previous build
firebase hosting:rollback
```

## Performance Optimization

### Firebase Functions
- Memory allocation: 256MB (score handlers), 512MB (GIF handler)
- Timeout: 60s (score handlers), 300s (GIF handler)
- Min instances to reduce cold starts

### Firestore
- Single field indexes for efficient queries
- Composite indexes for complex queries
- Data structure optimized for read patterns

### Firebase Storage
- Public read access for GIF sharing
- CORS configured for web access

## Security Considerations

- **Environment Variables**: Never commit secrets to version control
- **Firestore Rules**: Granular access control
- **Functions**: Secure function invocation
- **Storage**: Public access limited to necessary objects
- **Firebase Auth**: User authentication when needed

## Cost Optimization

- **Functions**: Pay only for execution time
- **Firestore**: Pay for reads/writes/deletes
- **Storage**: Pay for storage and bandwidth
- **Hosting**: Free tier for static content

## Support

For deployment issues:
1. Check Firebase logs: `firebase functions:log`
2. Review Firebase Console for specific services
3. Check deployment status: `firebase projects:list`
4. Verify project configuration: `firebase use`

## Version History

- **v1.0.0**: Initial production deployment
  - Basic tower building gameplay
  - Score submission and leaderboards
  - GIF sharing functionality
  - Reddit integration
  - Firebase Functions backend
  - Firestore database
  - Firebase Hosting