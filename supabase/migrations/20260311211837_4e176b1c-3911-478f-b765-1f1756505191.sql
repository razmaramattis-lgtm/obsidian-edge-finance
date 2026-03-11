
CREATE TABLE public.marketing_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  platform_label text NOT NULL,
  connected boolean NOT NULL DEFAULT false,
  access_token text,
  refresh_token text,
  token_expires_at timestamptz,
  account_id text,
  account_name text,
  scopes text[],
  metadata jsonb DEFAULT '{}'::jsonb,
  connected_by uuid REFERENCES public.profiles(id),
  connected_at timestamptz,
  disconnected_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(platform)
);

ALTER TABLE public.marketing_integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access on marketing_integrations"
  ON public.marketing_integrations FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE TRIGGER set_updated_at_marketing_integrations
  BEFORE UPDATE ON public.marketing_integrations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER audit_marketing_integrations
  AFTER INSERT OR UPDATE OR DELETE ON public.marketing_integrations
  FOR EACH ROW EXECUTE FUNCTION public.audit_log_trigger();
