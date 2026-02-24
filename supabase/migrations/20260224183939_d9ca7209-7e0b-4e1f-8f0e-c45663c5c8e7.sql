
-- Add missing fields to job_applications for complete candidate info
ALTER TABLE public.job_applications
  ADD COLUMN IF NOT EXISTS address text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS postal_code text,
  ADD COLUMN IF NOT EXISTS date_of_birth date;
