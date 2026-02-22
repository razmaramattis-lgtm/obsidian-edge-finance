
-- Add tags column to account_entries for search keywords
ALTER TABLE public.account_entries ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}'::text[];
