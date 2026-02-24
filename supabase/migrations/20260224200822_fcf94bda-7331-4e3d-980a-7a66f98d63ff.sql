-- Fix job_applications RLS: admin policy uses wrong column check
DROP POLICY IF EXISTS "Admins can manage job applications" ON public.job_applications;
CREATE POLICY "JobApp: admin full" ON public.job_applications FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Also add employee read for job_applications
CREATE POLICY "JobApp: employee read" ON public.job_applications FOR SELECT USING (is_employee_or_admin());

-- Ensure public insert still works
DROP POLICY IF EXISTS "Anyone can submit job applications" ON public.job_applications;
CREATE POLICY "JobApp: public insert" ON public.job_applications FOR INSERT WITH CHECK (true);

-- Also add delete for admin on open_applications
DROP POLICY IF EXISTS "OpenApp: admin delete" ON public.open_applications;
-- admin full already covers delete