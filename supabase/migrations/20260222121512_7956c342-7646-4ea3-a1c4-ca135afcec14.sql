
ALTER TABLE public.industries
ADD COLUMN IF NOT EXISTS tagline text,
ADD COLUMN IF NOT EXISTS intro text,
ADD COLUMN IF NOT EXISTS body text,
ADD COLUMN IF NOT EXISTS deliverables text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS cta_headline text;
