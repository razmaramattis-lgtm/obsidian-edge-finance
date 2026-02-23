
-- Add preferred_accounting_systems to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferred_accounting_systems text[] DEFAULT '{}'::text[];
