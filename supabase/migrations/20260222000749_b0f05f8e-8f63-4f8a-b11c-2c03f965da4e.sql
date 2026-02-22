
-- 1. Extend customer_companies with more company details
ALTER TABLE public.customer_companies
  ADD COLUMN IF NOT EXISTS address text,
  ADD COLUMN IF NOT EXISTS postal_code text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS country text DEFAULT 'Norge',
  ADD COLUMN IF NOT EXISTS website text,
  ADD COLUMN IF NOT EXISTS company_type text DEFAULT 'AS',
  ADD COLUMN IF NOT EXISTS share_capital numeric,
  ADD COLUMN IF NOT EXISTS founding_date date,
  ADD COLUMN IF NOT EXISTS fiscal_year_end text DEFAULT '31.12',
  ADD COLUMN IF NOT EXISTS auditor text,
  ADD COLUMN IF NOT EXISTS logo_url text,
  ADD COLUMN IF NOT EXISTS description text;

-- 2. Company owners table
CREATE TABLE public.company_owners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.customer_companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  phone text,
  ownership_percent numeric NOT NULL DEFAULT 0,
  role text DEFAULT 'Eier',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.company_owners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "CompOwners: admin full" ON public.company_owners FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "CompOwners: employee read" ON public.company_owners FOR SELECT USING (is_employee_or_admin());
CREATE POLICY "CompOwners: own read" ON public.company_owners FOR SELECT USING (company_id = own_company_id());
CREATE POLICY "CompOwners: own insert" ON public.company_owners FOR INSERT WITH CHECK (company_id = own_company_id());
CREATE POLICY "CompOwners: own update" ON public.company_owners FOR UPDATE USING (company_id = own_company_id());
CREATE POLICY "CompOwners: own delete" ON public.company_owners FOR DELETE USING (company_id = own_company_id());

-- 3. Company board members table
CREATE TABLE public.company_board_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.customer_companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  phone text,
  position text NOT NULL DEFAULT 'Styremedlem',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.company_board_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "CompBoard: admin full" ON public.company_board_members FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "CompBoard: employee read" ON public.company_board_members FOR SELECT USING (is_employee_or_admin());
CREATE POLICY "CompBoard: own read" ON public.company_board_members FOR SELECT USING (company_id = own_company_id());
CREATE POLICY "CompBoard: own insert" ON public.company_board_members FOR INSERT WITH CHECK (company_id = own_company_id());
CREATE POLICY "CompBoard: own update" ON public.company_board_members FOR UPDATE USING (company_id = own_company_id());
CREATE POLICY "CompBoard: own delete" ON public.company_board_members FOR DELETE USING (company_id = own_company_id());

-- 4. Company contact persons table
CREATE TABLE public.company_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.customer_companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  phone text,
  role text DEFAULT 'Kontaktperson',
  is_primary boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.company_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "CompContacts: admin full" ON public.company_contacts FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "CompContacts: employee read" ON public.company_contacts FOR SELECT USING (is_employee_or_admin());
CREATE POLICY "CompContacts: own read" ON public.company_contacts FOR SELECT USING (company_id = own_company_id());
CREATE POLICY "CompContacts: own insert" ON public.company_contacts FOR INSERT WITH CHECK (company_id = own_company_id());
CREATE POLICY "CompContacts: own update" ON public.company_contacts FOR UPDATE USING (company_id = own_company_id());
CREATE POLICY "CompContacts: own delete" ON public.company_contacts FOR DELETE USING (company_id = own_company_id());

-- 5. Benefit agreement applications from customers
CREATE TABLE public.benefit_agreement_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.customer_companies(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  offering text,
  price text,
  website text,
  contact_name text,
  contact_email text,
  contact_phone text,
  logo_url text,
  status text NOT NULL DEFAULT 'pending',
  admin_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.benefit_agreement_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "BenefitApp: admin full" ON public.benefit_agreement_applications FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "BenefitApp: employee read" ON public.benefit_agreement_applications FOR SELECT USING (is_employee_or_admin());
CREATE POLICY "BenefitApp: own read" ON public.benefit_agreement_applications FOR SELECT USING (company_id = own_company_id());
CREATE POLICY "BenefitApp: own insert" ON public.benefit_agreement_applications FOR INSERT WITH CHECK (company_id = own_company_id());

-- 6. Document templates (admin creates with merge fields)
CREATE TABLE public.document_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text DEFAULT 'Generelt',
  content text NOT NULL,
  merge_fields jsonb DEFAULT '[]'::jsonb,
  active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "DocTemplates: admin full" ON public.document_templates FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "DocTemplates: customer read active" ON public.document_templates FOR SELECT USING (is_customer() AND active = true);
CREATE POLICY "DocTemplates: employee read" ON public.document_templates FOR SELECT USING (is_employee_or_admin());

-- 7. Customer templates/maler section - use existing resources table with a new category filter
-- We'll add a 'type' column to distinguish maler from regular resources
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS type text DEFAULT 'resource';

-- Update customer_companies own update policy
CREATE POLICY "CustComp: own update" ON public.customer_companies FOR UPDATE USING (profile_id = (SELECT profiles.id FROM profiles WHERE profiles.user_id = auth.uid() LIMIT 1));

-- Triggers for updated_at
CREATE TRIGGER update_company_owners_updated_at BEFORE UPDATE ON public.company_owners FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_company_board_members_updated_at BEFORE UPDATE ON public.company_board_members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_company_contacts_updated_at BEFORE UPDATE ON public.company_contacts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_benefit_applications_updated_at BEFORE UPDATE ON public.benefit_agreement_applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_document_templates_updated_at BEFORE UPDATE ON public.document_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
