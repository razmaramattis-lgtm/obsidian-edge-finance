
-- Advisor assignment requests from customers
CREATE TABLE public.advisor_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid NOT NULL REFERENCES public.customer_companies(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  message text,
  admin_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(company_id, status)
);

ALTER TABLE public.advisor_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "AdvReq: admin full"
  ON public.advisor_requests FOR ALL
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "AdvReq: employee read"
  ON public.advisor_requests FOR SELECT
  USING (is_employee_or_admin());

CREATE POLICY "AdvReq: own read"
  ON public.advisor_requests FOR SELECT
  USING (company_id = own_company_id());

CREATE POLICY "AdvReq: own insert"
  ON public.advisor_requests FOR INSERT
  WITH CHECK (company_id = own_company_id());

CREATE TRIGGER update_advisor_requests_updated_at
  BEFORE UPDATE ON public.advisor_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
