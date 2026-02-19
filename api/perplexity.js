// Vercel Serverless Function — Perplexity AI Proxy
// The API key is read from the PERPLEXITY_API_KEY environment variable.
// Set it in your Vercel dashboard: Settings → Environment Variables

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) {
    console.error('PERPLEXITY_API_KEY is not set in environment variables.');
    return res.status(500).json({ error: 'API key not configured on server.' });
  }

  try {
    const { messages, model } = req.body;

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'sonar',
        messages: messages || [{ role: 'user', content: 'Hello' }],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Perplexity API error:', response.status, errorBody);
      return res.status(response.status).json({ error: 'Perplexity API request failed', details: errorBody });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
