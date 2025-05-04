/*
  # Update bot preferences table

  1. Changes
    - Add busy_message field to bot_preferences table
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bot_preferences' AND column_name = 'busy_message'
  ) THEN
    ALTER TABLE bot_preferences ADD COLUMN busy_message text DEFAULT 'We are currently busy, please call again later.';
  END IF;
END $$;