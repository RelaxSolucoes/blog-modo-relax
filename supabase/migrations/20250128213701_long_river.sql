/*
  # Create subscribers table

  1. New Tables
    - `subscribers`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `created_at` (timestamp)
      - `status` (text) - For tracking subscription status (active/unsubscribed)
  
  2. Security
    - Enable RLS on `subscribers` table
    - Add policy for public insert access
    - Add policy for authenticated users to manage subscriptions
*/

CREATE TABLE subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to subscribe
CREATE POLICY "Enable insert access for all users" ON subscribers
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow authenticated users to manage subscriptions
CREATE POLICY "Enable update for users based on email" ON subscribers
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);