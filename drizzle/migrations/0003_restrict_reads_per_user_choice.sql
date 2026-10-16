DROP POLICY IF EXISTS "Anyone can read online advisors" ON public.advisor_online_status;
CREATE POLICY "Signed-in users can read online advisors" ON public.advisor_online_status
FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Courses: public read" ON public.courses;
CREATE POLICY "Courses: public read active" ON public.courses
FOR SELECT USING (active = true OR private_utils.is_employee_or_admin(auth.uid()));

DROP POLICY IF EXISTS "WsPosts: authenticated read" ON public.workspace_posts;
CREATE POLICY "WsPosts: staff read" ON public.workspace_posts
FOR SELECT TO authenticated USING (private_utils.is_employee_or_admin(auth.uid()));

DROP POLICY IF EXISTS "Workspace files: scoped read" ON storage.objects;
CREATE POLICY "Workspace files: scoped read" ON storage.objects
FOR SELECT TO authenticated
USING ((bucket_id = 'workspace-uploads'::text) AND (private_utils.is_admin() OR ((storage.foldername(name))[1] = (private_utils.current_profile_id(auth.uid()))::text) OR (((storage.foldername(name))[1] <> ALL (ARRAY['groups'::text, 'dms'::text])) AND (private_utils.is_employee_or_admin(auth.uid()) OR private_utils.is_customer(auth.uid()))) OR (((storage.foldername(name))[1] = 'groups'::text) AND ((EXISTS ( SELECT 1
   FROM (group_files gf
     JOIN workspace_group_members m ON ((m.group_id = gf.group_id)))
  WHERE ((gf.file_url ~~ ('%'::text || objects.name)) AND (m.profile_id = private_utils.current_profile_id(auth.uid())) AND (m.status = 'approved'::text)))) OR (EXISTS ( SELECT 1
   FROM (workspace_group_messages gm
     JOIN workspace_group_members m ON ((m.group_id = gm.group_id)))
  WHERE ((gm.file_url ~~ ('%'::text || objects.name)) AND (m.profile_id = private_utils.current_profile_id(auth.uid())) AND (m.status = 'approved'::text)))) OR (EXISTS ( SELECT 1
   FROM workspace_groups g
  WHERE ((g.cover_url ~~ ('%'::text || objects.name)) OR (g.avatar_url ~~ ('%'::text || objects.name))))))) OR (((storage.foldername(name))[1] = 'dms'::text) AND (EXISTS ( SELECT 1
   FROM (dm_messages dm
     JOIN dm_conversations c ON ((c.id = dm.conversation_id)))
  WHERE ((dm.file_url ~~ ('%'::text || objects.name)) AND ((private_utils.current_profile_id(auth.uid()) = c.participant_1) OR (private_utils.current_profile_id(auth.uid()) = c.participant_2))))))));