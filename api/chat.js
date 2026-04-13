import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  try {
  const { messages, systemPrompt } = req.body;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    system: systemPrompt,
    messages: messages,
  });

  res.status(200).json({ content: response.content[0].text });
} catch (error) {
  console.error('Anthropic API Error:', error);
  
  // If Anthropic is overloaded, return a friendly error
  if (error.status === 529) {
    return res.status(503).json({ 
      error: 'Our AI is experiencing high demand right now. Please try again in a moment.' 
    });
  }
  
  res.status(500).json({ 
    error: 'Failed to get response from Claude', 
    details: error.message 
  });
}
}