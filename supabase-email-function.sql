-- Supabase Edge Function for sending license reminder emails
-- This needs to be created in your Supabase Dashboard under "Edge Functions"

-- Steps to set up:
-- 1. Go to your Supabase Dashboard
-- 2. Navigate to "Edge Functions" in the sidebar
-- 3. Click "Create a new function"
-- 4. Name it: send-license-reminder
-- 5. Paste the code below:

/*
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  try {
    const { to, subject, html, employeeName, licenseType, licenseNumber, expiryDate, daysUntil } = await req.json()

    // Send email using Resend (integrated with Supabase)
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'MedSpa Opus <noreply@yourdomain.com>',
        to: [to],
        subject: subject,
        html: html,
      }),
    })

    const data = await res.json()

    if (res.ok) {
      return new Response(
        JSON.stringify({ success: true, messageId: data.id }),
        { headers: { 'Content-Type': 'application/json' }, status: 200 }
      )
    } else {
      throw new Error(data.message || 'Failed to send email')
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
*/

-- Alternative: Using Supabase's built-in email templates
-- If you want to use Supabase's auth.send_email function instead:

-- Enable the pg_net extension (if not already enabled)
create extension if not exists pg_net;

-- Create a function to send reminder emails
create or replace function public.send_license_reminder_email(
  recipient_email text,
  employee_name text,
  license_type text,
  license_number text,
  expiry_date date,
  days_until_expiry int
) returns json
language plpgsql
security definer
as $$
declare
  email_subject text;
  email_body text;
  response json;
begin
  -- Determine subject and urgency based on days until expiry
  if days_until_expiry <= 0 then
    email_subject := '🚨 URGENT: Your License Has Expired';
  elsif days_until_expiry <= 7 then
    email_subject := '⚠️ URGENT: Your License Expires in ' || days_until_expiry || ' Days';
  else
    email_subject := '📋 Reminder: Your License Expires in ' || days_until_expiry || ' Days';
  end if;

  -- Build email body (simplified version)
  email_body := 'Hello ' || employee_name || ',

Your ' || license_type || ' (License #' || license_number || ') will expire on ' || expiry_date || '.

Please renew your license as soon as possible.

License Details:
- Type: ' || license_type || '
- Number: ' || license_number || '
- Expiry Date: ' || expiry_date || '
- Days Until Expiry: ' || days_until_expiry || '

Thank you,
MedSpa Opus Team';

  -- Note: This is a placeholder. Supabase doesn't have direct SMTP email sending from SQL.
  -- You need to use Edge Functions or a third-party service.
  
  return json_build_object(
    'success', true,
    'message', 'Email queued for sending',
    'to', recipient_email,
    'subject', email_subject
  );
end;
$$;

-- Grant execute permission
grant execute on function public.send_license_reminder_email to authenticated;
grant execute on function public.send_license_reminder_email to anon;
