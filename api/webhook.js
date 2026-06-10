import Stripe from 'stripe';
import { supabase } from './lib/supabase.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = { api: { bodyParser: false } };

const PRICE_TO_TIER = {
  price_1TM2hnAis1rAntIhstKTtpHk: 'weekly',
  price_1TM2nSAis1rAntIhrzVU3kBi: 'monthly',
  price_1TM2nrAis1rAntIhgHWzLP6j: 'lifetime',
};

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const rawBody = await getRawBody(req);
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET_2);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = await stripe.checkout.sessions.retrieve(event.data.object.id, {
      expand: ['line_items'],
    });

    const email = session.customer_details?.email;
    const priceId = session.line_items?.data?.[0]?.price?.id;
    const tier = PRICE_TO_TIER[priceId];

    if (!email || !tier) {
      console.error('Missing email or unrecognised price ID:', { email, priceId });
      return res.status(200).json({ received: true });
    }

    const { error } = await supabase.from('users').upsert(
      {
        email,
        tier,
        stripe_customer_id: session.customer,
        message_count: 0,
        message_count_reset_at: new Date().toISOString(),
      },
      { onConflict: 'email' }
    );

    if (error) {
      console.error('Supabase upsert error:', error);
      return res.status(500).json({ error: 'Database error' });
    }
  }

  return res.status(200).json({ received: true });
}
