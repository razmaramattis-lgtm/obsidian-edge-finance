ALTER TABLE public.crm_leads
  ADD COLUMN IF NOT EXISTS fiscal_year integer,
  ADD COLUMN IF NOT EXISTS revenue numeric,
  ADD COLUMN IF NOT EXISTS operating_result numeric,
  ADD COLUMN IF NOT EXISTS profit_before_tax numeric,
  ADD COLUMN IF NOT EXISTS net_result numeric,
  ADD COLUMN IF NOT EXISTS equity numeric,
  ADD COLUMN IF NOT EXISTS total_assets numeric,
  ADD COLUMN IF NOT EXISTS total_debt numeric,
  ADD COLUMN IF NOT EXISTS currency text,
  ADD COLUMN IF NOT EXISTS financials jsonb,
  ADD COLUMN IF NOT EXISTS financials_fetched_at timestamptz,
  ADD COLUMN IF NOT EXISTS ceo_name text,
  ADD COLUMN IF NOT EXISTS chair_name text,
  ADD COLUMN IF NOT EXISTS owners jsonb,
  ADD COLUMN IF NOT EXISTS company_summary text,
  ADD COLUMN IF NOT EXISTS social_links jsonb,
  ADD COLUMN IF NOT EXISTS scan_status text,
  ADD COLUMN IF NOT EXISTS scanned_at timestamptz;

CREATE INDEX IF NOT EXISTS crm_leads_financials_fetched_idx ON public.crm_leads (financials_fetched_at NULLS FIRST);