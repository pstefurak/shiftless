/*
  # Initial database setup for Shiftless

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, reference to auth.users)
      - `name` (text, nullable)
      - `avatar_url` (text, nullable)
      - `created_at` (timestamp with timezone)
    - `orders`
      - `id` (uuid, primary key)
      - `created_at` (timestamp with timezone)
      - `phone_number` (text, not null)
      - `item` (text, not null)
      - `quantity` (integer, not null)
      - `ready_in_minutes` (integer, nullable)
      - `status` (text, not null)
      - `notified_at` (timestamp with timezone, nullable)
      - `user_id` (uuid, nullable, reference to auth.users)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create profiles table that references auth.users
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  phone_number TEXT NOT NULL,
  item TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  ready_in_minutes INTEGER,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'preparing', 'ready', 'completed')),
  notified_at TIMESTAMPTZ,
  user_id UUID REFERENCES auth.users ON DELETE SET NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create policies for orders
CREATE POLICY "Authenticated users can view all orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert new orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update any order"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (true);

-- Add function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();