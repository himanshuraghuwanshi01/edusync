import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      throw new Error('Invalid token');
    }

    // Find or create user in your `users` table
    let { data: dbUser, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('firebase_uid', user.id) // you can keep this field or rename it to supabase_uid
      .maybeSingle();

    if (!dbUser) {
      // Create new user
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([{
          firebase_uid: user.id, // or supabase_uid
          email: user.email,
          name: user.user_metadata?.full_name || user.email.split('@')[0],
        }])
        .select()
        .single();
      if (createError) throw createError;
      dbUser = newUser;
    }

    req.user = dbUser;
    req.authUser = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ error: 'Unauthorized' });
  }
}