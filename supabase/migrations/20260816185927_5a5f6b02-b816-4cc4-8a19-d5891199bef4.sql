CREATE TABLE public.crm_lead_folders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  color text NOT NULL DEFAULT 'emerald',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_lead_folders TO authenticated;
GRANT ALL ON public.crm_lead_folders TO service_role;
ALTER TABLE public.crm_lead_folders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage crm folders" ON public.crm_lead_folders
  FOR ALL TO authenticated
  USING (public.is_employee_or_admin(auth.uid()))
  WITH CHECK (public.is_employee_or_admin(auth.uid()));

CREATE TRIGGER update_crm_lead_folders_updated_at
  BEFORE UPDATE ON public.crm_lead_folders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.crm_lead_folder_members (
  folder_id uuid NOT NULL REFERENCES public.crm_lead_folders(id) ON DELETE CASCADE,
  lead_id uuid NOT NULL REFERENCES public.crm_leads(id) ON DELETE CASCADE,
  added_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (folder_id, lead_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_lead_folder_members TO authenticated;
GRANT ALL ON public.crm_lead_folder_members TO service_role;
ALTER TABLE public.crm_lead_folder_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage crm folder members" ON public.crm_lead_folder_members
  FOR ALL TO authenticated
  USING (public.is_employee_or_admin(auth.uid()))
  WITH CHECK (public.is_employee_or_admin(auth.uid()));

CREATE INDEX idx_crm_lead_folder_members_lead ON public.crm_lead_folder_members(lead_id);