# Deployment Guide

## Prerequisites

1. **Firebase Project Setup**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project
   - Enable Authentication → Email/Password provider
   - Create a Firestore database (start in test mode, then update rules)
   - Copy your Firebase config values

2. **GitHub Repository**
   - Create a new public repository on GitHub
   - Push your code to the repository

## Step-by-Step Deployment

### 1. Set Up Firebase

1. Create a Firebase project
2. Enable Authentication:
   - Go to Authentication → Sign-in method
   - Enable Email/Password provider
3. Create Firestore Database:
   - Go to Firestore Database
   - Create database (start in test mode)
   - Update security rules (copy from `firestore.rules` file)
4. Get Firebase Config:
   - Go to Project Settings → General
   - Scroll to "Your apps" section
   - Click on Web app icon (</>)
   - Copy the config values

### 2. Set Up Environment Variables Locally

1. Copy `.env.example` to `.env.local`
2. Fill in your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=AIza...
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

### 3. Test Locally

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` and test:
- Sign up with a test account
- Create an issue
- Test filtering and status changes

### 4. Deploy to Vercel

#### Option A: Via Vercel Dashboard

1. Go to [Vercel](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure project:
   - Framework Preset: Vite
   - Root Directory: `./` (default)
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Add Environment Variables:
   - Click "Environment Variables"
   - Add all 6 Firebase variables:
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`
7. Click "Deploy"

#### Option B: Via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

Follow the prompts and add environment variables when asked.

### 5. Update Firestore Security Rules

After deployment, update your Firestore rules in Firebase Console:

1. Go to Firestore Database → Rules
2. Copy the content from `firestore.rules`
3. Publish the rules

### 6. Create Firestore Indexes (if needed)

If you see index errors in the console:

1. Go to Firestore Database → Indexes
2. Create composite indexes for:
   - Collection: `issues`
   - Fields: `status` (Ascending), `createdTime` (Descending)
   - Fields: `priority` (Ascending), `createdTime` (Descending)
   - Fields: `status` (Ascending), `priority` (Ascending), `createdTime` (Descending)

### 7. Test Production Deployment

1. Visit your Vercel deployment URL
2. Test all features:
   - Sign up / Login
   - Create issues
   - Filter issues
   - Change status (test Open → Done restriction)
   - Similar issue detection

## Troubleshooting

### Issue: "Firebase: Error (auth/configuration-not-found)"
- **Solution**: Make sure all environment variables are set correctly in Vercel

### Issue: "Missing or insufficient permissions"
- **Solution**: Check Firestore security rules are published correctly

### Issue: "The query requires an index"
- **Solution**: Create the required composite index in Firestore Console

### Issue: Build fails on Vercel
- **Solution**: Check build logs, ensure all dependencies are in `package.json`

### Issue: Environment variables not working
- **Solution**: Make sure variables start with `VITE_` prefix for Vite projects

## Post-Deployment Checklist

- [ ] Firebase Authentication enabled
- [ ] Firestore database created
- [ ] Security rules published
- [ ] Environment variables set in Vercel
- [ ] App deployed successfully
- [ ] Can sign up/login
- [ ] Can create issues
- [ ] Can filter issues
- [ ] Status transitions work correctly
- [ ] Similar issue detection works

