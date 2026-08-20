CREATE TABLE IF NOT EXISTS public.crm_stats_cache (
  key text PRIMARY KEY,
  value bigint NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.crm_stats_cache TO authenticated;
GRANT ALL ON public.crm_stats_cache TO service_role;

ALTER TABLE public.crm_stats_cache ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Employees and admins can read crm stats" ON public.crm_stats_cache;
CREATE POLICY "Employees and admins can read crm stats"
  ON public.crm_stats_cache FOR SELECT TO authenticated
  USING (public.is_employee_or_admin(auth.uid()));

CREATE OR REPLACE FUNCTION public.refresh_crm_stats()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.crm_stats_cache (key, value, updated_at) VALUES
    ('total', (SELECT count(*) FROM public.crm_leads), now()),
    ('with_email', (SELECT count(*) FROM public.crm_leads WHERE email IS NOT NULL), now()),
    ('contacted', (SELECT count(*) FROM public.crm_leads WHERE email_count > 0), now()),
    ('new_business', (SELECT count(*) FROM public.crm_leads WHERE category = 'ny_bedrift'), now())
  ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();
END;
$$;

REVOKE EXECUTE ON FUNCTION public.refresh_crm_stats() FROM PUBLIC, anon, authenticated;

SELECT public.refresh_crm_stats();

SELECT cron.schedule('refresh-crm-stats', '*/10 * * * *', $cron$ SELECT public.refresh_crm_stats(); $cron$)
WHERE NOT EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'refresh-crm-stats');