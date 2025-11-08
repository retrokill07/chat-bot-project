# Firebase Setup Guide - Step by Step

## Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add Project" or "Create a Project"
3. Enter project name (e.g., "ai-chat-app")
4. Continue through setup steps
5. You can disable Google Analytics if you want (optional)

## Step 2: Enable Authentication

1. In Firebase Console, click "Authentication" in left sidebar
2. Click "Get Started"
3. Click "Sign-in method" tab
4. Click on "Email/Password"
5. Enable "Email/Password" toggle
6. Click "Save"

## Step 3: Create Firestore Database

1. In Firebase Console, click "Firestore Database" in left sidebar
2. Click "Create database"
3. Start in "Test mode" (for now - you'll configure security rules later)
4. Choose a location closest to your users
5. Click "Enable"

## Step 4: Get Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps" section
4. Click the "</>" (web) icon to add a web app
5. Register app (give it a nickname like "AI Chat Web")
6. Copy the `firebaseConfig` object that looks like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## Step 5: Configure Firestore Security Rules

1. Go to Firestore Database → Rules tab
2. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Chat conversations
    match /conversations/{conversationId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
    }
    
    // Messages in conversations
    match /conversations/{conversationId}/messages/{messageId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/conversations/$(conversationId)).data.userId == request.auth.uid;
    }
  }
}
```

3. Click "Publish"

## Step 6: Update Your HTML File

Replace the Firebase config in `Roastify.html` with your actual config values.

## Firestore Database Structure

```
users/
  {userId}/
    email: string
    createdAt: timestamp
    lastActive: timestamp

conversations/
  {conversationId}/
    userId: string
    model: string
    title: string (first message or auto-generated)
    createdAt: timestamp
    updatedAt: timestamp
    messages/
      {messageId}/
        role: string ("user" | "assistant" | "system")
        content: string
        modelName: string (for AI messages)
        timestamp: timestamp
```

## Next Steps After Setup

1. Replace Firebase config in `Roastify.html` with your values
2. Start your server: `npm start`
3. Open `Roastify.html` in browser
4. Create an account and start chatting!
