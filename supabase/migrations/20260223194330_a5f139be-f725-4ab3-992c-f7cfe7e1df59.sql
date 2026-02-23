
-- Table to store which admin panels each employee has access to
CREATE TABLE public.employee_panel_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  panel_key text NOT NULL,
  granted_by uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(profile_id, panel_key)
);

ALTER TABLE public.employee_panel_access ENABLE ROW LEVEL SECURITY;

-- Admins can manage all access
CREATE POLICY "PanelAccess: admin full"
  ON public.employee_panel_access FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Employees can read their own access
CREATE POLICY "PanelAccess: own read"
  ON public.employee_panel_access FOR SELECT
  USING (profile_id = (SELECT p.id FROM profiles p WHERE p.user_id = auth.uid() LIMIT 1));
