
-- Update trigger to use hardcoded URL and anon key (send-push has verify_jwt=false)
CREATE OR REPLACE FUNCTION public.trigger_push_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://zgujpuxizstchqgdzwng.supabase.co/functions/v1/send-push',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpndWpwdXhpenN0Y2hxZ2R6d25nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MjcyMDEsImV4cCI6MjA4NzIwMzIwMX0.jQEtiZ10bY2KU7uJhIyADvBUtT7aSwwTI73-1Id4MBs'
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
