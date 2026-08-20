CREATE INDEX IF NOT EXISTS idx_crm_leads_email_notnull ON public.crm_leads (id) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_crm_leads_category ON public.crm_leads (category);
CREATE INDEX IF NOT EXISTS idx_crm_leads_email_count ON public.crm_leads (email_count) WHERE email_count > 0;
ANALYZE public.crm_leads;