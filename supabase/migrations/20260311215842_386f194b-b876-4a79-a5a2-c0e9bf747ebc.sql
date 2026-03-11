ALTER TABLE public.marketing_posts
  ADD COLUMN IF NOT EXISTS repost_at timestamptz,
  ADD COLUMN IF NOT EXISTS repost_interval_days integer DEFAULT 60,
  ADD COLUMN IF NOT EXISTS last_reposted_at timestamptz,
  ADD COLUMN IF NOT EXISTS repost_count integer DEFAULT 0;