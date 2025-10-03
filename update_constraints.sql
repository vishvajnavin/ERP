-- This script updates the check constraints for the sofa_products table
-- to allow NULL values for chester_option, headrest_mode, and daybed_headrest_mode.

-- NOTE: You will need to replace the placeholder constraint names 
-- (e.g., sofa_products_chester_option_check) with the actual names of the 
-- constraints in your database.

-- You can find the constraint names by running a query like this in your SQL client:
-- SELECT conname
-- FROM pg_constraint
-- WHERE conrelid = 'sofa_products'::regclass AND contype = 'c';


-- 1. Update the check constraint for chester_option
-- First, drop the existing constraint (replace 'sofa_products_chester_option_check' with the actual name)
ALTER TABLE public.sofa_products DROP CONSTRAINT sofa_products_chester_option_check;

-- Then, add the new constraint that allows NULL
ALTER TABLE public.sofa_products ADD CONSTRAINT sofa_products_chester_option_check 
CHECK (chester_option IS NULL OR (chester_option = ANY (ARRAY['with_button'::text, 'without_button'::text])));


-- 2. Update the check constraint for headrest_mode
-- First, drop the existing constraint (replace 'sofa_products_headrest_mode_check' with the actual name)
ALTER TABLE public.sofa_products DROP CONSTRAINT sofa_products_headrest_mode_check;

-- Then, add the new constraint that allows NULL
ALTER TABLE public.sofa_products ADD CONSTRAINT sofa_products_headrest_mode_check 
CHECK (headrest_mode IS NULL OR (headrest_mode = ANY (ARRAY['manual'::text, 'motorized'::text])));


-- 3. Update the check constraint for daybed_headrest_mode
-- First, drop the existing constraint (replace 'sofa_products_daybed_headrest_mode_check' with the actual name)
ALTER TABLE public.sofa_products DROP CONSTRAINT sofa_products_daybed_headrest_mode_check;

-- Then, add the new constraint that allows NULL
ALTER TABLE public.sofa_products ADD CONSTRAINT sofa_products_daybed_headrest_mode_check 
CHECK (daybed_headrest_mode IS NULL OR (daybed_headrest_mode = ANY (ARRAY['manual'::text, 'motorized'::text])));
