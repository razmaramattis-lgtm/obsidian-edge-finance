
-- Add background_url to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS background_url text;
