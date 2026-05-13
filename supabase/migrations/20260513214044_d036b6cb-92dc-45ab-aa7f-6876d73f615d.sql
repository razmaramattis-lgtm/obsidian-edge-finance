ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS source text,
  ADD COLUMN IF NOT EXISTS referrer text;

CREATE INDEX IF NOT EXISTS idx_contact_submissions_source ON public.contact_submissions(source);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON public.contact_submissions(created_at DESC);