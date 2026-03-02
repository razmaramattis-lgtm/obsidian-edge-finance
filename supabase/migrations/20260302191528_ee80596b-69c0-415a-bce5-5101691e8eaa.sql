
-- Table for partnership/acquisition applications from external accounting firms
CREATE TABLE public.samarbeid_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_number TEXT NOT NULL,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  website TEXT,
  num_employees INTEGER,
  annual_revenue TEXT,
  interest_type TEXT NOT NULL DEFAULT 'partnership', -- 'full_sale', 'partnership', 'both'
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  admin_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.samarbeid_applications ENABLE ROW LEVEL SECURITY;

-- Public can submit applications
CREATE POLICY "SamarbeidApp: public insert"
ON public.samarbeid_applications
FOR INSERT
WITH CHECK (true);

-- Only admins can read/update/delete
CREATE POLICY "SamarbeidApp: admin read"
ON public.samarbeid_applications
FOR SELECT
USING (is_admin());

CREATE POLICY "SamarbeidApp: admin update"
ON public.samarbeid_applications
FOR UPDATE
USING (is_admin());

CREATE POLICY "SamarbeidApp: admin delete"
ON public.samarbeid_applications
FOR DELETE
USING (is_admin());

-- Timestamp trigger
CREATE TRIGGER update_samarbeid_applications_updated_at
BEFORE UPDATE ON public.samarbeid_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
