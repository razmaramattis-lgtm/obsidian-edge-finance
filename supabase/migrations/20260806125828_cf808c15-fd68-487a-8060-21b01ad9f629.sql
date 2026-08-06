DROP POLICY IF EXISTS "Workspace files: authenticated list" ON storage.objects;

CREATE POLICY "Workspace files: scoped read"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'workspace-uploads'
  AND (
    private_utils.is_admin()
    OR (storage.foldername(name))[1] = (private_utils.current_profile_id(auth.uid()))::text
    OR (
      (storage.foldername(name))[1] NOT IN ('groups', 'dms')
    )
    OR (
      (storage.foldername(name))[1] = 'groups'
      AND (
        EXISTS (
          SELECT 1 FROM public.group_files gf
          JOIN public.workspace_group_members m ON m.group_id = gf.group_id
          WHERE gf.file_url LIKE '%' || storage.objects.name
            AND m.profile_id = private_utils.current_profile_id(auth.uid())
            AND m.status = 'approved'
        )
        OR EXISTS (
          SELECT 1 FROM public.workspace_group_messages gm
          JOIN public.workspace_group_members m ON m.group_id = gm.group_id
          WHERE gm.file_url LIKE '%' || storage.objects.name
            AND m.profile_id = private_utils.current_profile_id(auth.uid())
            AND m.status = 'approved'
        )
        OR EXISTS (
          SELECT 1 FROM public.workspace_groups g
          WHERE (g.cover_url LIKE '%' || storage.objects.name OR g.avatar_url LIKE '%' || storage.objects.name)
        )
      )
    )
    OR (
      (storage.foldername(name))[1] = 'dms'
      AND EXISTS (
        SELECT 1 FROM public.dm_messages dm
        JOIN public.dm_conversations c ON c.id = dm.conversation_id
        WHERE dm.file_url LIKE '%' || storage.objects.name
          AND private_utils.current_profile_id(auth.uid()) IN (c.participant_1, c.participant_2)
      )
    )
  )
);