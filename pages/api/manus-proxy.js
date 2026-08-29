export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { endpoint, method = 'POST', body } = req.body;

  // Validate endpoint to prevent abuse
  if (!endpoint || !endpoint.startsWith('/v2/')) {
    return res.status(400).json({ error: 'Invalid endpoint' });
  }

  const MANUS_API_KEY = process.env.MANUS_API_KEY;
  if (!MANUS_API_KEY) {
    return res.status(500).json({ error: 'MANUS_API_KEY not configured' });
  }

  const url = `https://api.manus.ai${endpoint}`;

  try {
    const fetchOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-manus-api-key': MANUS_API_KEY
      }
    };

    if (body) {
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, fetchOptions);
    const data = await response.json();

    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: error.message });
  }
}
