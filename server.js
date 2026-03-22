const path = require('path');
const express = require('express');
const cors = require('cors');
// Load .env from this folder (AgriTech) and from parent (EPICS) so GEMINI_API_KEY in EPICS/.env is found
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3000;

const API_KEY = process.env.GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

if (!API_KEY) {
  console.warn('⚠️ GEMINI_API_KEY not found. AI features will be limited. Using rule-based responses only.');
}

app.use(cors());
app.use(express.json({ limit: '12mb' }));

const ALLOWED_IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
]);

const sanitizePrompt = (value) => {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, 4000);
};

const buildSystemInstruction = ({ hasImage }) => {
  if (hasImage) {
    return (
      "You are an expert plant pathologist and agronomist for Indian farming contexts. " +
      "When the user provides an image, identify the likely crop and disease (or nutrient deficiency/pest damage), " +
      "include confidence level, reasoning from visible cues, and practical treatment steps. " +
      "Avoid unsafe pesticide dosage claims; suggest label-following and local agri extension guidance."
    );
  }
  return (
    "You are AgriTech AI Assistant for Indian farmers. Provide complete, practical, structured answers. " +
    "Cover recommendations, risks, and next steps clearly. Keep language simple but do not omit important details."
  );
};

const buildUserPrompt = ({ message, hasImage }) => {
  if (hasImage) {
    return (
      `${message || 'Analyze this plant image.'}\n\n` +
      "Return in this exact structure:\n" +
      "1) Crop Detected (or best guess)\n" +
      "2) Likely Issue(s)\n" +
      "3) Confidence (High/Medium/Low)\n" +
      "4) Why (visible symptoms)\n" +
      "5) Immediate Action (next 24-48h)\n" +
      "6) Treatment Options (organic + chemical categories)\n" +
      "7) Prevention for next cycle\n" +
      "8) When to consult local expert"
    );
  }
  return `${message}\n\nPlease provide a complete answer with actionable steps and a short summary.`;
};

app.post('/api/chat', async (req, res) => {
  const { message, image, imageMimeType } = req.body;
  const cleanMessage = sanitizePrompt(message);
  const hasImage = typeof image === 'string' && image.length > 0;

  if (!cleanMessage && !hasImage) {
    return res.status(400).json({ error: 'Message or image required' });
  }

  try {
    // If no API key, return a helpful message about using the JSON chatbot
    if (!API_KEY) {
      return res.json({
        reply: "🤖 I'm currently running in offline mode. For AI-powered responses, please configure your GEMINI_API_KEY. Meanwhile, try our rule-based chatbot at /chat for instant farming advice!"
      });
    }

    const mimeType = ALLOWED_IMAGE_MIME_TYPES.has(String(imageMimeType || '').toLowerCase())
      ? String(imageMimeType).toLowerCase()
      : 'image/jpeg';

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text:
                `${buildSystemInstruction({ hasImage })}\n\n` +
                `${buildUserPrompt({ message: cleanMessage, hasImage })}`,
            },
            ...(hasImage
              ? [{
                  inline_data: {
                    mime_type: mimeType,
                    data: image
                  }
                }]
              : [])
          ]
        }
      ],
      generationConfig: {
        temperature: 0.4,
        topP: 0.9,
        maxOutputTokens: 3072
      }
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('API Error:', errText);
      return res.status(500).json({ reply: '⚠️ AI service temporarily unavailable. Please try our rule-based chatbot for instant farming advice!' });
    }

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.map(p => p.text)?.join('') ||
      "I couldn't analyze that. Please try again.";

    res.json({ reply: reply.trim() });
  } catch (err) {
    console.error('Server Error:', err);
    res.status(500).json({ reply: '⚠️ Server error. Please try our rule-based chatbot for instant farming advice!' });
  }
});

app.use(express.static('.'));

app.listen(PORT, () => {
  console.log(`🚀 AgriTech Chatbot Server running on http://localhost:${PORT}`);
  console.log(`🤖 AI Features: ${API_KEY ? 'ENABLED' : 'DISABLED (using fallback mode)'}`);
});


