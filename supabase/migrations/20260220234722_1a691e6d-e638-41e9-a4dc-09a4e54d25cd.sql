
-- Add new columns to blog_posts for full CMS functionality
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS slug text UNIQUE,
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS meta_title text,
  ADD COLUMN IF NOT EXISTS meta_description text,
  ADD COLUMN IF NOT EXISTS pinned boolean DEFAULT false;

-- Create index on slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);

-- Create index on tags for search
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON public.blog_posts USING GIN(tags);

-- Create index on pinned for filtering
CREATE INDEX IF NOT EXISTS idx_blog_posts_pinned ON public.blog_posts(pinned);

-- Update existing posts to have a slug based on title
UPDATE public.blog_posts
SET slug = lower(regexp_replace(regexp_replace(title, '[^a-zA-Z0-9æøåÆØÅ\s-]', '', 'g'), '\s+', '-', 'g'))
WHERE slug IS NULL;
