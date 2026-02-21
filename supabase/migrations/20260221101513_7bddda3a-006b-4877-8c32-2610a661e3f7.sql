
-- Customer companies table
CREATE TABLE public.customer_companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  org_number text,
  industry text,
  contact_phone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(profile_id)
);
ALTER TABLE public.customer_companies ENABLE ROW LEVEL SECURITY;

-- Customer documents table
CREATE TABLE public.customer_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.customer_companies(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  file_url text,
  file_name text,
  file_size text,
  visibility text NOT NULL DEFAULT 'private',
  uploaded_by uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.customer_documents ENABLE ROW LEVEL SECURITY;

-- Customer financials table
CREATE TABLE public.customer_financials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.customer_companies(id) ON DELETE CASCADE,
  period text NOT NULL,
  revenue numeric NOT NULL DEFAULT 0,
  costs numeric NOT NULL DEFAULT 0,
  result numeric NOT NULL DEFAULT 0,
  equity numeric DEFAULT 0,
  assets numeric DEFAULT 0,
  liabilities numeric DEFAULT 0,
  notes text,
  admin_action_plan text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.customer_financials ENABLE ROW LEVEL SECURITY;

-- Helper function: is_customer
CREATE OR REPLACE FUNCTION public.is_customer(uid uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = uid AND role = 'customer'
  );
$$;

-- Helper: get own company id
CREATE OR REPLACE FUNCTION public.own_company_id(uid uuid DEFAULT auth.uid())
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT cc.id FROM public.customer_companies cc
  JOIN public.profiles p ON p.id = cc.profile_id
  WHERE p.user_id = uid
  LIMIT 1;
$$;

-- RLS: customer_companies
CREATE POLICY "CustComp: admin full" ON public.customer_companies FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "CustComp: employee read" ON public.customer_companies FOR SELECT USING (is_employee_or_admin());
CREATE POLICY "CustComp: own read" ON public.customer_companies FOR SELECT USING (
  profile_id = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1)
);

-- RLS: customer_documents
CREATE POLICY "CustDoc: admin full" ON public.customer_documents FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "CustDoc: own read" ON public.customer_documents FOR SELECT USING (
  company_id = own_company_id()
);
CREATE POLICY "CustDoc: employee read" ON public.customer_documents FOR SELECT USING (is_employee_or_admin());

-- RLS: customer_financials
CREATE POLICY "CustFin: admin full" ON public.customer_financials FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "CustFin: own read" ON public.customer_financials FOR SELECT USING (
  company_id = own_company_id()
);
CREATE POLICY "CustFin: employee read" ON public.customer_financials FOR SELECT USING (is_employee_or_admin());

-- Collaboration agreements: add price and target_audience
ALTER TABLE public.collaboration_agreements 
  ADD COLUMN IF NOT EXISTS price text,
  ADD COLUMN IF NOT EXISTS target_audience text NOT NULL DEFAULT 'all';

-- Triggers for updated_at
CREATE TRIGGER update_customer_companies_updated_at BEFORE UPDATE ON public.customer_companies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_customer_documents_updated_at BEFORE UPDATE ON public.customer_documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_customer_financials_updated_at BEFORE UPDATE ON public.customer_financials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
