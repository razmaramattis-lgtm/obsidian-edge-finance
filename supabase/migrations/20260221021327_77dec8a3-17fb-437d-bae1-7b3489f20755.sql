
-- Add content fields to courses table
ALTER TABLE public.courses ADD COLUMN slug text UNIQUE;
ALTER TABLE public.courses ADD COLUMN long_description text;
ALTER TABLE public.courses ADD COLUMN highlights jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.courses ADD COLUMN target_audience text;
ALTER TABLE public.courses ADD COLUMN duration text DEFAULT '2-3 timer';
ALTER TABLE public.courses ADD COLUMN meta_title text;
ALTER TABLE public.courses ADD COLUMN meta_description text;
