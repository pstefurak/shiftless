/*
  # Add Vapi Agent Fields to Restaurant Profiles

  1. Changes
    - Add vapi_agent_id field to restaurant_profiles table
    - Add vapi_phone_number field to restaurant_profiles table
  
  2. Details
    - These fields store the Vapi agent information after onboarding is complete
    - vapi_agent_id stores the unique ID of the Vapi agent created for this restaurant
    - vapi_phone_number stores the phone number assigned to the Vapi agent
*/

-- Add vapi_agent_id column to restaurant_profiles
ALTER TABLE restaurant_profiles
ADD COLUMN IF NOT EXISTS vapi_agent_id text DEFAULT NULL;

-- Add vapi_phone_number column to restaurant_profiles
ALTER TABLE restaurant_profiles
ADD COLUMN IF NOT EXISTS vapi_phone_number text DEFAULT NULL;