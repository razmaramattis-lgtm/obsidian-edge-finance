
-- Table for Ava to learn which account to show for specific search terms
CREATE TABLE public.ava_account_overrides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  search_term TEXT NOT NULL,
  preferred_account_number TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES public.profiles(id),
  UNIQUE(search_term)
);

ALTER TABLE public.ava_account_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "AvaOverrides: admin full" ON public.ava_account_overrides FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "AvaOverrides: employee read" ON public.ava_account_overrides FOR SELECT USING (is_employee_or_admin());
