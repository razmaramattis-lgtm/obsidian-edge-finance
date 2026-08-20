CREATE INDEX IF NOT EXISTS idx_crm_leads_registered_at_desc ON public.crm_leads (registered_at DESC NULLS LAST, id);
CREATE INDEX IF NOT EXISTS idx_crm_leads_category ON public.crm_leads (category);
CREATE INDEX IF NOT EXISTS idx_crm_leads_status ON public.crm_leads (status);
CREATE INDEX IF NOT EXISTS idx_crm_leads_org_form ON public.crm_leads (org_form);
CREATE INDEX IF NOT EXISTS idx_crm_leads_orgnr ON public.crm_leads (orgnr text_pattern_ops);
ANALYZE public.crm_leads;