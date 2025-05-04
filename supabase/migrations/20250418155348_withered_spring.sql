/*
  # Enable RLS and add insert policy for profiles table

  1. Changes
    - Enable Row Level Security on profiles table
    - Add policy to allow users to insert their own profile
*/

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Add policy for profile insertion
CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (id = auth.uid());