ALTER TABLE public.crm_leads
  ADD COLUMN IF NOT EXISTS contacted_at timestamptz,
  ADD COLUMN IF NOT EXISTS email_source text,
  ADD COLUMN IF NOT EXISTS enriched_at timestamptz,
  ADD COLUMN IF NOT EXISTS enrich_status text,
  ADD COLUMN IF NOT EXISTS manual_lock boolean NOT NULL DEFAULT false;

UPDATE public.crm_leads SET email_source = 'brreg' WHERE email IS NOT NULL AND email_source IS NULL;
UPDATE public.crm_leads SET contacted_at = last_emailed_at WHERE last_emailed_at IS NOT NULL AND contacted_at IS NULL;

CREATE INDEX IF NOT EXISTS crm_leads_enriched_at_idx ON public.crm_leads (enriched_at);
CREATE INDEX IF NOT EXISTS crm_leads_category_status_idx ON public.crm_leads (category, status);