-- SQL script to update the 'daybed_headrest_mode' constraint in the 'sofa_products' table.

-- Step 1: Drop the existing constraint.
-- IMPORTANT: The original constraint was created without a specific name, so the database
-- assigned one automatically. You MUST find this name in your Supabase dashboard.
-- Go to the 'sofa_products' table definition, look under the 'Constraints' tab,
-- and find the CHECK constraint on the 'daybed_headrest_mode' column.
-- Replace 'your_constraint_name_here' with the actual constraint name.

ALTER TABLE public.sofa_products DROP CONSTRAINT your_constraint_name_here;

-- Step 2: Add the new, corrected constraint.
-- This new constraint adds 'fixed' to the list of allowed values while still allowing NULL.

ALTER TABLE public.sofa_products
ADD CONSTRAINT sofa_products_daybed_headrest_mode_check
CHECK (daybed_headrest_mode IS NULL OR (daybed_headrest_mode = ANY (ARRAY['manual'::text, 'motorized'::text, 'fixed'::text])));
