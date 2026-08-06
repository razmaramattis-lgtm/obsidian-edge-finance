-- 1) Scoped public INSERT policies for public-facing forms

CREATE POLICY "Bookings: public submit" ON public.bookings
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    status = 'pending'
    AND customer_name <> ''
    AND customer_email <> ''
    AND booking_date >= (CURRENT_DATE - INTERVAL '1 day')
  );

CREATE POLICY "ContactSub: public submit" ON public.contact_submissions
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    status = 'new'
  );

CREATE POLICY "JobApp: public submit" ON public.job_applications
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    status = 'ny'
    AND admin_note IS NULL
    AND full_name <> ''
    AND email <> ''
  );

CREATE POLICY "OpenApp: public submit" ON public.open_applications
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    status = 'ny'
    AND admin_note IS NULL
    AND full_name <> ''
    AND email <> ''
  );

-- 2) Scope CV uploads to a dedicated folder + allowed document types
DROP POLICY IF EXISTS "cv_upload_insert" ON storage.objects;
CREATE POLICY "cv_upload_insert" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    bucket_id = 'cv-uploads'
    AND (storage.foldername(name))[1] = 'applications'
    AND array_length(storage.foldername(name), 1) = 1
    AND lower(name) ~ '^applications/[a-z0-9-]{10,}\.(pdf|doc|docx)$'
  );

-- 3) Push trigger must authenticate with the service role key, not the anon key
CREATE OR REPLACE FUNCTION public.trigger_push_notification()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  PERFORM net.http_post(
    url := 'https://zgujpuxizstchqgdzwng.supabase.co/functions/v1/send-push',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (
        SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'email_queue_service_role_key'
      )
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
$function$;