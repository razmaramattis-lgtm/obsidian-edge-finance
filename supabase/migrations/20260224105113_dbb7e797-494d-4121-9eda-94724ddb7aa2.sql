
-- Add images array column to job_listings
ALTER TABLE public.job_listings ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';
