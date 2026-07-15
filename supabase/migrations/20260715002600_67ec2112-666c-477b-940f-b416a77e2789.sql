
-- 1) Revoke EXECUTE from anon/PUBLIC on SECURITY DEFINER helpers that shouldn't be callable anonymously.
-- Trigger-only functions: revoke from all callable roles
REVOKE EXECUTE ON FUNCTION public.trigger_push_notification() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_admins_on_event() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.audit_log_trigger() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- Internal RLS helpers: revoke from anon and PUBLIC (used only server-side by RLS on authenticated queries)
REVOKE EXECUTE ON FUNCTION public.is_dm_participant(uuid, uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_customer(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_employee_or_admin(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.current_profile_id(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.own_company_id(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.customer_can_read_advisor(uuid, uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_advisor_unavailability(uuid[]) FROM PUBLIC, anon;

-- list_public_advisors exposes only advisor names/ids for public booking; keep executable
-- but restrict from PUBLIC catch-all (authenticated + anon still allowed explicitly).
REVOKE EXECUTE ON FUNCTION public.list_public_advisors() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.list_public_advisors() TO anon, authenticated;

-- 2) Topic-scoped realtime.messages policies
CREATE OR REPLACE FUNCTION public.realtime_topic_allowed()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  t text := realtime.topic();
  pid uuid;
BEGIN
  IF auth.uid() IS NULL OR t IS NULL OR t = '' THEN
    RETURN false;
  END IF;

  pid := public.current_profile_id(auth.uid());

  -- Global presence channel: any authenticated user with a profile
  IF t = 'workspace-presence' THEN
    RETURN pid IS NOT NULL;
  END IF;

  -- 1:1 call signaling channels contain both profile IDs sorted:
  --   call-{profileA}-{profileB}   or   listen-call-{profileA}-{profileB}
  -- Require caller's profile id to appear in the topic string.
  IF t LIKE 'call-%' OR t LIKE 'listen-call-%' THEN
    RETURN pid IS NOT NULL AND position(pid::text in t) > 0;
  END IF;

  -- Conference call rooms: conf-{advisory_session_id} — restrict to authenticated with profile
  IF t LIKE 'conf-%' THEN
    RETURN pid IS NOT NULL;
  END IF;

  -- Default deny for any other topic
  RETURN false;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.realtime_topic_allowed() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.realtime_topic_allowed() TO authenticated;

DROP POLICY IF EXISTS "Realtime: authenticated broadcast" ON realtime.messages;
DROP POLICY IF EXISTS "Realtime: authenticated subscribe" ON realtime.messages;

CREATE POLICY "Realtime: topic-scoped subscribe"
  ON realtime.messages
  FOR SELECT
  TO authenticated
  USING (public.realtime_topic_allowed());

CREATE POLICY "Realtime: topic-scoped broadcast"
  ON realtime.messages
  FOR INSERT
  TO authenticated
  WITH CHECK (public.realtime_topic_allowed());
