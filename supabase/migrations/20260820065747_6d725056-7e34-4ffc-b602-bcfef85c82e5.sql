SET statement_timeout = '30min';

ALTER TABLE public.crm_leads
  ADD COLUMN IF NOT EXISTS search_text text
  GENERATED ALWAYS AS (
    coalesce(name,'') || ' ' || coalesce(orgnr,'') || ' ' || coalesce(email,'') || ' ' ||
    coalesce(contact_name,'') || ' ' || coalesce(ceo_name,'') || ' ' || coalesce(municipality,'') || ' ' ||
    coalesce(industry_text,'') || ' ' || coalesce(accountant_name,'') || ' ' || coalesce(postal_area,'')
  ) STORED;

CREATE INDEX IF NOT EXISTS crm_leads_search_text_trgm_idx ON public.crm_leads USING gin (search_text gin_trgm_ops);

DROP INDEX IF EXISTS public.crm_leads_registered_idx;
DROP INDEX IF EXISTS public.crm_leads_category_idx;
DROP INDEX IF EXISTS public.crm_leads_status_idx;
DROP INDEX IF EXISTS public.crm_leads_org_form_idx;
DROP INDEX IF EXISTS public.crm_leads_email_trgm_idx;
DROP INDEX IF EXISTS public.crm_leads_contact_trgm_idx;
DROP INDEX IF EXISTS public.crm_leads_municipality_trgm_idx;

CREATE INDEX IF NOT EXISTS crm_leads_fin_missing_idx
  ON public.crm_leads (registered_at DESC) WHERE financials_fetched_at IS NULL;