# AI Chat Application

A multi-AI chat interface with a secure backend. The API keys are stored safely on the server, not exposed in the frontend.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
OPENROUTER_API_KEY=your-api-key-here
PORT=3000
```

Replace `your-api-key-here` with your actual OpenRouter API key.

**Get your API key from:** https://openrouter.ai/keys

### 3. Start the Server

```bash
npm start
```

The server will run on `http://localhost:3000`

### 4. Open the Application

Open your browser and go to:
```
http://localhost:3000/Roastify.html
```

Or if you have the HTML file open directly, make sure the backend is running!

## Features

- 🔒 **Secure**: API keys are stored on the backend, never exposed to clients
- 🤖 **Multi-AI Support**: Switch between different AI models
- 💬 **Continuous Chat**: Maintains conversation history per model
- 🎨 **Modern UI**: Clean, dark-themed interface

## Available AI Models

- Gemini 2.5 Flash
- GPT-4o
- Claude 3.5 Sonnet
- Gemini Pro
- Llama 3.1

## Project Structure

```
├── server.js          # Backend server (handles API requests)
├── package.json       # Node.js dependencies
├── .env              # Environment variables (API keys) - NOT in git
├── .gitignore        # Git ignore file
├── Roastify.html     # Frontend chat interface
└── README.md         # This file
```

## Security Notes

- ✅ API keys are stored in `.env` file (never commit this to git)
- ✅ Frontend makes requests to your backend, not directly to OpenRouter
- ✅ Backend validates requests before forwarding to OpenRouter
- ❌ Never commit `.env` file to version control

## Troubleshooting

**Server won't start:**
- Make sure Node.js is installed: `node --version`
- Install dependencies: `npm install`
- Check if port 3000 is already in use

**API errors:**
- Verify your API key in `.env` file is correct
- Check that the server is running
- Look at server console for error messages
