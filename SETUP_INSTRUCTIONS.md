# Setup Instructions - Step by Step Guide

## ✅ Completed Steps

1. ✅ Dependencies installed (`npm install`)
2. ✅ Git repository initialized
3. ✅ `.env.local` file created (you need to fill in Firebase values)

## 🔥 Step 1: Firebase Setup

### 1.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name (e.g., "smart-issue-board")
4. Click **Continue**
5. **Disable** Google Analytics (optional, you can enable later)
6. Click **Create project**
7. Wait for project creation, then click **Continue**

### 1.2 Enable Authentication

1. In Firebase Console, click **Authentication** in the left menu
2. Click **Get started** (if first time)
3. Go to **Sign-in method** tab
4. Click on **Email/Password**
5. **Enable** the first toggle (Email/Password)
6. Click **Save**

### 1.3 Create Firestore Database

1. In Firebase Console, click **Firestore Database** in the left menu
2. Click **Create database**
3. Select **Start in test mode** (we'll update rules later)
4. Choose a **location** (choose closest to your users)
5. Click **Enable**

### 1.4 Get Firebase Configuration

1. In Firebase Console, click the **gear icon** ⚙️ next to "Project Overview"
2. Select **Project settings**
3. Scroll down to **"Your apps"** section
4. Click the **Web icon** `</>`
5. Register app:
   - App nickname: "Smart Issue Board" (or any name)
   - **Don't** check "Also set up Firebase Hosting"
   - Click **Register app**
6. **Copy the config object** - it looks like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123"
   };
   ```

### 1.5 Update .env.local File

1. Open `.env.local` file in your project root
2. Replace the placeholder values with your Firebase config:

   ```env
   VITE_FIREBASE_API_KEY=AIza... (from apiKey)
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com (from authDomain)
   VITE_FIREBASE_PROJECT_ID=your-project-id (from projectId)
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com (from storageBucket)
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789 (from messagingSenderId)
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123 (from appId)
   ```

3. **Save** the file

### 1.6 Update Firestore Security Rules

1. In Firebase Console, go to **Firestore Database** → **Rules** tab
2. Replace the default rules with the content from `firestore.rules` file:

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /issues/{issueId} {
         allow read: if request.auth != null;
         allow create: if request.auth != null
           && request.resource.data.createdBy == request.auth.token.email;
         allow update: if request.auth != null;
         allow delete: if request.auth != null;
       }
     }
   }
   ```

3. Click **Publish**

## 🧪 Step 2: Test Locally

Run the development server:

```bash
npm run dev
```

The app will start at `http://localhost:5173`

### Test Checklist:
- [ ] App loads without errors
- [ ] Can sign up with a test email
- [ ] Can login with created account
- [ ] Can see your email in the header
- [ ] Can create an issue
- [ ] Can see issues in the list
- [ ] Can filter by status/priority
- [ ] Can change issue status
- [ ] Test Open → Done restriction (should show error)

## 📦 Step 3: Push to GitHub

### 3.1 Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click **"+"** → **"New repository"**
3. Repository name: `smart-issue-board` (or your choice)
4. Description: "Smart Issue Board - Internship Assignment"
5. Set to **Public** (required for assignment)
6. **Don't** initialize with README (we already have one)
7. Click **Create repository**

### 3.2 Push Your Code

GitHub will show you commands. Run these in your terminal:

```bash
# Add your GitHub repository as remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Rename branch to main if needed
git branch -M main

# Push your code
git push -u origin main
```

**Note:** You'll need to authenticate. GitHub may ask for:
- Username and password (use Personal Access Token, not password)
- Or use GitHub Desktop/Git Credential Manager

## 🚀 Step 4: Deploy to Vercel

### 4.1 Import to Vercel

1. Go to [Vercel](https://vercel.com)
2. Sign in with **GitHub** (recommended)
3. Click **"Add New Project"**
4. Click **"Import"** next to your repository
5. Configure project:
   - **Framework Preset:** Vite (should auto-detect)
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` (should be auto-filled)
   - **Output Directory:** `dist` (should be auto-filled)
   - **Install Command:** `npm install` (should be auto-filled)
6. Click **"Environment Variables"** section

### 4.2 Add Environment Variables

Add all 6 Firebase variables one by one:

1. Click **"Add"** for each variable:
   - Key: `VITE_FIREBASE_API_KEY` → Value: (your Firebase API key)
   - Key: `VITE_FIREBASE_AUTH_DOMAIN` → Value: (your auth domain)
   - Key: `VITE_FIREBASE_PROJECT_ID` → Value: (your project ID)
   - Key: `VITE_FIREBASE_STORAGE_BUCKET` → Value: (your storage bucket)
   - Key: `VITE_FIREBASE_MESSAGING_SENDER_ID` → Value: (your sender ID)
   - Key: `VITE_FIREBASE_APP_ID` → Value: (your app ID)

2. Make sure all are added to **Production**, **Preview**, and **Development** environments

### 4.3 Deploy

1. Click **"Deploy"**
2. Wait for deployment (usually 1-2 minutes)
3. Once deployed, you'll get a URL like: `https://your-project.vercel.app`

### 4.4 Test Production

1. Visit your Vercel deployment URL
2. Test all features:
   - [ ] Sign up works
   - [ ] Login works
   - [ ] Can create issues
   - [ ] Can filter issues
   - [ ] Status changes work
   - [ ] Similar issue detection works

## 🔧 Troubleshooting

### Firebase Issues

**Error: "Firebase: Error (auth/configuration-not-found)"**
- Check that all environment variables are set correctly
- Make sure `.env.local` has correct values locally
- Make sure Vercel has all environment variables

**Error: "Missing or insufficient permissions"**
- Check Firestore security rules are published
- Make sure you're logged in

**Error: "The query requires an index"**
- Go to Firestore → Indexes
- Create the suggested composite index
- Wait for index to build (can take a few minutes)

### Vercel Issues

**Build fails**
- Check build logs in Vercel dashboard
- Make sure all dependencies are in `package.json`
- Check that environment variables are set

**App doesn't work after deployment**
- Check browser console for errors
- Verify all environment variables are set in Vercel
- Check Firebase console for any errors

### Local Development Issues

**Port already in use**
```bash
# Kill process on port 5173 (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or use different port
npm run dev -- --port 3000
```

**Module not found errors**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## ✅ Final Checklist

Before submission, verify:

- [ ] Firebase project created and configured
- [ ] Authentication enabled (Email/Password)
- [ ] Firestore database created
- [ ] Security rules published
- [ ] Code pushed to public GitHub repository
- [ ] Deployed to Vercel
- [ ] Environment variables set in Vercel
- [ ] App works in production
- [ ] README.md updated with deployment URL
- [ ] All features tested and working

## 📝 Next Steps After Deployment

1. Update README.md with your actual Vercel deployment URL
2. Test the app thoroughly
3. Take screenshots if needed for submission
4. Make sure GitHub repo is public
5. Submit your assignment!

---

**Need Help?** Check the main README.md for detailed explanations of the code and design decisions.

