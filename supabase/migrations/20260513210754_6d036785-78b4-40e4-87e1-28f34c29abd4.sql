
-- 1) Remove sensitive tables from realtime publication
ALTER PUBLICATION supabase_realtime DROP TABLE public.advisory_sessions;
ALTER PUBLICATION supabase_realtime DROP TABLE public.push_subscriptions;

-- 2) Restrict CV uploads SELECT to admin/employee only
DROP POLICY IF EXISTS cv_upload_select ON storage.objects;
CREATE POLICY cv_upload_select ON storage.objects
  FOR SELECT
  USING (bucket_id = 'cv-uploads' AND public.is_employee_or_admin());

-- Also restrict CV uploads INSERT to authenticated users only (was wide open)
DROP POLICY IF EXISTS cv_upload_insert ON storage.objects;
CREATE POLICY cv_upload_insert ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'cv-uploads');
-- (keep insert open for anonymous applicants — they need to upload CVs)

-- 3) Restrict workspace-uploads DELETE to file owner or admin
DROP POLICY IF EXISTS "Users can delete own workspace files" ON storage.objects;
CREATE POLICY "Users can delete own workspace files" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'workspace-uploads'
    AND (
      public.is_admin()
      OR EXISTS (
        SELECT 1 FROM public.group_files gf
        WHERE gf.file_url LIKE '%' || storage.objects.name
          AND gf.uploaded_by = public.current_profile_id(auth.uid())
      )
      OR (storage.foldername(name))[1] = (public.current_profile_id(auth.uid()))::text
    )
  );

-- 4) Add INSERT policy for account_feedback (public submissions allowed, rate-limited by app)
CREATE POLICY "AccountFeedback: public insert" ON public.account_feedback
  FOR INSERT
  WITH CHECK (
    char_length(search_term) BETWEEN 1 AND 200
    AND (message IS NULL OR char_length(message) <= 2000)
    AND status = 'new'
  );

-- 5) Restrict sms_devices to admin only (api_key is sensitive)
DROP POLICY IF EXISTS "SmsDevices: employee read" ON public.sms_devices;
-- admin full policy already exists

-- 6) Restrict group_message_reads SELECT to group members
DROP POLICY IF EXISTS "Users can view reads" ON public.group_message_reads;
CREATE POLICY "Group members can view reads" ON public.group_message_reads
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.workspace_group_messages gm
      JOIN public.workspace_group_members gmem ON gmem.group_id = gm.group_id
      WHERE gm.id = group_message_reads.message_id
        AND gmem.profile_id = public.current_profile_id(auth.uid())
        AND gmem.status = 'active'
    )
  );

-- 7) Restrict group_message_reactions SELECT to group members
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
        AND gmem.status = 'active'
    )
  );
