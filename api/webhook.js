import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICE_TIER_MAP = {
  'price_1TM2hnAis1rAntIhstKTtpHk': 'weekly',
  'price_1TM2nSAis1rAntIhrzVU3kBi': 'monthly',
  'price_1TM2nrAis1rAntIhgHWzLP6j': 'lifetime',
};

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const rawBody = await getRawBody(req);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type !== 'checkout.session.completed') {
    return res.status(200).json({ received: true });
  }

  const session = await stripe.checkout.sessions.retrieve(event.data.object.id, {
    expand: ['line_items'],
  });

  const email = session.customer_email || session.customer_details?.email;
  const priceId = session.line_items?.data?.[0]?.price?.id;
  const tier = PRICE_TIER_MAP[priceId] || 'monthly';

  if (!email) {
    console.error('No email found in session:', session.id);
    return res.status(200).json({ received: true });
  }

  // Upsert user in Supabase via REST API
  try {
    const supabaseRes = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/users?on_conflict=email`,
      {
        method: 'POST',
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates,return=minimal',
        },
        body: JSON.stringify({ email, tier }),
      }
    );

    if (!supabaseRes.ok) {
      const text = await supabaseRes.text();
      console.error('Supabase upsert failed:', text);
    }
  } catch (err) {
    console.error('Supabase upsert error:', err);
  }

  // Update Loops contact with purchased tier
  try {
    const loopsRes = await fetch('https://app.loops.so/api/v1/contacts/update', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${process.env.LOOPS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, tier }),
    });

    if (!loopsRes.ok) {
      const text = await loopsRes.text();
      console.error('Loops update failed:', text);
    }
  } catch (err) {
    console.error('Loops update error:', err);
  }

  return res.status(200).json({ received: true });
}
