ALTER TABLE public.glossary_terms 
  ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'regnskap';

ALTER TABLE public.glossary_terms 
  DROP CONSTRAINT IF EXISTS glossary_terms_category_check;
ALTER TABLE public.glossary_terms 
  ADD CONSTRAINT glossary_terms_category_check CHECK (category IN ('regnskap','hr','marked','it'));

CREATE INDEX IF NOT EXISTS glossary_terms_category_idx ON public.glossary_terms(category);