
-- Create table for open/spontaneous job applications
CREATE TABLE public.open_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  date_of_birth DATE,
  linkedin_url TEXT,
  portfolio_url TEXT,
  preferred_category TEXT,
  available_from TEXT,
  message TEXT,
  cv_url TEXT,
  cv_file_name TEXT,
  status TEXT NOT NULL DEFAULT 'ny',
  admin_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.open_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "OpenApp: public insert" ON public.open_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "OpenApp: admin full" ON public.open_applications FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "OpenApp: employee read" ON public.open_applications FOR SELECT USING (is_employee_or_admin());

CREATE TRIGGER update_open_applications_updated_at
  BEFORE UPDATE ON public.open_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
