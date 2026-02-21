
-- Add primary and backup advisor to customer companies
ALTER TABLE public.customer_companies
  ADD COLUMN primary_advisor_id uuid REFERENCES public.profiles(id),
  ADD COLUMN backup_advisor_id uuid REFERENCES public.profiles(id);

-- Create customer handbook chapters (copied from hr_handbook as template)
CREATE TABLE public.customer_handbook_chapters (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid NOT NULL REFERENCES public.customer_companies(id) ON DELETE CASCADE,
  source_chapter_id uuid REFERENCES public.hr_handbook(id),
  title text NOT NULL,
  content text,
  sort_order integer DEFAULT 0,
  customized boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.customer_handbook_chapters ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "CustHandbook: admin full"
  ON public.customer_handbook_chapters FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Employee read
CREATE POLICY "CustHandbook: employee read"
  ON public.customer_handbook_chapters FOR SELECT
  USING (is_employee_or_admin());

-- Customer can read own
CREATE POLICY "CustHandbook: own read"
  ON public.customer_handbook_chapters FOR SELECT
  USING (company_id = own_company_id());

-- Customer can update own
CREATE POLICY "CustHandbook: own update"
  ON public.customer_handbook_chapters FOR UPDATE
  USING (company_id = own_company_id());

-- Trigger for updated_at
CREATE TRIGGER update_customer_handbook_chapters_updated_at
  BEFORE UPDATE ON public.customer_handbook_chapters
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
