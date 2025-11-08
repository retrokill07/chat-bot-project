/*
This is the missing server.js file for your AI Chat Application.

It performs these key functions:
1.  Loads environment variables from a .env file (for your API key).
2.  Starts an Express server.
3.  Serves your Roastify.html file as the main page.
4.  Creates a secure backend endpoint at `/api/chat`.
5.  Receives chat requests from your frontend, adds the secure API key,
    and forwards the request to the OpenRouter API.
6.  Sends the AI's response back to your frontend.
*/

const express = require('express');
const cors = require('cors');
const path = require('path');
// Using built-in fetch (available in Node.js 18+)

// Load environment variables from .env file
require('dotenv').config();

const app = express();
// Use the PORT from .env, or default to 3000 (matching your .env.txt)
const PORT = process.env.PORT || 3000;

// Get the API key from environment variables
// This server will use the OPENROUTER_API_KEY from your .env file
// Make sure your .env file has OPENROUTER_API_KEY=...
const API_KEY = process.env.OPENROUTER_API_KEY;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON bodies from requests

// --- API Endpoint ---
// This is the secure endpoint your frontend will call
app.post('/api/chat', async (req, res) => {
  if (!API_KEY) {
    return res.status(500).json({ error: 'API key is not configured on the server.' });
  }

  const { model, messages } = req.body;

  console.log('Received request:', JSON.stringify({ model, messagesCount: messages?.length }, null, 2));
  console.log('Full messages array:', JSON.stringify(messages, null, 2));

  if (!model || !messages) {
    return res.status(400).json({ error: 'Missing model or messages in request body.' });
  }

  // Validate messages format
  if (!Array.isArray(messages) || messages.length === 0) {
    console.error('Invalid messages format:', messages);
    return res.status(400).json({ error: 'Messages must be a non-empty array.' });
  }

  // Validate each message has required fields
  for (let i = 0; i < messages.length; i++) {
    if (!messages[i].role || messages[i].content === undefined) {
      console.error(`Invalid message at index ${i}:`, messages[i]);
      return res.status(400).json({ error: `Message at index ${i} is missing 'role' or 'content' field.` });
    }
    // Ensure content is a string
    if (typeof messages[i].content !== 'string') {
      messages[i].content = String(messages[i].content);
    }
  }

  // Filter out system messages if the model doesn't support them
  // Some models on OpenRouter don't support system role
  let filteredMessages = messages;
  const modelsWithoutSystem = ['meta-llama/llama-3.1-8b-instruct']; // Add models that don't support system messages
  if (modelsWithoutSystem.includes(model)) {
    filteredMessages = messages.filter(msg => msg.role !== 'system');
    if (filteredMessages.length === 0) {
      return res.status(400).json({ error: 'No valid messages after filtering system messages.' });
    }
    console.log('Filtered out system messages for model:', model);
  }

  try {
    const requestBody = {
      model: model,
      messages: filteredMessages,
    };
    
    console.log('Sending to OpenRouter:', JSON.stringify(requestBody, null, 2));
    
    // Forward the request to the OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        // OpenRouter specific headers (optional, but good practice)
        'HTTP-Referer': 'http://localhost:3000', // Set to your app's URL
        'X-Title': 'AI Assistant (Roastify)', // Set to your app's name
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      // If OpenRouter returns an error, send it to the frontend
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { error: { message: `HTTP ${response.status}: ${response.statusText}` } };
      }
      console.error('OpenRouter API Error:', JSON.stringify(errorData, null, 2));
      return res.status(response.status).json({ error: errorData.error?.message || errorData.message || 'Failed to get response from AI' });
    }

    const data = await response.json();
    console.log('OpenRouter API Response Status:', response.status);
    console.log('OpenRouter API Response:', JSON.stringify(data, null, 2));

    // Check if response contains an error (even if status is 200)
    if (data.error) {
      console.error('OpenRouter API returned error in response:', data.error);
      return res.status(500).json({ error: data.error.message || data.error.code || 'Error from AI service' });
    }

    // Validate response structure
    if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      console.error('Invalid response structure - no choices:', data);
      return res.status(500).json({ error: 'Invalid response from AI service: no choices in response' });
    }

    if (!data.choices[0].message || !data.choices[0].message.content) {
      console.error('Invalid response structure - no message content:', data);
      return res.status(500).json({ error: 'Invalid response from AI service: no message content in response' });
    }

    // Check if the content itself is an error message
    const content = data.choices[0].message.content;
    if (typeof content === 'string' && (content.toLowerCase().includes('error') || content.toLowerCase().includes('user not found'))) {
      console.warn('Response content may contain error:', content);
    }

    // Send the successful AI response back to the frontend
    res.json({
      message: data.choices[0].message.content,
      modelName: data.model || model, // Send back the model name that was used
    });

  } catch (error) {
    console.error('Error in /api/chat endpoint:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: error.message || 'An internal server error occurred.' });
  }
});

// --- Static File Serving ---
// Serve the Roastify.html file as the root page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Roastify.html'));
});

// Serve any other static files (if you had a .css or .js file)
app.use(express.static(__dirname));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  if (!API_KEY) {
    console.warn('WARNING: OPENROUTER_API_KEY is not set in your .env file. The /api/chat endpoint will not work.');
  } else {
    console.log('OpenRouter API key loaded successfully.');
  }
});