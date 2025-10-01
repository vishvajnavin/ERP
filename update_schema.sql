-- NOTE: The names of the CHECK constraints might be different in your database.
-- If these commands fail, you may need to find the exact constraint names first.
-- You can typically find them using a command like this in psql:
-- \d public.sofa_products

-- Step 1: Drop the existing CHECK constraints that do not allow NULLs.
ALTER TABLE public.sofa_products DROP CONSTRAINT sofa_products_recliner_mechanism_mode_check;
ALTER TABLE public.sofa_products DROP CONSTRAINT sofa_products_recliner_mechanism_flip_check;

-- Step 2: Add new CHECK constraints that explicitly allow NULL values.
ALTER TABLE public.sofa_products
ADD CONSTRAINT sofa_products_recliner_mechanism_mode_check
CHECK (
  recliner_mechanism_mode IS NULL OR
  recliner_mechanism_mode = ANY (ARRAY['manual'::text, 'motorized_single'::text, 'motorized_double'::text])
);

ALTER TABLE public.sofa_products
ADD CONSTRAINT sofa_products_recliner_mechanism_flip_check
CHECK (
  recliner_mechanism_flip IS NULL OR
  recliner_mechanism_flip = ANY (ARRAY['single_flip'::text, 'double_flip'::text, 'double_motor_with_headrest'::text])
);

-- Step 3: Allow NULL values for seater length columns by dropping the NOT NULL constraint.
-- The column names are quoted because they start with a number.
ALTER TABLE public.sofa_products ALTER COLUMN "2_seater_length" DROP NOT NULL;
ALTER TABLE public.sofa_products ALTER COLUMN "1_seater_length" DROP NOT NULL;

-- Step 4: Remove the default value for the seater length columns.
ALTER TABLE public.sofa_products ALTER COLUMN "2_seater_length" DROP DEFAULT;
ALTER TABLE public.sofa_products ALTER COLUMN "1_seater_length" DROP DEFAULT;
