-- Add highlights (keyword tags) to job listings
ALTER TABLE public.job_listings
ADD COLUMN highlights text[] DEFAULT '{}'::text[];