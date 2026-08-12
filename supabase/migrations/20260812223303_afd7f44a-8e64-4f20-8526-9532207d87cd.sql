-- ===== CRM leads =====
CREATE TABLE public.crm_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  orgnr text NOT NULL UNIQUE,
  name text NOT NULL,
  org_form text,
  org_form_text text,
  industry_code text,
  industry_text text,
  municipality text,
  municipality_number text,
  postal_code text,
  postal_area text,
  address text,
  registered_at date,
  founded_at date,
  employees integer,
  website text,
  email text,
  email_verified boolean NOT NULL DEFAULT false,
  phone text,
  contact_name text,
  roles jsonb NOT NULL DEFAULT '[]'::jsonb,
  has_accountant boolean NOT NULL DEFAULT false,
  accountant_name text,
  has_auditor boolean NOT NULL DEFAULT false,
  category text NOT NULL DEFAULT 'ukjent',
  status text NOT NULL DEFAULT 'ny',
  notes text,
  last_emailed_at timestamptz,
  email_count integer NOT NULL DEFAULT 0,
  unsubscribed boolean NOT NULL DEFAULT false,
  source text NOT NULL DEFAULT 'brreg',
  raw jsonb,
  synced_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX crm_leads_category_idx ON public.crm_leads (category);
CREATE INDEX crm_leads_status_idx ON public.crm_leads (status);
CREATE INDEX crm_leads_municipality_idx ON public.crm_leads (municipality);
CREATE INDEX crm_leads_registered_idx ON public.crm_leads (registered_at DESC);
CREATE INDEX crm_leads_name_idx ON public.crm_leads (lower(name));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_leads TO authenticated;
GRANT ALL ON public.crm_leads TO service_role;
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage crm leads" ON public.crm_leads FOR ALL TO authenticated
  USING (public.is_employee_or_admin(auth.uid()))
  WITH CHECK (public.is_employee_or_admin(auth.uid()));
CREATE TRIGGER update_crm_leads_updated_at BEFORE UPDATE ON public.crm_leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== Templates =====
CREATE TABLE public.crm_email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'generell',
  subject text NOT NULL,
  body_html text NOT NULL,
  is_default boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_email_templates TO authenticated;
GRANT ALL ON public.crm_email_templates TO service_role;
ALTER TABLE public.crm_email_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage crm templates" ON public.crm_email_templates FOR ALL TO authenticated
  USING (public.is_employee_or_admin(auth.uid()))
  WITH CHECK (public.is_employee_or_admin(auth.uid()));
CREATE TRIGGER update_crm_templates_updated_at BEFORE UPDATE ON public.crm_email_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== Automation settings (single row) =====
CREATE TABLE public.crm_automation_settings (
  id integer PRIMARY KEY DEFAULT 1,
  sync_enabled boolean NOT NULL DEFAULT true,
  autopilot_enabled boolean NOT NULL DEFAULT false,
  daily_limit integer NOT NULL DEFAULT 25,
  send_hour integer NOT NULL DEFAULT 9,
  municipality_numbers text[] NOT NULL DEFAULT '{}',
  org_forms text[] NOT NULL DEFAULT ARRAY['AS','ENK','ANS','DA'],
  industry_prefixes text[] NOT NULL DEFAULT '{}',
  categories text[] NOT NULL DEFAULT ARRAY['ny_bedrift'],
  template_map jsonb NOT NULL DEFAULT '{}'::jsonb,
  lookback_days integer NOT NULL DEFAULT 7,
  last_sync_at timestamptz,
  last_autopilot_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT crm_settings_single_row CHECK (id = 1)
);

GRANT SELECT, INSERT, UPDATE ON public.crm_automation_settings TO authenticated;
GRANT ALL ON public.crm_automation_settings TO service_role;
ALTER TABLE public.crm_automation_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage crm settings" ON public.crm_automation_settings FOR ALL TO authenticated
  USING (public.is_employee_or_admin(auth.uid()))
  WITH CHECK (public.is_employee_or_admin(auth.uid()));
CREATE TRIGGER update_crm_settings_updated_at BEFORE UPDATE ON public.crm_automation_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.crm_automation_settings (id) VALUES (1) ON CONFLICT DO NOTHING;

-- ===== Sync log =====
CREATE TABLE public.crm_sync_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_at timestamptz NOT NULL DEFAULT now(),
  mode text NOT NULL DEFAULT 'daily',
  fetched integer NOT NULL DEFAULT 0,
  inserted integer NOT NULL DEFAULT 0,
  updated integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'ok',
  error_message text,
  details jsonb
);

GRANT SELECT, INSERT, DELETE ON public.crm_sync_log TO authenticated;
GRANT ALL ON public.crm_sync_log TO service_role;
ALTER TABLE public.crm_sync_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read crm sync log" ON public.crm_sync_log FOR ALL TO authenticated
  USING (public.is_employee_or_admin(auth.uid()))
  WITH CHECK (public.is_employee_or_admin(auth.uid()));

-- ===== Email events =====
CREATE TABLE public.crm_email_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES public.crm_leads(id) ON DELETE CASCADE,
  template_id uuid REFERENCES public.crm_email_templates(id) ON DELETE SET NULL,
  recipient_email text NOT NULL,
  subject text NOT NULL,
  message_id text,
  status text NOT NULL DEFAULT 'queued',
  error_message text,
  sent_by uuid,
  automated boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX crm_email_events_lead_idx ON public.crm_email_events (lead_id, created_at DESC);

GRANT SELECT, INSERT, DELETE ON public.crm_email_events TO authenticated;
GRANT ALL ON public.crm_email_events TO service_role;
ALTER TABLE public.crm_email_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage crm email events" ON public.crm_email_events FOR ALL TO authenticated
  USING (public.is_employee_or_admin(auth.uid()))
  WITH CHECK (public.is_employee_or_admin(auth.uid()));