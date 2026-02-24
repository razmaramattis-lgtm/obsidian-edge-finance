
-- Allow anyone to SELECT from cv-uploads (needed to generate signed URLs after upload)
DROP POLICY IF EXISTS "cv_upload_select" ON storage.objects;
CREATE POLICY "cv_upload_select" ON storage.objects
  FOR SELECT USING (bucket_id = 'cv-uploads');
