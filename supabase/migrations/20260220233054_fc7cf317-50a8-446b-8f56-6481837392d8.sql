-- Make internal-docs bucket public so getPublicUrl works for downloads
UPDATE storage.buckets SET public = true WHERE id = 'internal-docs';

-- Add update policy for internal-docs (missing)
CREATE POLICY "Internal storage: admin update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'internal-docs' AND is_admin());

-- Add update policy for resources (missing)  
CREATE POLICY "Resources storage: admin update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'resources' AND is_admin());
