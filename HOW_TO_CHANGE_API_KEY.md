# How to Change Your API Key

## Current Setup

Your API key is stored in a **`.env`** file (not in the code). This is the secure way to handle API keys.

## Steps to Change API Key

### Method 1: Edit Existing .env File

1. **Locate the `.env` file** in your project root (same folder as `server.js`)

2. **Open the `.env` file** in any text editor

3. **Update the API key:**
   ```env
   OPENROUTER_API_KEY=your-new-api-key-here
   PORT=3000
   ```

4. **Save the file**

5. **Restart your server:**
   - Stop the server (Ctrl+C in terminal)
   - Start it again: `npm start`

### Method 2: Create .env File (If It Doesn't Exist)

If you don't have a `.env` file yet:

1. **Create a new file** named `.env` in your project root

2. **Add this content:**
   ```env
   OPENROUTER_API_KEY=your-new-api-key-here
   PORT=3000
   ```

3. **Replace `your-new-api-key-here`** with your actual OpenRouter API key

4. **Save the file**

5. **Start your server:**
   ```bash
   npm start
   ```

## Important Notes

### ✅ Do's:
- ✅ Store API key in `.env` file (this is secure)
- ✅ Restart server after changing the key
- ✅ Keep `.env` file private (never commit to git)
- ✅ Use a different key for development and production

### ❌ Don'ts:
- ❌ Don't put API key directly in `server.js` code
- ❌ Don't commit `.env` file to version control (git)
- ❌ Don't share your `.env` file with others
- ❌ Don't forget to restart server after changing

## Verify It's Working

After changing the API key and restarting:

1. **Check server console** - Should show "Server running..."
2. **Try sending a message** in the chat
3. **If there are errors**, check:
   - API key is correct in `.env` file
   - Server was restarted after change
   - No extra spaces in the API key

## Example .env File Structure

```env
# OpenRouter API Key
OPENROUTER_API_KEY=sk-or-v1-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz

# Server Port (optional, defaults to 3000)
PORT=3000
```

## Get a New API Key

If you need a new OpenRouter API key:
1. Go to: https://openrouter.ai/keys
2. Sign in to your account
3. Create a new key or copy existing one
4. Update your `.env` file with the new key

## Quick Checklist

- [ ] Updated `.env` file with new API key
- [ ] Saved the `.env` file
- [ ] Stopped the server (if running)
- [ ] Restarted the server (`npm start`)
- [ ] Tested sending a message
- [ ] Verified it's working

That's it! The API key change will take effect immediately after restarting the server.
