SELECT cron.unschedule('crm-financials-backfill') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'crm-financials-backfill');

SELECT cron.schedule(
  'crm-financials-backfill',
  '*/2 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://zgujpuxizstchqgdzwng.supabase.co/functions/v1/crm-enrich-company',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Lovable-Context', 'cron',
      'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'email_queue_service_role_key')
    ),
    body := '{"limit":60,"skipWeb":true}'::jsonb,
    timeout_milliseconds := 110000
  );
  $$
);