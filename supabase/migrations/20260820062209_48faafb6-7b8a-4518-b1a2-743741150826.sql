CREATE TABLE public.crm_saved_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  filters JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by UUID,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_saved_views TO authenticated;
GRANT ALL ON public.crm_saved_views TO service_role;

ALTER TABLE public.crm_saved_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff manage crm saved views"
ON public.crm_saved_views FOR ALL TO authenticated
USING (is_employee_or_admin(auth.uid()))
WITH CHECK (is_employee_or_admin(auth.uid()));

CREATE TRIGGER update_crm_saved_views_updated_at
BEFORE UPDATE ON public.crm_saved_views
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();