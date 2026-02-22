
-- Kontohjelp: account entries
CREATE TABLE public.account_entries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  account_number text NOT NULL,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  examples text,
  category_group text,
  business_types text[] NOT NULL DEFAULT '{AS}',
  mva_status text NOT NULL DEFAULT 'med_mva',
  active boolean NOT NULL DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.account_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "AccountEntries: public read active" ON public.account_entries
  FOR SELECT USING ((active = true) OR is_admin());

CREATE POLICY "AccountEntries: admin insert" ON public.account_entries
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "AccountEntries: admin update" ON public.account_entries
  FOR UPDATE USING (is_admin());

CREATE POLICY "AccountEntries: admin delete" ON public.account_entries
  FOR DELETE USING (is_admin());

CREATE INDEX idx_account_entries_slug ON public.account_entries(slug);
CREATE INDEX idx_account_entries_account_number ON public.account_entries(account_number);
CREATE INDEX idx_account_entries_business_types ON public.account_entries USING GIN(business_types);

-- Regnskapsord: glossary terms
CREATE TABLE public.glossary_terms (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  term text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  active boolean NOT NULL DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.glossary_terms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "GlossaryTerms: public read active" ON public.glossary_terms
  FOR SELECT USING ((active = true) OR is_admin());

CREATE POLICY "GlossaryTerms: admin insert" ON public.glossary_terms
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "GlossaryTerms: admin update" ON public.glossary_terms
  FOR UPDATE USING (is_admin());

CREATE POLICY "GlossaryTerms: admin delete" ON public.glossary_terms
  FOR DELETE USING (is_admin());

CREATE INDEX idx_glossary_terms_slug ON public.glossary_terms(slug);

-- Triggers for updated_at
CREATE TRIGGER update_account_entries_updated_at
  BEFORE UPDATE ON public.account_entries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_glossary_terms_updated_at
  BEFORE UPDATE ON public.glossary_terms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
