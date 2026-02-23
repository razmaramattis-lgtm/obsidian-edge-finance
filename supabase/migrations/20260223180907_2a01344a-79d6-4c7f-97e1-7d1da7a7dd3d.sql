-- Add image_url column to workspace_posts for image attachments
ALTER TABLE public.workspace_posts ADD COLUMN image_url text;

-- Create workspace-uploads storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('workspace-uploads', 'workspace-uploads', true);

-- Storage policies for workspace-uploads
CREATE POLICY "Authenticated users can upload workspace files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'workspace-uploads' AND auth.uid() IS NOT NULL);

CREATE POLICY "Anyone can view workspace files"
ON storage.objects FOR SELECT
USING (bucket_id = 'workspace-uploads');

CREATE POLICY "Users can delete own workspace files"
ON storage.objects FOR DELETE
USING (bucket_id = 'workspace-uploads' AND auth.uid() IS NOT NULL);