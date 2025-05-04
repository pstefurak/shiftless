/*
  # Add custom order fields to orders table

  1. New Columns
    - `is_custom_order` (boolean, default false, not nullable) - Indicates if this is a custom order
    - `custom_order_text` (text, nullable) - Description of the custom order if applicable
  
  2. Changes
    - Updates the existing orders table to add support for custom orders
    - Ensures backward compatibility with existing data
  
  3. Security
    - Updates RLS policies to ensure proper access to new fields
*/

-- Add is_custom_order column with default value
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS is_custom_order boolean NOT NULL DEFAULT false;

-- Add comment to describe the column
COMMENT ON COLUMN orders.is_custom_order IS 'Indicates whether the order is a custom order (true) or from the menu (false)';

-- Add custom_order_text column
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS custom_order_text text NULL;

-- Add comment to describe the column
COMMENT ON COLUMN orders.custom_order_text IS 'Text description of the custom order, if applicable';

-- No need to update RLS policies since we're using existing ones and they cover all columns
-- The existing policies use 'true' for authenticated users which means they have full access
-- But let's verify and recreate them to be explicit

-- Policy: Authenticated users can insert new orders (with the new fields)
DROP POLICY IF EXISTS "Authenticated users can insert new orders" ON orders;
CREATE POLICY "Authenticated users can insert new orders" 
ON public.orders 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Policy: Authenticated users can update any order (including new fields)
DROP POLICY IF EXISTS "Authenticated users can update any order" ON orders;
CREATE POLICY "Authenticated users can update any order" 
ON public.orders 
FOR UPDATE 
TO authenticated 
USING (true);

-- Policy: Authenticated users can view all orders
DROP POLICY IF EXISTS "Authenticated users can view all orders" ON orders;
CREATE POLICY "Authenticated users can view all orders" 
ON public.orders 
FOR SELECT 
TO authenticated 
USING (true);

-- We're not changing the delete policy as it's not directly related to these fields