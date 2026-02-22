
-- Convert examples from text to text[]
ALTER TABLE public.account_entries 
  ALTER COLUMN examples TYPE text[] 
  USING CASE 
    WHEN examples IS NULL THEN NULL 
    WHEN examples = '' THEN '{}'::text[]
    ELSE string_to_array(examples, ',')
  END;

-- Set default to empty array
ALTER TABLE public.account_entries 
  ALTER COLUMN examples SET DEFAULT '{}'::text[];
