ALTER TABLE public.account_entries
ADD COLUMN related_accounts text[] NOT NULL DEFAULT '{}'::text[];