
-- Create contact_submissions table
CREATE TABLE public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text,
  org_number text,
  contact_person text,
  email text,
  phone text,
  industry text,
  industry_code text,
  revenue_target text,
  message text,
  package text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Public can insert (contact form)
CREATE POLICY "ContactSub: public insert"
ON public.contact_submissions
FOR INSERT
WITH CHECK (true);

-- Only admins can read
CREATE POLICY "ContactSub: admin read"
ON public.contact_submissions
FOR SELECT
USING (is_admin());

-- Only admins can update
CREATE POLICY "ContactSub: admin update"
ON public.contact_submissions
FOR UPDATE
USING (is_admin());

-- Only admins can delete
CREATE POLICY "ContactSub: admin delete"
ON public.contact_submissions
FOR DELETE
USING (is_admin());

-- Auto-update updated_at
CREATE TRIGGER update_contact_submissions_updated_at
BEFORE UPDATE ON public.contact_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
