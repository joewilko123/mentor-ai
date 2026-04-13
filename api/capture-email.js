export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, firstName, source, userGroup, trialQuestion, answers } = req.body;

    const response = await fetch('https://app.loops.so/api/v1/contacts/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer 5a7b5af7beaddab5e6949a0142ccfb0a`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        firstName,
        source,
        userGroup,
        trialQuestion,
        ...answers // Spread all the qualification answers
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to capture email');
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Loops error:', error);
    res.status(500).json({ error: error.message });
  }
}