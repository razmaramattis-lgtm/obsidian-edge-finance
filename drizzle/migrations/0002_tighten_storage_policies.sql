DROP POLICY IF EXISTS "Authenticated users can upload workspace files" ON storage.objects;
CREATE POLICY "Authenticated users can upload workspace files" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'workspace-uploads' AND owner_id = (select auth.uid()::text));

DROP POLICY IF EXISTS "Archive storage: authenticated list" ON storage.objects;
CREATE POLICY "Archive storage: admin list" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'archive-files' AND private_utils.is_admin());

DROP POLICY IF EXISTS "Resources storage: authenticated list" ON storage.objects;
CREATE POLICY "Resources storage: admin list" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'resources' AND private_utils.is_admin());