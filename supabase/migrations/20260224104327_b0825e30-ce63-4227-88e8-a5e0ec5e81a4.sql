
-- Create storage bucket for CV uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('cv-uploads', 'cv-uploads', false);

-- Anyone can upload a CV
CREATE POLICY "cv_upload_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cv-uploads');

-- Admins and employees can read CVs
CREATE POLICY "cv_upload_select" ON storage.objects FOR SELECT USING (bucket_id = 'cv-uploads' AND (SELECT is_employee_or_admin()));

-- Admins can delete CVs
CREATE POLICY "cv_upload_delete" ON storage.objects FOR DELETE USING (bucket_id = 'cv-uploads' AND (SELECT is_admin()));
