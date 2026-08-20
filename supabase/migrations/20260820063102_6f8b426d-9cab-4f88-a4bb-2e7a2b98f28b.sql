ALTER TABLE public.email_send_state
  ADD COLUMN IF NOT EXISTS bulk_min_delay_seconds integer NOT NULL DEFAULT 300,
  ADD COLUMN IF NOT EXISTS bulk_max_delay_seconds integer NOT NULL DEFAULT 600;

CREATE OR REPLACE FUNCTION public.enqueue_email_delayed(queue_name text, payload jsonb, delay_seconds integer DEFAULT 0)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pgmq'
AS $function$
DECLARE
  d integer := GREATEST(COALESCE(delay_seconds, 0), 0);
BEGIN
  RETURN pgmq.send(queue_name, payload, d);
EXCEPTION WHEN undefined_table THEN
  PERFORM pgmq.create(queue_name);
  RETURN pgmq.send(queue_name, payload, d);
END;
$function$;

REVOKE ALL ON FUNCTION public.enqueue_email_delayed(text, jsonb, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.enqueue_email_delayed(text, jsonb, integer) TO service_role;