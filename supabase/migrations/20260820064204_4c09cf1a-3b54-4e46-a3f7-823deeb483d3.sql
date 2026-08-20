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
    b.last_scheduled_at
  FROM members m
  JOIN batches b ON b.batch_id = m.batch_id
  JOIN latest ON latest.message_id = m.message_id
  GROUP BY b.batch_id, b.batch_label, b.started_at, b.last_scheduled_at
  ORDER BY b.started_at DESC;
$$;

REVOKE ALL ON FUNCTION public.email_batch_progress(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.email_batch_progress(integer) TO authenticated, service_role;