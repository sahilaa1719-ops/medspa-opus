# Supabase Integration Setup Guide

## Step 1: Run Database Schema

1. Open your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: `tjrophtadiovtimgobsf`
3. Go to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire contents of `supabase-schema.sql` and paste it into the editor
6. Click **Run** to execute the SQL

This will create all the necessary tables:
- `users` - User authentication profiles
- `employees` - Employee records
- `locations` - Office/spa locations
- `licenses` - Professional licenses
- `documents` - Employee documents
- `pay_stubs` - Payroll pay stubs
- `time_entries` - Time tracking
- `tax_documents` - W-2 and 1099 forms
- `payroll_reports` - Generated reports
- `scheduled_reports` - Automated report schedules

## Step 2: Verify Sample Users

The SQL schema automatically creates three sample users in the `users` table:

- **Admin User:** `admin@medspa.com` / `admin123`
- **Payroll Manager:** `payroll@medspa.com` / `payroll123`
- **Employee User:** `employee@medspa.com` / `employee123`

No additional setup needed! The app uses simple table-based authentication (querying the `users` table directly) rather than Supabase Auth. This is perfect for a demo/MVP.

## Step 3: Load Sample Data (Optional)

If you want to start with sample employees, licenses, documents, and payroll data:

1. Go back to **SQL Editor** in Supabase
2. Click **New Query**
3. Copy the entire contents of `sample-data.sql` and paste it
4. Click **Run** to execute

This will add:
- 5 sample employees (Sarah, Michael, Emily, David, Amanda)
- 4 professional licenses
- 5 employee documents
- 5 pay stubs for the current period
- Sample time entries (some pending, some approved)
- 3 W-2 forms for 2023

## Step 4: Verify Setup

1. Go to **Table Editor** in Supabase
2. Check that all tables were created successfully
3. Verify the `users` table has 3 rows (admin, payroll, employee)
4. Verify the `locations` table has 1 row (Main Spa)
5. If you loaded sample data, verify:
   - `employees` table has 5 rows
   - `licenses` table has 4 rows
   - `documents` table has 5 rows
   - `pay_stubs` table has 5 rows
   - `time_entries` table has 9 rows
   - `tax_documents` table has 3 rows

## Step 5: Test the Application

1. Make sure your dev server is running:
   ```powershell
   npm run dev
   ```

2. Open http://localhost:8084 in your browser

3. Test login with each user:
   - Admin: `admin@medspa.com` / `admin123`
   - Payroll: `payroll@medspa.com` / `payroll123`
   - Employee: `employee@medspa.com` / `employee123`

## What Changed in the Code

### AuthContext.tsx
- Now uses simple table queries to authenticate users
- Queries `users` table with `email` and `password_hash` fields
- Stores user session in localStorage
- No dependency on Supabase Auth - perfect for demo/MVP

### DataContext.tsx
- All CRUD operations now use Supabase queries instead of localStorage
- Real-time subscriptions update data automatically when changes occur
- `addEmployee()`, `updateEmployee()`, etc. are now async functions
- Data mapping converts snake_case DB columns to camelCase TypeScript properties

### Database Schema
- Uses UUID primary keys (auto-generated)
- Foreign key relationships with CASCADE deletes
- Row Level Security (RLS) policies for data access control
- Proper indexes for performance (handled by Supabase)

## Migration Notes

### Data Migration
Since you're starting fresh with Supabase, you won't have any existing data. If you had important data in localStorage, you would need to:
1. Export it from localStorage
2. Format it to match the database schema
3. Insert it using Supabase's Table Editor or SQL

### Real-time Updates
The app now has real-time capabilities! When one user adds/updates/deletes data, all other users will see the changes immediately without refreshing.

### File Storage
Currently, `file_url` fields store URLs as text. If you want to upload actual files (documents, licenses), you'll need to:
1. Set up Supabase Storage buckets
2. Upload files using `supabase.storage.from('bucket').upload()`
3. Store the public URL in the database

## Troubleshooting

### "Failed to fetch" errors
- Check your internet connection
- Verify the Supabase URL and anon key in `src/lib/supabase.ts`
- Check Supabase project status in dashboard

### "Row Level Security" errors
- RLS policies allow any authenticated query (using `auth.role() = 'authenticated'`)
- Since we're not using Supabase Auth, you may need to adjust policies
- For demo/MVP, you can disable RLS on tables if needed

### Login fails
- Verify the `users` table has rows with correct email and password_hash
- Check browser console for error messages
- Passwords are stored in plain text (for demo only - hash in production!)

### Data not showing up
- Open browser DevTools > Network tab
- Check for failed Supabase requests
- Look at Console tab for error messages
- Verify tables have the correct schema

## Next Steps

1. **Add more sample data** - Use Table Editor to add employees, licenses, documents
2. **Customize RLS policies** - Make them more restrictive based on user roles
3. **Set up file storage** - For document and license file uploads
4. **Add data validation** - Server-side validation rules
5. **Implement audit logs** - Track who changed what and when

## Security Notes

⚠️ **Important for Demo/MVP**:
- Passwords are stored in plain text in the `users` table - **DO NOT use in production!**
- In production, use proper password hashing (bcrypt, argon2, etc.)
- Consider migrating to Supabase Auth for production (built-in security features)
- The anon key in `supabase.ts` is safe to expose in client-side code
- Use environment variables for sensitive keys in production
- Current RLS policies are permissive - tighten them for production

## Support

If you encounter issues:
1. Check Supabase logs in Dashboard > Logs
2. Check browser console for errors
3. Review Supabase documentation: https://supabase.com/docs
