
-- Fix workspace_notifications INSERT spoofing
DROP POLICY IF EXISTS "Authenticated users can insert notifications" ON public.workspace_notifications;
CREATE POLICY "Authenticated users can insert notifications"
ON public.workspace_notifications
FOR INSERT
TO authenticated
WITH CHECK (
  actor_id IS NULL
  OR actor_id = public.current_profile_id(auth.uid())
);

-- Restrict SECURITY DEFINER helpers so they are not callable via PostgREST RPC
-- Keep intentional public functions (list_public_advisors, get_advisor_unavailability handled elsewhere) unchanged.
REVOKE EXECUTE ON FUNCTION public.current_profile_id(uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.customer_can_read_advisor(uuid, uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.is_customer(uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.is_dm_participant(uuid, uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.is_employee_or_admin(uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.own_company_id(uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.realtime_topic_allowed() FROM anon, authenticated, public;

-- list_public_advisors is intentionally callable (public booking page). Keep as-is.
