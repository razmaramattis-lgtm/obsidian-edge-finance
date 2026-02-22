
CREATE TABLE public.profile_specialties (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.profile_specialties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Specialties: own read" ON public.profile_specialties
  FOR SELECT USING (
    profile_id = (SELECT p.id FROM profiles p WHERE p.user_id = auth.uid() LIMIT 1)
    OR is_employee_or_admin()
  );

CREATE POLICY "Specialties: own insert" ON public.profile_specialties
  FOR INSERT WITH CHECK (
    profile_id = (SELECT p.id FROM profiles p WHERE p.user_id = auth.uid() LIMIT 1)
  );

CREATE POLICY "Specialties: own update" ON public.profile_specialties
  FOR UPDATE USING (
    profile_id = (SELECT p.id FROM profiles p WHERE p.user_id = auth.uid() LIMIT 1)
  );

CREATE POLICY "Specialties: own delete" ON public.profile_specialties
  FOR DELETE USING (
    profile_id = (SELECT p.id FROM profiles p WHERE p.user_id = auth.uid() LIMIT 1)
  );

CREATE POLICY "Specialties: admin full" ON public.profile_specialties
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());
