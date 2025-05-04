/*
  # Create Restaurant Profiles Table and Menu Items

  1. New Tables
    - `restaurant_profiles`
      - `id` (uuid, primary key)
      - `restaurant_name` (text)
      - `phone_number` (text)
      - `address` (text)
      - `has_completed_onboarding` (boolean)
      - `subscription_status` (text)
      - `trial_ends_at` (timestamp)
      - `created_at` (timestamp)
    - `menu_items`
      - `id` (uuid, primary key)
      - `restaurant_id` (uuid, foreign key)
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `preparation_time` (integer)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `restaurant_profiles` table
    - Enable RLS on `menu_items` table
    - Add policy for authenticated users to read and write their own data
*/

-- Create restaurant_profiles table
CREATE TABLE IF NOT EXISTS restaurant_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  restaurant_name TEXT,
  phone_number TEXT,
  address TEXT,
  has_completed_onboarding BOOLEAN DEFAULT FALSE,
  subscription_status TEXT DEFAULT 'trial',
  trial_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on restaurant_profiles
ALTER TABLE restaurant_profiles ENABLE ROW LEVEL SECURITY;

-- Restaurant profiles security policies
CREATE POLICY "Users can view their own restaurant profile"
  ON restaurant_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own restaurant profile"
  ON restaurant_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own restaurant profile"
  ON restaurant_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurant_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  preparation_time INTEGER DEFAULT 15,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on menu_items
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Menu items security policies
CREATE POLICY "Users can view their own menu items"
  ON menu_items
  FOR SELECT
  TO authenticated
  USING (auth.uid() = restaurant_id);

CREATE POLICY "Users can insert their own menu items"
  ON menu_items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = restaurant_id);

CREATE POLICY "Users can update their own menu items"
  ON menu_items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = restaurant_id);

CREATE POLICY "Users can delete their own menu items"
  ON menu_items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = restaurant_id);