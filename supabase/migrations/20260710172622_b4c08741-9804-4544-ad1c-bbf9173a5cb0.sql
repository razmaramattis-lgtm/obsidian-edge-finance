
-- =========================================================
-- 1. chat_messages: drop over-broad "authenticated" policies
-- =========================================================
DROP POLICY IF EXISTS "ChatMsg: authenticated insert" ON public.chat_messages;
DROP POLICY IF EXISTS "ChatMsg: authenticated read" ON public.chat_messages;

-- =========================================================
-- 2. group_message_reactions: fix broken status filter
-- =========================================================
DROP POLICY IF EXISTS "GrpReaction: read" ON public.group_message_reactions;
CREATE POLICY "GrpReaction: read" ON public.group_message_reactions
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.workspace_group_messages gm
    JOIN public.workspace_group_members gmem ON gmem.group_id = gm.group_id
    WHERE gm.id = group_message_reactions.message_id
      AND gmem.profile_id = public.current_profile_id(auth.uid())
      AND gmem.status = 'approved'
  )
);

-- =========================================================
-- 3. group_message_reads: fix broken status filter
-- =========================================================
DROP POLICY IF EXISTS "Group members can view reads" ON public.group_message_reads;
CREATE POLICY "Group members can view reads" ON public.group_message_reads
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.workspace_group_messages gm
    JOIN public.workspace_group_members gmem ON gmem.group_id = gm.group_id
    WHERE gm.id = group_message_reads.message_id
      AND gmem.profile_id = public.current_profile_id(auth.uid())
      AND gmem.status = 'approved'
  )
);

-- =========================================================
-- 4. workspace_group_messages: require approved membership
-- =========================================================
DROP POLICY IF EXISTS "WsGroupMsg: read" ON public.workspace_group_messages;
CREATE POLICY "WsGroupMsg: read" ON public.workspace_group_messages
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND (
    EXISTS (
      SELECT 1 FROM public.workspace_group_members gmem
      WHERE gmem.group_id = workspace_group_messages.group_id
        AND gmem.profile_id = public.current_profile_id(auth.uid())
        AND gmem.status = 'approved'
    )
    OR EXISTS (
      SELECT 1 FROM public.workspace_groups g
      WHERE g.id = workspace_group_messages.group_id
        AND g.is_private = false
    )
    OR public.is_admin()
  )
);

-- =========================================================
-- 5. workspace_group_members: restrict self-joins to public groups
-- =========================================================
DROP POLICY IF EXISTS "WsGroupMembers: insert" ON public.workspace_group_members;
CREATE POLICY "WsGroupMembers: insert" ON public.workspace_group_members
FOR INSERT
WITH CHECK (
  public.is_admin()
  OR EXISTS (
    SELECT 1 FROM public.workspace_groups g
    WHERE g.id = workspace_group_members.group_id
      AND g.created_by = public.current_profile_id(auth.uid())
  )
  OR (
    profile_id = public.current_profile_id(auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.workspace_groups g
      WHERE g.id = workspace_group_members.group_id
        AND g.is_private = false
    )
  )
);

-- =========================================================
-- 6. SECURITY DEFINER function exposure
-- =========================================================

-- Trigger-only functions: no one should call them directly
REVOKE EXECUTE ON FUNCTION public.audit_log_trigger() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_admins_on_event() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.trigger_push_notification() FROM PUBLIC, anon, authenticated;

-- Helper functions used inside RLS policies: revoke anon; keep authenticated
REVOKE EXECUTE ON FUNCTION public.current_profile_id(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_customer(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_employee_or_admin(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_dm_participant(uuid, uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.own_company_id(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.customer_can_read_advisor(uuid, uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_advisor_unavailability(uuid[]) FROM PUBLIC, anon;

-- list_public_advisors intentionally callable pre-login on the booking page
-- (kept public); no revoke.

-- Also revoke authenticated on the pure-trigger + admin-only helpers where
-- signed-in clients never need to call them directly.
REVOKE EXECUTE ON FUNCTION public.get_advisor_unavailability(uuid[]) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.get_advisor_unavailability(uuid[]) TO service_role;

-- =========================================================
-- 7. Public storage buckets: prevent anonymous listing
-- =========================================================
DROP POLICY IF EXISTS "Anyone can view workspace files" ON storage.objects;
CREATE POLICY "Workspace files: authenticated list" ON storage.objects
FOR SELECT
USING (bucket_id = 'workspace-uploads' AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Archive storage: public read" ON storage.objects;
CREATE POLICY "Archive storage: authenticated list" ON storage.objects
FOR SELECT
USING (bucket_id = 'archive-files' AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Resources storage: public read" ON storage.objects;
CREATE POLICY "Resources storage: authenticated list" ON storage.objects
FOR SELECT
USING (bucket_id = 'resources' AND auth.uid() IS NOT NULL);

-- =========================================================
-- 8. Realtime: restrict channel subscriptions to signed-in users
-- =========================================================
ALTER TABLE IF EXISTS realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Realtime: authenticated subscribe" ON realtime.messages;
CREATE POLICY "Realtime: authenticated subscribe" ON realtime.messages
FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Realtime: authenticated broadcast" ON realtime.messages;
CREATE POLICY "Realtime: authenticated broadcast" ON realtime.messages
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);
