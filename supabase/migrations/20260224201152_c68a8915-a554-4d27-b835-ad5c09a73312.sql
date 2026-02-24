-- Fix job_listings RLS: admin policy uses profiles.id instead of profiles.user_id
DROP POLICY IF EXISTS "Admins can manage job listings" ON public.job_listings;
CREATE POLICY "JobListings: admin full" ON public.job_listings FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Keep public read for published+active listings
DROP POLICY IF EXISTS "Anyone can view published job listings" ON public.job_listings;
CREATE POLICY "JobListings: public read published" ON public.job_listings FOR SELECT USING ((published = true AND active = true) OR is_admin());

-- Employee read
CREATE POLICY "JobListings: employee read" ON public.job_listings FOR SELECT USING (is_employee_or_admin());