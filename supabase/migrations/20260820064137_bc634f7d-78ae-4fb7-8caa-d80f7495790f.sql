ALTER TABLE public.email_send_log
  ADD COLUMN IF NOT EXISTS batch_id uuid,
  ADD COLUMN IF NOT EXISTS batch_label text,
  ADD COLUMN IF NOT EXISTS scheduled_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_email_send_log_batch ON public.email_send_log (batch_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_send_log_message ON public.email_send_log (message_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.email_batch_progress(_limit integer DEFAULT 10)
RETURNS TABLE(
  batch_id uuid,
  batch_label text,
  started_at timestamptz,
  total bigint,
  sent bigint,
  failed bigint,
  pending bigint,
  next_scheduled_at timestamptz,
  last_scheduled_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH latest AS (
    SELECT DISTINCT ON (l.message_id)
      l.message_id, l.batch_id, l.batch_label, l.status, l.created_at, l.scheduled_at
    FROM public.email_send_log l
    WHERE l.batch_id IS NOT NULL
      AND public.is_employee_or_admin(auth.uid())
    ORDER BY l.message_id, l.created_at DESC
  ),
  first_seen AS (
    SELECT l.batch_id, min(l.created_at) AS started_at
    FROM public.email_send_log l
    WHERE l.batch_id IS NOT NULL
    GROUP BY l.batch_id
  )
  SELECT
    latest.batch_id,
    max(latest.batch_label) AS batch_label,
    max(first_seen.started_at) AS started_at,
    count(*)::bigint AS total,
    count(*) FILTER (WHERE latest.status = 'sent')::bigint AS sent,
    count(*) FILTER (WHERE latest.status IN ('dlq','failed','bounced'))::bigint AS failed,
    count(*) FILTER (WHERE latest.status = 'pending')::bigint AS pending,
    min(latest.scheduled_at) FILTER (WHERE latest.status = 'pending') AS next_scheduled_at,
    max(latest.scheduled_at) FILTER (WHERE latest.status = 'pending') AS last_scheduled_at
  FROM latest
  JOIN first_seen ON first_seen.batch_id = latest.batch_id
  GROUP BY latest.batch_id
  ORDER BY max(first_seen.started_at) DESC
  LIMIT greatest(1, coalesce(_limit, 10));
$$;

REVOKE ALL ON FUNCTION public.email_batch_progress(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.email_batch_progress(integer) TO authenticated, service_role;