import { createClient } from '@supabase/supabase-js';

export default async function handler(req: any, res: any) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password, firstName, lastName } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  // Use service role key (only on server)
  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: 'employee',
        name: `${firstName} ${lastName}`
      }
    });

    if (error) throw error;

    return res.status(200).json({ success: true, user: data.user });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
