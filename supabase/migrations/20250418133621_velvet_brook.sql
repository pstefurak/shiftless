-- Add phone_number_pending to restaurant_profiles
ALTER TABLE restaurant_profiles
ADD COLUMN IF NOT EXISTS phone_number_pending BOOLEAN DEFAULT false;

-- Add is_busy_mode to bot_preferences
ALTER TABLE bot_preferences
ADD COLUMN IF NOT EXISTS is_busy_mode BOOLEAN DEFAULT false;

-- Update comment to describe the fields
COMMENT ON COLUMN restaurant_profiles.phone_number_pending IS 'Indicates if the restaurant has requested a new dedicated phone number';
COMMENT ON COLUMN bot_preferences.is_busy_mode IS 'When enabled, the restaurant is not accepting phone orders';