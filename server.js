
const express = require('express');
const path = require('path');
const { GoogleGenAI, Type } = require('@google/genai');

const app = express();
const port = process.env.PORT || 8080;

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Middleware to parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to handle image processing
app.post('/api/generate', async (req, res) => {
  const { image, mimeType } = req.body;

  if (!image || !mimeType) {
    return res.status(400).json({ error: 'Image data and mimeType are required.' });
  }
  
  try {
    const imagePart = {
      inlineData: {
        data: image,
        mimeType,
      },
    };

    const systemInstruction = `
        You are an expert in ancient scripts. Your task is to perform Optical Character Recognition (OCR) on the provided image to extract any text.
        Then, you must transliterate the recognized text into Tamil Grantha script.
        The output must be a JSON object containing only the transliterated text.
    `;

    const schema = {
        type: Type.OBJECT,
        properties: {
          grantha_script: {
            type: Type.STRING,
            description: 'The transliterated text in Tamil Grantha script.'
          },
        },
        required: ['grantha_script']
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart] },
        config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: schema,
        },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    
    if (result && result.grantha_script) {
        res.json({ resultText: result.grantha_script });
    } else {
        res.json({ resultText: "No Grantha script could be generated." });
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ error: 'Failed to process image with Gemini API.' });
  }
});


// Fallback to serve index.html for any other requests (for SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
});
