-- Create archive_categories table for dynamic categories
CREATE TABLE public.archive_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.archive_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ArchiveCat: public read" ON public.archive_categories FOR SELECT USING (true);
CREATE POLICY "ArchiveCat: admin insert" ON public.archive_categories FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "ArchiveCat: admin update" ON public.archive_categories FOR UPDATE USING (is_admin());
CREATE POLICY "ArchiveCat: admin delete" ON public.archive_categories FOR DELETE USING (is_admin());

-- Seed default categories
INSERT INTO public.archive_categories (name, sort_order) VALUES
  ('Regnskap', 0),
  ('Avstemminger', 1),
  ('Bil & Kjøretøy', 2),
  ('Investeringsanalyse', 3),
  ('Skatt & MVA', 4),
  ('HMS', 5),
  ('Generelt', 6);
