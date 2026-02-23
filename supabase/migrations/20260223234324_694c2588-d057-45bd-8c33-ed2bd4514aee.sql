-- Table to store push subscription endpoints per user
CREATE TABLE public.push_subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  endpoint text NOT NULL,
  p256dh text NOT NULL,
  auth text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(profile_id, endpoint)
);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "PushSub: own insert" ON public.push_subscriptions
  FOR INSERT WITH CHECK (
    profile_id = (SELECT p.id FROM profiles p WHERE p.user_id = auth.uid() LIMIT 1)
  );

CREATE POLICY "PushSub: own read" ON public.push_subscriptions
  FOR SELECT USING (
    profile_id = (SELECT p.id FROM profiles p WHERE p.user_id = auth.uid() LIMIT 1)
  );

CREATE POLICY "PushSub: own delete" ON public.push_subscriptions
  FOR DELETE USING (
    profile_id = (SELECT p.id FROM profiles p WHERE p.user_id = auth.uid() LIMIT 1)
  );

CREATE POLICY "PushSub: service role full" ON public.push_subscriptions
  FOR ALL USING (true) WITH CHECK (true);

-- Trigger: when a notification is inserted, call the push edge function
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

CREATE TRIGGER on_notification_send_push
  AFTER INSERT ON public.workspace_notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_push_notification();
