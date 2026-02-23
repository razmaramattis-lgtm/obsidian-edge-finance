-- Allow all authenticated users to read all profiles (so profile info is visible to everyone)
CREATE POLICY "Profiles: authenticated read all"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);