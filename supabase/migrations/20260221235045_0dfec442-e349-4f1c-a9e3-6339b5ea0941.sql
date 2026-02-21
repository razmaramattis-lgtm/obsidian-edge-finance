
-- Table for customer employee invitations (pending admin approval)
CREATE TABLE public.customer_employee_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.customer_companies(id) ON DELETE CASCADE,
  invited_by uuid NOT NULL REFERENCES public.profiles(id),
  employee_name text NOT NULL,
  employee_email text NOT NULL,
  role text NOT NULL DEFAULT 'ansatt',
  status text NOT NULL DEFAULT 'pending',
  admin_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.customer_employee_invitations ENABLE ROW LEVEL SECURITY;

-- Customer can insert for own company
CREATE POLICY "EmpInvite: own insert"
  ON public.customer_employee_invitations
  FOR INSERT
  WITH CHECK (company_id = own_company_id());

-- Customer can read own company invitations
CREATE POLICY "EmpInvite: own read"
  ON public.customer_employee_invitations
  FOR SELECT
  USING (company_id = own_company_id());

-- Admin full access
CREATE POLICY "EmpInvite: admin full"
  ON public.customer_employee_invitations
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Employee read
CREATE POLICY "EmpInvite: employee read"
  ON public.customer_employee_invitations
  FOR SELECT
  USING (is_employee_or_admin());
