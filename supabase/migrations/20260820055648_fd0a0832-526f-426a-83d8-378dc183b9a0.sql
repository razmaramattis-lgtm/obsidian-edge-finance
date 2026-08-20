CREATE INDEX IF NOT EXISTS crm_leads_name_trgm_idx ON public.crm_leads USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS crm_leads_orgnr_trgm_idx ON public.crm_leads USING gin (orgnr gin_trgm_ops);
CREATE INDEX IF NOT EXISTS crm_leads_email_trgm_idx ON public.crm_leads USING gin (email gin_trgm_ops);
CREATE INDEX IF NOT EXISTS crm_leads_contact_trgm_idx ON public.crm_leads USING gin (contact_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS crm_leads_municipality_trgm_idx ON public.crm_leads USING gin (municipality gin_trgm_ops);
CREATE INDEX IF NOT EXISTS crm_leads_industry_text_trgm_idx ON public.crm_leads USING gin (industry_text gin_trgm_ops);
CREATE INDEX IF NOT EXISTS crm_leads_accountant_trgm_idx ON public.crm_leads USING gin (accountant_name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS crm_leads_org_form_idx ON public.crm_leads (org_form);
CREATE INDEX IF NOT EXISTS crm_leads_industry_code_idx ON public.crm_leads (industry_code text_pattern_ops);
CREATE INDEX IF NOT EXISTS crm_leads_employees_idx ON public.crm_leads (employees);
CREATE INDEX IF NOT EXISTS crm_leads_email_count_idx ON public.crm_leads (email_count);
CREATE INDEX IF NOT EXISTS crm_leads_email_notnull_idx ON public.crm_leads (registered_at DESC) WHERE email IS NOT NULL;

CREATE OR REPLACE FUNCTION public.crm_municipalities()
RETURNS TABLE(municipality text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH RECURSIVE t AS (
    (SELECT l.municipality AS m FROM public.crm_leads l WHERE l.municipality IS NOT NULL ORDER BY l.municipality LIMIT 1)
    UNION ALL
    (SELECT (SELECT l.municipality FROM public.crm_leads l
             WHERE l.municipality > t.m ORDER BY l.municipality LIMIT 1)
     FROM t WHERE t.m IS NOT NULL)
  )
  SELECT m FROM t WHERE m IS NOT NULL ORDER BY m;
$$;

REVOKE ALL ON FUNCTION public.crm_municipalities() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.crm_municipalities() TO authenticated, service_role;