UPDATE public.crm_import_state
SET status = 'running', error_message = NULL, last_run_at = now() - interval '10 minutes'
WHERE id = 1;