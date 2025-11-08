# How Conversations Are Stored in Firestore

## ✅ **NOT Email-Based - It's UID-Based!**

Your conversations are **NOT stored by email**. They are stored by **Firebase Auth UID** (User ID).

## 🔑 Key Concept: Firebase Auth UID

When a user signs up/login, Firebase Authentication assigns them a **unique UID** (User ID), which looks like:
```
abc123def456ghi789jkl012mno345pqr678
```

This UID is:
- ✅ **Unique** for each user account
- ✅ **Permanent** - never changes for that account
- ✅ **Independent of email** - same email with different passwords = different UID

## 📊 How It Works

### When You Create a Conversation:

```javascript
// Line 1030-1036 in Roastify.html
await addDoc(conversationsRef, {
  userId: currentUser.uid,  // ← Stored by UID, not email!
  model: currentModel,
  title: 'New Conversation',
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
});
```

### When You Load Conversations:

```javascript
// Line 1064-1068 in Roastify.html
const q = query(
  conversationsRef,
  where('userId', '==', currentUser.uid),  // ← Filters by UID, not email!
  orderBy('updatedAt', 'desc')
);
```

## 🗂️ Firestore Database Structure

```
conversations/
  ├── abc123... (conversationId 1)
  │   ├── userId: "xyz789..." ← User Account A's UID
  │   ├── title: "Hello"
  │   ├── model: "gpt-4o"
  │   ├── createdAt: timestamp
  │   ├── updatedAt: timestamp
  │   └── messages/
  │       ├── msg1...
  │       └── msg2...
  │
  ├── def456... (conversationId 2)
  │   ├── userId: "xyz789..." ← User Account A's UID (same user)
  │   ├── title: "Python help"
  │   └── ...
  │
  └── ghi789... (conversationId 3)
      ├── userId: "uvw123..." ← User Account B's UID (different user)
      ├── title: "JavaScript"
      └── ...
```

## 🔐 What Happens When You Switch Accounts

### Scenario: You Log Out and Sign In with Different Account

**Account 1:**
- Email: `user1@example.com`
- UID: `abc123def456...`
- Conversations: Shows only conversations where `userId == "abc123def456..."`

**Account 2:**
- Email: `user2@example.com`  
- UID: `xyz789uvw012...`
- Conversations: Shows only conversations where `userId == "xyz789uvw012..."`

### Why This Works:

1. **Each account has a unique UID**
   - Account 1 → UID: `abc123...`
   - Account 2 → UID: `xyz789...`

2. **Conversations are linked to UID**
   - Conversation 1 → `userId: "abc123..."` (Account 1)
   - Conversation 2 → `userId: "xyz789..."` (Account 2)

3. **Security Rules Filter by UID**
   ```javascript
   // Users can only access their own conversations
   match /conversations/{conversationId} {
     allow read, write: if request.auth != null && 
       resource.data.userId == request.auth.uid;
   }
   ```
   - Account 1 can ONLY see conversations where `userId == Account 1's UID`
   - Account 2 can ONLY see conversations where `userId == Account 2's UID`

## 📋 Complete Example

### User Account 1
- **Email:** `alice@example.com`
- **Firebase UID:** `user123abc`
- **Conversations:**
  - Conversation A (userId: `user123abc`)
  - Conversation B (userId: `user123abc`)

### User Account 2
- **Email:** `bob@example.com`
- **Firebase UID:** `user456def`
- **Conversations:**
  - Conversation C (userId: `user456def`)
  - Conversation D (userId: `user456def`)

**When Alice logs in:**
- ✅ Sees: Conversation A, Conversation B
- ❌ Does NOT see: Conversation C, Conversation D

**When Bob logs in:**
- ✅ Sees: Conversation C, Conversation D
- ❌ Does NOT see: Conversation A, Conversation B

## 🔍 How to Verify in Firebase Console

1. Go to **Firestore Database** in Firebase Console
2. Open `conversations` collection
3. Click on any conversation document
4. You'll see:
   ```
   userId: "abc123def456..."  ← This is the UID
   email: (not stored here!)
   ```

## ⚠️ Important Notes

### ✅ Do:
- ✅ Conversations are **user-specific** (tied to UID)
- ✅ **Different accounts = Different conversations**
- ✅ **Same email, different password = Different account = Different conversations**
- ✅ **Security rules ensure isolation**

### ❌ Don't:
- ❌ Conversations are **NOT stored by email**
- ❌ **Email is just for login** - it doesn't identify conversations
- ❌ **Two accounts with same email = two different UIDs = separate conversations**

## 🎯 Summary

**Conversations are stored by Firebase Auth UID, not email.**

- Each user account gets a unique UID
- All conversations are tagged with `userId` (the UID)
- When you query, it filters: `where('userId', '==', currentUser.uid)`
- Security rules also check: `resource.data.userId == request.auth.uid`

This means:
- ✅ Each user only sees their own conversations
- ✅ Logging in with a different account shows different conversations
- ✅ Data is properly isolated and secure
