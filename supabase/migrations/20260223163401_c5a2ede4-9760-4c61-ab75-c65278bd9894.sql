
-- Extend services table with full page content fields
ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS slug text,
ADD COLUMN IF NOT EXISTS meta_title text,
ADD COLUMN IF NOT EXISTS meta_description text,
ADD COLUMN IF NOT EXISTS category text,
ADD COLUMN IF NOT EXISTS hero_title text,
ADD COLUMN IF NOT EXISTS hero_subtitle text,
ADD COLUMN IF NOT EXISTS deliverables text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS why_items jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS related_services jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS cta_title text,
ADD COLUMN IF NOT EXISTS cta_subtitle text,
ADD COLUMN IF NOT EXISTS body_content text,
ADD COLUMN IF NOT EXISTS section text,
ADD COLUMN IF NOT EXISTS hero_image_url text;

-- Create unique index on slug
CREATE UNIQUE INDEX IF NOT EXISTS services_slug_unique ON public.services(slug) WHERE slug IS NOT NULL;

-- Extend industries table with missing page content fields
ALTER TABLE public.industries
ADD COLUMN IF NOT EXISTS slug text,
ADD COLUMN IF NOT EXISTS meta_title text,
ADD COLUMN IF NOT EXISTS meta_description text,
ADD COLUMN IF NOT EXISTS challenges jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS why_avargo jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS quote jsonb,
ADD COLUMN IF NOT EXISTS related_slugs jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS hero_image_url text;

CREATE UNIQUE INDEX IF NOT EXISTS industries_slug_unique ON public.industries(slug) WHERE slug IS NOT NULL;
