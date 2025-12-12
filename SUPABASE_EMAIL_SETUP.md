# Supabase Email Setup Guide

## Option 1: Using Supabase Edge Functions with Resend (Recommended)

### Step 1: Set up Resend
1. Go to https://resend.com and sign up (free tier available)
2. Verify your email domain or use their test domain
3. Get your API key from the Resend dashboard

### Step 2: Create Supabase Edge Function
1. Go to your Supabase Dashboard
2. Click "Edge Functions" in the sidebar
3. Click "Create a new function"
4. Name: `send-license-reminder`
5. Paste this code:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  try {
    const { to, subject, html } = await req.json()

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
```

### Step 3: Add Resend API Key to Supabase
1. In Supabase Dashboard, go to "Project Settings" > "Edge Functions"
2. Add a secret: `RESEND_API_KEY` = your Resend API key
3. Deploy the function

### Step 4: Enable the Function in Supabase
1. Go to "Edge Functions"
2. Find `send-license-reminder`
3. Click "Deploy"

---

## Option 2: Direct API Call (Simpler, No Edge Function)

If you don't want to use Edge Functions, update the code to call Resend API directly from the frontend:

```typescript
// In licenseReminderService.ts
const RESEND_API_KEY = 'YOUR_RESEND_API_KEY'; // Replace with your key

const res = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${RESEND_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: 'MedSpa Opus <noreply@yourdomain.com>',
    to: [employeeEmail],
    subject: subject,
    html: emailHTML,
  }),
});
```

**Note:** This exposes your API key in the frontend code. Only use this for development/testing.

---

## Testing

Once set up, the system will:
- ✅ Check licenses when admin logs into dashboard
- ✅ Send reminder emails at 30 days, 7 days, and after expiry
- ✅ Track sent reminders to avoid duplicates
- ✅ Show toast notification when reminders are sent

Check the browser console for email sending logs!
