SELECT cron.unschedule('crm-brreg-daily-sync') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'crm-brreg-daily-sync');
SELECT cron.unschedule('crm-autopilot-emails') WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'crm-autopilot-emails');

SELECT cron.schedule(
  'crm-brreg-daily-sync',
  '0 4 * * *',
  $$
  SELECT net.http_post(
    url := 'https://zgujpuxizstchqgdzwng.supabase.co/functions/v1/crm-brreg-sync',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Lovable-Context', 'cron',
      'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'email_queue_service_role_key')
    ),
    body := '{"mode":"daily"}'::jsonb
  );
  $$
);

SELECT cron.schedule(
  'crm-autopilot-emails',
  '0 9 * * *',
  $$
  SELECT net.http_post(
    url := 'https://zgujpuxizstchqgdzwng.supabase.co/functions/v1/crm-send-email',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Lovable-Context', 'cron',
      'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'email_queue_service_role_key')
    ),
    body := '{"mode":"autopilot"}'::jsonb
  );
  $$
);