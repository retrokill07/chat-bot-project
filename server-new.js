const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// API endpoint to chat with AI
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const apiKey = process.env.PPLX_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Format messages for Perplexity API
    console.log('Received messages:', JSON.stringify(messages, null, 2));

    // Always format as a basic question-answer exchange
    const formattedMessages = [{
      role: 'user',
      content: messages[0].content
    }];

    console.log('Sending request with messages:', JSON.stringify(formattedMessages, null, 2));
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'pplx-7b-online',  // Using the correct model name
        messages: formattedMessages
      })
    });

    if (!response.ok) {
      console.error('API Response not OK:', response.status, response.statusText);
      const errorData = await response.text();
      console.error('Error response:', errorData);
      return res.status(500).json({ error: `AI service error: ${response.statusText}` });
    }

    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));
    
    if (data.error) {
      console.error('API Error:', data.error);
      return res.status(500).json({ error: `AI service error: ${data.error.message || 'Unknown error'}` });
    }

    // Send response back to client
    res.json({
      message: data.choices[0].message.content,
      modelName: 'Perplexity'
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});