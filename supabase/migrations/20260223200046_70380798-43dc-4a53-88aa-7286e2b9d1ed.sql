-- Add last_seen_at to profiles for offline detection
ALTER TABLE public.profiles ADD COLUMN last_seen_at TIMESTAMPTZ DEFAULT NULL;

-- Allow users to update their own last_seen_at
CREATE POLICY "Profiles: own update last_seen"
ON public.profiles FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());