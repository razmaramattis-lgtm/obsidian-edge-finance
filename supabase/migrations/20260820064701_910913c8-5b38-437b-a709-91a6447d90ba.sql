
CREATE TABLE IF NOT EXISTS public.email_batches (
  batch_id uuid PRIMARY KEY,
  label text,
  status text NOT NULL DEFAULT 'running',
  paused_at timestamptz,
  paused_seconds integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.email_batches TO authenticated;
GRANT ALL ON public.email_batches TO service_role;
ALTER TABLE public.email_batches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff manage email batches" ON public.email_batches;
CREATE POLICY "Staff manage email batches" ON public.email_batches
  FOR ALL TO authenticated
  USING (public.is_employee_or_admin(auth.uid()))
  WITH CHECK (public.is_employee_or_admin(auth.uid()));

CREATE OR REPLACE FUNCTION public.email_batch_set_paused(_batch_id uuid, _paused boolean)
RETURNS public.email_batches
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result public.email_batches;
BEGIN
  IF NOT public.is_employee_or_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;

  INSERT INTO public.email_batches (batch_id, label, status)
  VALUES (
    _batch_id,
    (SELECT max(batch_label) FROM public.email_send_log WHERE batch_id = _batch_id),
    CASE WHEN _paused THEN 'paused' ELSE 'running' END
  )
  ON CONFLICT (batch_id) DO NOTHING;

  IF _paused THEN
    UPDATE public.email_batches
      SET status = 'paused', paused_at = COALESCE(paused_at, now()), updated_at = now()
      WHERE batch_id = _batch_id
      RETURNING * INTO result;
  ELSE
    UPDATE public.email_batches
      SET status = 'running',
          paused_seconds = paused_seconds + COALESCE(EXTRACT(EPOCH FROM (now() - paused_at))::int, 0),
          paused_at = NULL,
          updated_at = now()
      WHERE batch_id = _batch_id
      RETURNING * INTO result;
  END IF;

  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.email_batch_set_paused(uuid, boolean) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.email_batch_set_paused(uuid, boolean) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.defer_email(queue_name text, message_id bigint, vt_seconds integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM pgmq.set_vt(queue_name, message_id, vt_seconds);
  RETURN true;
EXCEPTION WHEN OTHERS THEN
  RETURN false;
END;
$$;

REVOKE ALL ON FUNCTION public.defer_email(text, bigint, integer) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.defer_email(text, bigint, integer) TO service_role;

CREATE OR REPLACE FUNCTION public.requeue_failed_batch(_batch_id uuid, _limit integer DEFAULT 500)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rec record;
  payload jsonb;
  new_message_id uuid;
  requeued integer := 0;
BEGIN
  IF NOT public.is_employee_or_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;

  FOR rec IN
    SELECT * FROM pgmq.read('transactional_emails_dlq', 30, GREATEST(1, COALESCE(_limit, 500)))
  LOOP
    payload := rec.message;
    IF payload->>'batch_id' IS DISTINCT FROM _batch_id::text THEN
      CONTINUE;
    END IF;

    new_message_id := gen_random_uuid();

    UPDATE public.email_send_log
      SET status = 'retried'
      WHERE message_id = payload->>'message_id'
        AND status IN ('dlq', 'failed');

    payload := payload || jsonb_build_object(
      'message_id', new_message_id::text,
      'queued_at', to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
      'scheduled_at', to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
      'retry_of', payload->>'message_id'
    );

    PERFORM pgmq.send('transactional_emails', payload);

    INSERT INTO public.email_send_log (message_id, template_name, recipient_email, status, batch_id, batch_label, scheduled_at)
    VALUES (
      new_message_id::text,
      COALESCE(payload->>'label', 'retry'),
      payload->>'to',
      'pending',
      _batch_id,
      (SELECT max(batch_label) FROM public.email_send_log WHERE batch_id = _batch_id),
      now()
    );

    PERFORM pgmq.delete('transactional_emails_dlq', rec.msg_id);
    requeued := requeued + 1;
  END LOOP;

  RETURN requeued;
END;
$$;

REVOKE ALL ON FUNCTION public.requeue_failed_batch(uuid, integer) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.requeue_failed_batch(uuid, integer) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.email_batch_errors(_batch_id uuid, _limit integer DEFAULT 200)
RETURNS TABLE(recipient_email text, status text, error_message text, attempts bigint, last_attempt_at timestamptz)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT l.recipient_email,
         (array_agg(l.status ORDER BY l.created_at DESC))[1],
         (array_agg(l.error_message ORDER BY l.created_at DESC) FILTER (WHERE l.error_message IS NOT NULL))[1],
         count(*)::bigint,
         max(l.created_at)
  FROM public.email_send_log l
  WHERE l.batch_id = _batch_id
    AND l.status IN ('failed', 'dlq', 'bounced', 'rate_limited', 'suppressed', 'retried')
    AND public.is_employee_or_admin(auth.uid())
  GROUP BY l.recipient_email
  ORDER BY max(l.created_at) DESC
  LIMIT GREATEST(1, COALESCE(_limit, 200));
$$;

REVOKE ALL ON FUNCTION public.email_batch_errors(uuid, integer) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.email_batch_errors(uuid, integer) TO authenticated, service_role;

DROP FUNCTION IF EXISTS public.email_batch_progress(integer);

CREATE FUNCTION public.email_batch_progress(_limit integer DEFAULT 10)
RETURNS TABLE(batch_id uuid, batch_label text, started_at timestamptz, total bigint, sent bigint, failed bigint, pending bigint, next_scheduled_at timestamptz, last_scheduled_at timestamptz, status text, paused_seconds integer)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH batches AS (
    SELECT l.batch_id, max(l.batch_label) AS batch_label,
           min(l.created_at) AS started_at, max(l.scheduled_at) AS last_scheduled_at
    FROM public.email_send_log l
    WHERE l.batch_id IS NOT NULL
      AND l.created_at > now() - interval '14 days'
      AND public.is_employee_or_admin(auth.uid())
    GROUP BY l.batch_id
    ORDER BY min(l.created_at) DESC
    LIMIT greatest(1, coalesce(_limit, 10))
  ),
  members AS (
    SELECT DISTINCT l.batch_id, l.message_id, l.scheduled_at
    FROM public.email_send_log l
    JOIN batches b ON b.batch_id = l.batch_id
    WHERE l.batch_id IS NOT NULL
  ),
  latest AS (
    SELECT DISTINCT ON (l.message_id) l.message_id, l.status
    FROM public.email_send_log l
    JOIN members m ON m.message_id = l.message_id
    ORDER BY l.message_id, l.created_at DESC
  )
  SELECT
    b.batch_id,
    b.batch_label,
    b.started_at,
    count(*)::bigint,
    count(*) FILTER (WHERE latest.status = 'sent')::bigint,
    count(*) FILTER (WHERE latest.status IN ('dlq','failed','bounced'))::bigint,
    count(*) FILTER (WHERE latest.status NOT IN ('sent','dlq','failed','bounced'))::bigint,
    min(m.scheduled_at) FILTER (WHERE latest.status NOT IN ('sent','dlq','failed','bounced')),
    b.last_scheduled_at,
    COALESCE(eb.status, 'running'),
    COALESCE(eb.paused_seconds, 0)
  FROM members m
  JOIN batches b ON b.batch_id = m.batch_id
  JOIN latest ON latest.message_id = m.message_id
  LEFT JOIN public.email_batches eb ON eb.batch_id = b.batch_id
  WHERE latest.status <> 'retried'
  GROUP BY b.batch_id, b.batch_label, b.started_at, b.last_scheduled_at, eb.status, eb.paused_seconds
  ORDER BY b.started_at DESC;
$$;
