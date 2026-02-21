-- Add teams_link and booking_active to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS teams_link text,
ADD COLUMN IF NOT EXISTS booking_active boolean NOT NULL DEFAULT false;

-- Allow employees to manage their OWN availability records
CREATE POLICY "AdvAvail: own insert"
ON public.advisor_availability
FOR INSERT
WITH CHECK (
  is_employee_or_admin() AND 
  profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1)
);

CREATE POLICY "AdvAvail: own update"
ON public.advisor_availability
FOR UPDATE
USING (
  profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1)
);

CREATE POLICY "AdvAvail: own delete"
ON public.advisor_availability
FOR DELETE
USING (
  profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1)
);

-- Allow employees to manage their OWN blocked dates
CREATE POLICY "BlockedDates: own insert"
ON public.advisor_blocked_dates
FOR INSERT
WITH CHECK (
  is_employee_or_admin() AND 
  profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1)
);

CREATE POLICY "BlockedDates: own update"
ON public.advisor_blocked_dates
FOR UPDATE
USING (
  profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1)
);

CREATE POLICY "BlockedDates: own delete"
ON public.advisor_blocked_dates
FOR DELETE
USING (
  profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1)
);

-- Allow employees to read their own blocked dates
CREATE POLICY "BlockedDates: own read"
ON public.advisor_blocked_dates
FOR SELECT
USING (
  profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1)
);