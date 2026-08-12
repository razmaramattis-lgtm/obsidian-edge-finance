CREATE TABLE IF NOT EXISTS public.crm_import_state (
  id integer PRIMARY KEY DEFAULT 1,
  status text NOT NULL DEFAULT 'idle',
  processed bigint NOT NULL DEFAULT 0,
  imported bigint NOT NULL DEFAULT 0,
  error_message text,
  started_at timestamptz,
  last_run_at timestamptz,
  finished_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.crm_import_state TO authenticated;
GRANT ALL ON public.crm_import_state TO service_role;

ALTER TABLE public.crm_import_state ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff can view import state" ON public.crm_import_state;
CREATE POLICY "Staff can view import state" ON public.crm_import_state
FOR SELECT TO authenticated
USING (public.is_employee_or_admin(auth.uid()));

INSERT INTO public.crm_import_state (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

SELECT cron.unschedule('crm-brreg-bulk-import') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'crm-brreg-bulk-import');

SELECT cron.schedule(
  'crm-brreg-bulk-import',
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://zgujpuxizstchqgdzwng.supabase.co/functions/v1/crm-brreg-bulk-import',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Lovable-Context', 'cron',
      'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'email_queue_service_role_key')
    ),
    body := '{"mode":"resume"}'::jsonb,
    timeout_milliseconds := 250000
  );
  $$
);