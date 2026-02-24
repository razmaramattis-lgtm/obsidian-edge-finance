
-- Unique index on endpoint to prevent duplicate subscriptions
CREATE UNIQUE INDEX IF NOT EXISTS push_subscriptions_endpoint_key ON public.push_subscriptions (endpoint);

-- Trigger function: call send-push edge function when a notification is inserted
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

-- Trigger on workspace_notifications insert → fire push
DROP TRIGGER IF EXISTS trg_push_notification ON public.workspace_notifications;
CREATE TRIGGER trg_push_notification
  AFTER INSERT ON public.workspace_notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_push_notification();

-- Enable realtime for push_subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE public.push_subscriptions;
