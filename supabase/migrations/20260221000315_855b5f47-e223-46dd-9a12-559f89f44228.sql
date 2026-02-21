-- Fix privilege escalation: restrict own update to name only
DROP POLICY IF EXISTS "Profiles: own update" ON public.profiles;

CREATE POLICY "Profiles: own update safe fields" ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id AND
  role IS NOT DISTINCT FROM (SELECT p.role FROM public.profiles p WHERE p.user_id = auth.uid()) AND
  email IS NOT DISTINCT FROM (SELECT p.email FROM public.profiles p WHERE p.user_id = auth.uid()) AND
  user_id IS NOT DISTINCT FROM (SELECT p.user_id FROM public.profiles p WHERE p.id = profiles.id)
);