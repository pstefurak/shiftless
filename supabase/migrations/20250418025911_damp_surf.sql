/*
  # Add Trial Status Checker Function

  1. New Functions
    - `check_trial_expirations()` - A PostgreSQL function that finds expired trials and updates their status
    - Function will be triggered by a scheduled cron job (can be set up in Supabase dashboard)

  2. Updates
    - Adds a trigger to automatically run this function daily
*/

-- Function to check for expired trials and update their status
CREATE OR REPLACE FUNCTION check_trial_expirations()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update status for expired trials
  UPDATE restaurant_profiles
  SET subscription_status = 'expired'
  WHERE 
    subscription_status = 'trial' 
    AND trial_ends_at < NOW() 
    AND trial_ends_at IS NOT NULL;
    
  -- Log action (optional)
  INSERT INTO audit_logs(action, description)
  VALUES (
    'trial_expiration_check', 
    'Checked for expired trials at ' || NOW()::text
  );
END;
$$;

-- Create audit_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  action TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comment on the function for documentation
COMMENT ON FUNCTION check_trial_expirations IS 'Checks for expired trials and updates their status to expired';

-- Grant execution permissions to authenticated users
GRANT EXECUTE ON FUNCTION check_trial_expirations TO authenticated;

-- Add a scheduled task to run this function daily (for reference - actually set up in Supabase UI)
-- This is a comment showing what will be done in the Supabase dashboard:
-- 
-- Name: Daily Trial Expiration Check
-- Schedule: 0 0 * * * (runs at midnight every day)
-- Function: check_trial_expirations()