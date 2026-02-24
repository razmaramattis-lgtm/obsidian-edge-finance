
-- Table for Ava to learn which document to show for specific search terms
CREATE TABLE public.ava_document_overrides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  search_term TEXT NOT NULL,
  document_title TEXT NOT NULL,
  document_url TEXT,
  file_name TEXT,
  source_table TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES public.profiles(id),
  UNIQUE(search_term)
);

ALTER TABLE public.ava_document_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "AvaDocOverrides: admin full" ON public.ava_document_overrides FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "AvaDocOverrides: employee read" ON public.ava_document_overrides FOR SELECT USING (is_employee_or_admin());
