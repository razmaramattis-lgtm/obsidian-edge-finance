
-- Add section column to contact_submissions
ALTER TABLE public.contact_submissions 
ADD COLUMN section text DEFAULT NULL;

-- Add section column to bookings
ALTER TABLE public.bookings 
ADD COLUMN section text DEFAULT NULL;

-- Add section column to pricing_plans
ALTER TABLE public.pricing_plans 
ADD COLUMN section text DEFAULT NULL;
