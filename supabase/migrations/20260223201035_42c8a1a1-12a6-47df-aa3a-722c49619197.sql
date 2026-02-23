
-- Add avatar and cover image to groups
ALTER TABLE public.workspace_groups
ADD COLUMN avatar_url TEXT,
ADD COLUMN cover_url TEXT;

-- Group files table for shared resources within groups
CREATE TABLE public.group_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.workspace_groups(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL DEFAULT 'file', -- 'file', 'image', 'resource'
  folder TEXT NOT NULL DEFAULT 'Generelt',
  file_size TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.group_files ENABLE ROW LEVEL SECURITY;

-- Members can view files in groups they belong to
CREATE POLICY "group_files_select" ON public.group_files
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.workspace_group_members
    WHERE workspace_group_members.group_id = group_files.group_id
    AND workspace_group_members.profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1)
    AND workspace_group_members.status = 'approved'
  )
);

-- Members can upload files
CREATE POLICY "group_files_insert" ON public.group_files
FOR INSERT WITH CHECK (
  uploaded_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1)
  AND EXISTS (
    SELECT 1 FROM public.workspace_group_members
    WHERE workspace_group_members.group_id = group_files.group_id
    AND workspace_group_members.profile_id = uploaded_by
    AND workspace_group_members.status = 'approved'
  )
);

-- Uploader or admin can delete
CREATE POLICY "group_files_delete" ON public.group_files
FOR DELETE USING (
  uploaded_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1)
  OR is_admin()
);

CREATE INDEX idx_group_files_group ON public.group_files(group_id);
