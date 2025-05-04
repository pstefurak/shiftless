/*
  # Onboarding Schema Update

  1. New Tables
    - `business_hours`
      - `id` (uuid, primary key)
      - `restaurant_id` (uuid, foreign key to restaurant_profiles)
      - `day_of_week` (integer, 0-6 representing days of the week)
      - `open_time` (time)
      - `close_time` (time)
      - `is_closed` (boolean)
      - `created_at` (timestamp with time zone)
    
    - `bot_preferences`
      - `id` (uuid, primary key)
      - `restaurant_id` (uuid, foreign key to restaurant_profiles)
      - `language` (text)
      - `greeting_message` (text)
      - `auto_sms_enabled` (boolean)
      - `created_at` (timestamp with time zone)
  
  2. Security
    - Enable RLS on both tables
    - Add policies to allow authenticated users to manage their own data
*/

-- Business Hours Table
CREATE TABLE IF NOT EXISTS business_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurant_profiles(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  open_time time,
  close_time time,
  is_closed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE business_hours ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own business hours"
  ON business_hours
  FOR INSERT
  TO authenticated
  WITH CHECK (restaurant_id IN (
    SELECT id FROM restaurant_profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Users can update their own business hours"
  ON business_hours
  FOR UPDATE
  TO authenticated
  USING (restaurant_id IN (
    SELECT id FROM restaurant_profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Users can view their own business hours"
  ON business_hours
  FOR SELECT
  TO authenticated
  USING (restaurant_id IN (
    SELECT id FROM restaurant_profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Users can delete their own business hours"
  ON business_hours
  FOR DELETE
  TO authenticated
  USING (restaurant_id IN (
    SELECT id FROM restaurant_profiles WHERE id = auth.uid()
  ));

-- Bot Preferences Table
CREATE TABLE IF NOT EXISTS bot_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurant_profiles(id) ON DELETE CASCADE UNIQUE,
  language text DEFAULT 'en' NOT NULL,
  greeting_message text,
  auto_sms_enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bot_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own bot preferences"
  ON bot_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (restaurant_id IN (
    SELECT id FROM restaurant_profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Users can update their own bot preferences"
  ON bot_preferences
  FOR UPDATE
  TO authenticated
  USING (restaurant_id IN (
    SELECT id FROM restaurant_profiles WHERE id = auth.uid()
  ));

CREATE POLICY "Users can view their own bot preferences"
  ON bot_preferences
  FOR SELECT
  TO authenticated
  USING (restaurant_id IN (
    SELECT id FROM restaurant_profiles WHERE id = auth.uid()
  ));

-- Add a new onboarding_step column to restaurant_profiles to track progress
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'restaurant_profiles' AND column_name = 'onboarding_step'
  ) THEN
    ALTER TABLE restaurant_profiles ADD COLUMN onboarding_step integer DEFAULT 1;
  END IF;
END $$;