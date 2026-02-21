
-- Partnership interest requests from customers
CREATE TABLE public.partnership_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agreement_id uuid NOT NULL REFERENCES public.collaboration_agreements(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES public.customer_companies(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  message text,
  admin_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(agreement_id, company_id)
);

ALTER TABLE public.partnership_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "PartReq: admin full"
  ON public.partnership_requests FOR ALL
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "PartReq: employee read"
  ON public.partnership_requests FOR SELECT
  USING (is_employee_or_admin());

CREATE POLICY "PartReq: own read"
  ON public.partnership_requests FOR SELECT
  USING (company_id = own_company_id());

CREATE POLICY "PartReq: own insert"
  ON public.partnership_requests FOR INSERT
  WITH CHECK (company_id = own_company_id());

CREATE TRIGGER update_partnership_requests_updated_at
  BEFORE UPDATE ON public.partnership_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
