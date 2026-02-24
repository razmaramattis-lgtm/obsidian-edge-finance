
-- Enable pg_net extension for HTTP calls from triggers
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Recreate trigger function using extensions.http_post
CREATE OR REPLACE FUNCTION public.trigger_push_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  PERFORM net.http_post(
    url := current_setting('app.settings.supabase_url', true) || '/functions/v1/send-push',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := jsonb_build_object(
      'notification_id', NEW.id,
      'recipient_id', NEW.recipient_id,
      'title', COALESCE(NEW.title, 'Avargo'),
      'body', COALESCE(NEW.body, ''),
      'type', NEW.type,
      'reference_id', NEW.reference_id
    )
  );
  RETURN NEW;
END;
$$;
