import Anthropic from '@anthropic-ai/sdk';
import { supabase } from './lib/supabase.js';

const TIER_CONFIG = {
  free:     { messageLimit: 3,    weeklyReset: false, allowedMentors: ['carnegie'] },
  weekly:   { messageLimit: 30,   weeklyReset: true,  allowedMentors: ['carnegie', 'marcus', 'napoleon'] },
  monthly:  { messageLimit: null, weeklyReset: false, allowedMentors: null },
  lifetime: { messageLimit: null, weeklyReset: false, allowedMentors: null },
};

export default async function handler(req, res) {
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

  const { messages, systemPrompt, email, mentorId } = req.body;

  if (email) {
    let { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code === 'PGRST116') {
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          email,
          tier: 'free',
          message_count: 0,
          message_count_reset_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) {
        console.error('Supabase insert error:', insertError);
        return res.status(500).json({ error: 'Failed to create user' });
      }
      user = newUser;
    } else if (error) {
      console.error('Supabase select error:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    const tier = user.tier;
    const config = TIER_CONFIG[tier] || TIER_CONFIG.free;

    // Reset weekly count if more than 7 days have passed
    if (config.weeklyReset && user.message_count_reset_at) {
      const daysSinceReset = (Date.now() - new Date(user.message_count_reset_at).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceReset > 7) {
        await supabase
          .from('users')
          .update({ message_count: 0, message_count_reset_at: new Date().toISOString() })
          .eq('email', email);
        user.message_count = 0;
      }
    }

    if (config.messageLimit !== null && user.message_count >= config.messageLimit) {
      return res.status(403).json({ error: 'limit_reached', tier });
    }

    if (mentorId && config.allowedMentors !== null && !config.allowedMentors.includes(mentorId)) {
      return res.status(403).json({ error: 'mentor_locked', tier });
    }

    await supabase.from('message_logs').insert({ email, mentor_id: mentorId || null, tier });

    await supabase
      .from('users')
      .update({ message_count: user.message_count + 1 })
      .eq('email', email);
  }

  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  try {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      system: systemPrompt,
      messages: messages,
    });

    res.status(200).json({ content: response.content[0].text });
  } catch (error) {
    console.error('Anthropic API Error:', error);

    if (error.status === 529) {
      return res.status(503).json({
        error: 'Our AI is experiencing high demand right now. Please try again in a moment.',
      });
    }

    res.status(500).json({
      error: 'Failed to get response from Claude',
      details: error.message,
    });
  }
}
