
-- Add visibility column with three levels: 'public', 'customer', 'internal'
ALTER TABLE public.archive_files
ADD COLUMN visibility text NOT NULL DEFAULT 'public';

-- Migrate existing data: active=true -> 'public', active=false -> 'internal'
UPDATE public.archive_files SET visibility = CASE WHEN active = true THEN 'public' ELSE 'internal' END;
