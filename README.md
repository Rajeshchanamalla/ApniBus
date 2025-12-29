# Smart Issue Board

A modern, intelligent issue tracking system built with React, TypeScript, and Firebase. This application helps teams manage issues with smart duplicate detection and intuitive workflow management.

## 🚀 Live Demo

[Deployed on Vercel](https://your-app-url.vercel.app) (Update with your actual deployment URL)

## ✨ Features

- **Authentication**: Secure email/password authentication using Firebase Auth
- **Issue Management**: Create, view, and manage issues with all essential fields
- **Smart Similarity Detection**: Automatically detects similar issues before creation
- **Filtering & Sorting**: Filter by status and priority, sorted by newest first
- **Status Workflow**: Enforces proper status transitions (Open → In Progress → Done)
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **CSS3** - Custom styling with modern design

### Backend & Services
- **Firebase Firestore** - NoSQL database for issue storage
- **Firebase Auth** - Email/password authentication
- **Vercel** - Hosting and deployment platform

## 📋 Prerequisites

- Node.js 18+ and npm
- Firebase project with Firestore and Auth enabled
- Vercel account (for deployment)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/smart-issue-board.git
   cd smart-issue-board
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env.local`
   - Fill in your Firebase configuration values:
     ```env
     VITE_FIREBASE_API_KEY=your_api_key_here
     VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```

4. **Set up Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication (Email/Password provider)
   - Create a Firestore database
   - Copy your Firebase config values to `.env.local`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy via Vercel**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard:
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`
   - Deploy!

## 📊 Firestore Data Structure

### Collection: `issues`

Each document in the `issues` collection has the following structure:

```typescript
{
  title: string              // Issue title
  description: string         // Detailed description
  priority: "Low" | "Medium" | "High"
  status: "Open" | "In Progress" | "Done"
  assignedTo: string          // Email or name of assignee
  createdTime: Timestamp      // Firebase Timestamp
  createdBy: string          // Email of creator
}
```

### Indexes Required

Firestore will automatically create indexes for:
- `status` (for filtering)
- `priority` (for filtering)
- `createdTime` (for sorting)

If you encounter index errors, create composite indexes in Firebase Console:
- Collection: `issues`
- Fields: `status` (Ascending), `createdTime` (Descending)
- Fields: `priority` (Ascending), `createdTime` (Descending)
- Fields: `status` (Ascending), `priority` (Ascending), `createdTime` (Descending)

## 🧠 Similar Issue Detection

### How It Works

The application uses a **Levenshtein distance algorithm** to detect similar issues:

1. **Real-time Detection**: As you type in the issue form, the system checks for similar issues
2. **Similarity Threshold**: Issues with ≥60% similarity are flagged
3. **Multi-field Comparison**: Compares both title and description
4. **User-Friendly Warning**: Shows up to 3 most similar issues with similarity scores

### Algorithm Details

- Uses normalized Levenshtein distance to calculate similarity
- Compares title and description separately
- Takes the maximum similarity score between title and description
- Debounced to avoid excessive API calls (500ms delay)

### Example

If you try to create an issue titled "Fix login bug", the system might detect:
- "Fix login issue" (85% similar - Title is similar)
- "Login bug fix needed" (72% similar - Description is similar)

## 🎯 Design Decisions

### Why React + TypeScript + Vite?

1. **React**: Industry standard, excellent ecosystem, component reusability
2. **TypeScript**: Catches errors at compile-time, better IDE support, self-documenting code
3. **Vite**: Lightning-fast dev server, optimized production builds, excellent DX

### Why This Firestore Structure?

- **Flat Structure**: Simple queries, easy filtering
- **Timestamp Field**: Native Firestore Timestamp for accurate sorting
- **No Nested Collections**: Keeps queries simple and performant
- **Indexed Fields**: Status and Priority are indexed for fast filtering

### Similar Issue Handling Approach

I chose to:
- **Warn, not block**: Users can still create issues if they're confident it's different
- **Show top 3**: Not overwhelming, but informative
- **Real-time feedback**: Debounced checks as user types
- **Transparent scoring**: Shows similarity percentage for trust

Alternative approaches considered:
- Blocking creation (too restrictive)
- Only checking on submit (less helpful)
- Using external ML APIs (overkill, adds cost)

## 🤔 Challenges & Confusions

### Challenges Faced

1. **Firestore Query Limitations**
   - Initially tried to filter by multiple fields simultaneously
   - Solution: Created separate queries for status and priority filters
   - Could be improved with composite indexes for better performance

2. **Status Transition Validation**
   - Needed to prevent Open → Done transitions
   - Had to handle this in the UI layer since Firestore doesn't have built-in validation
   - Solution: Client-side validation with user-friendly error messages

3. **Similarity Algorithm Tuning**
   - Finding the right threshold (60%) required testing
   - Too low = too many false positives
   - Too high = misses actual duplicates
   - Solution: Tested with various thresholds, 60% felt right

4. **Real-time Similarity Checks**
   - Debouncing was necessary to avoid excessive Firestore reads
   - Had to balance responsiveness vs. API calls
   - Solution: 500ms debounce felt like a good balance

### What Was Confusing

1. **Firestore Timestamp Handling**
   - Converting between JavaScript Date and Firestore Timestamp
   - Had to ensure proper conversion when reading/writing

2. **Vite Environment Variables**
   - Must prefix with `VITE_` to be accessible in client code
   - Different from Create React App's `REACT_APP_` prefix

## 🚀 Future Improvements

### Short-term
1. **Edit Issues**: Allow users to edit existing issues
2. **Delete Issues**: Add delete functionality with confirmation
3. **Issue Details View**: Click to see full issue details
4. **Better Filtering UI**: Add clear filters button, show active filters
5. **Pagination**: For large issue lists

### Medium-term
1. **Comments**: Add comments/notes to issues
2. **Issue History**: Track status changes over time
3. **User Profiles**: Store user names, not just emails
4. **Notifications**: Email notifications for assigned issues
5. **Search**: Full-text search across issues

### Long-term
1. **Advanced Similarity**: Use ML models for better duplicate detection
2. **Issue Templates**: Pre-defined templates for common issues
3. **Bulk Operations**: Select and update multiple issues
4. **Export**: Export issues to CSV/PDF
5. **Analytics Dashboard**: Charts and metrics for issue tracking

### Technical Improvements
1. **Unit Tests**: Add Jest/React Testing Library tests
2. **E2E Tests**: Add Cypress/Playwright tests
3. **Error Boundaries**: Better error handling
4. **Loading States**: Skeleton loaders instead of simple "Loading..."
5. **Optimistic Updates**: Update UI immediately, sync with server

## 📝 License

This project is created as an internship assignment.

## 👤 Author

Created as part of an internship assignment.

---

**Note**: This project uses Firebase Firestore and requires proper security rules. Make sure to set up Firestore security rules in Firebase Console to restrict access appropriately.

