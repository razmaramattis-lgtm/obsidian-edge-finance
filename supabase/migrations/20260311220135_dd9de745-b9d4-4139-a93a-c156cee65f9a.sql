CREATE TABLE public.marketing_video_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  prompt text NOT NULL,
  platform text NOT NULL DEFAULT 'linkedin',
  aspect_ratio text NOT NULL DEFAULT '16:9',
  duration integer NOT NULL DEFAULT 5,
  status text NOT NULL DEFAULT 'pending',
  requested_by uuid REFERENCES public.profiles(id),
  admin_note text,
  video_url text,
  thumbnail_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.marketing_video_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and employees can manage video requests"
ON public.marketing_video_requests
FOR ALL
TO authenticated
USING (public.is_employee_or_admin(auth.uid()))
WITH CHECK (public.is_employee_or_admin(auth.uid()));

CREATE TRIGGER update_video_requests_updated_at
  BEFORE UPDATE ON public.marketing_video_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();