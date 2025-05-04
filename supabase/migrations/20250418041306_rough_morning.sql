/*
  # Add Phone Integration Fields

  1. New Columns
    - `phone_number_pending` (boolean, default false) in restaurant_profiles table
    - `is_busy_mode` (boolean, default false) in bot_preferences table

  2. Purpose
    - `phone_number_pending`: Flag to indicate if a restaurant has requested a new dedicated phone number
    - `is_busy_mode`: Toggle to enable/disable automatic phone order acceptance

  3. Changes
    - Updates the existing tables to add support for Vapi phone integration
    - Ensures backward compatibility with existing data
*/

-- Add phone_number_pending to restaurant_profiles
ALTER TABLE restaurant_profiles
ADD COLUMN IF NOT EXISTS phone_number_pending BOOLEAN DEFAULT false;

-- Add is_busy_mode to bot_preferences
ALTER TABLE bot_preferences
ADD COLUMN IF NOT EXISTS is_busy_mode BOOLEAN DEFAULT false;

-- Update comment to describe the fields
COMMENT ON COLUMN restaurant_profiles.phone_number_pending IS 'Indicates if the restaurant has requested a new dedicated phone number';
COMMENT ON COLUMN bot_preferences.is_busy_mode IS 'When enabled, the restaurant is not accepting phone orders';