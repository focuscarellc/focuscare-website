// This is a script to set up your Supabase database
// You can run this script using Node.js

/*
HOW TO USE THIS SCRIPT:
1. Make sure you have the Supabase CLI installed
2. Log in to your Supabase account using the CLI
3. Run this script with your project ref: node scripts/setup-database.js your-project-ref
*/

const { execSync } = require('child_process');
const fs = require('fs');

// Create SQL file for the table
const sql = `
-- Create the contact_submissions table if it doesn't exist
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  organization TEXT,
  service TEXT DEFAULT 'all',
  message TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  is_read BOOLEAN DEFAULT false
);

-- Create an index on email for faster lookups (optional)
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);

-- Set up Row Level Security (RLS)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to insert submissions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'contact_submissions' AND policyname = 'Anyone can submit contact form'
  ) THEN
    CREATE POLICY "Anyone can submit contact form" 
      ON contact_submissions 
      FOR INSERT 
      TO anon, authenticated
      WITH CHECK (true);
  END IF;
END
$$;

-- Create a policy that only allows admin users to view submissions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'contact_submissions' AND policyname = 'Admins can view contact submissions'
  ) THEN
    CREATE POLICY "Admins can view contact submissions" 
      ON contact_submissions 
      FOR SELECT 
      USING (auth.uid() IN (
        SELECT user_id FROM auth.users WHERE raw_user_meta_data->>'is_admin' = 'true'
      ));
  END IF;
END
$$;

-- Print completion message
SELECT 'Contact submissions table setup complete!' AS message;
`;

// Write the SQL to a file
fs.writeFileSync('contact_table_setup.sql', sql);
console.log('Created SQL file: contact_table_setup.sql');

// Instructions for manually running the SQL
console.log(`
✅ SQL file created! To set up your database:

Option 1: Using the Supabase Web Interface:
1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Create a "New query"
4. Copy and paste the contents of the contact_table_setup.sql file
5. Click "Run" to execute the SQL

Option 2: Using the Supabase CLI:
1. Make sure you have the Supabase CLI installed
2. Run: supabase db push -f contact_table_setup.sql

After running the SQL, your 'contact_submissions' table will be created and configured.
`); 