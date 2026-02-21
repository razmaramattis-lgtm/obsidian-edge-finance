
CREATE TABLE public.knowledge_materials (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  content text,
  category text DEFAULT 'Generelt',
  active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.knowledge_materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "KnowledgeMat: admin insert" ON public.knowledge_materials FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "KnowledgeMat: admin update" ON public.knowledge_materials FOR UPDATE USING (is_admin());
CREATE POLICY "KnowledgeMat: admin delete" ON public.knowledge_materials FOR DELETE USING (is_admin());
CREATE POLICY "KnowledgeMat: employee read" ON public.knowledge_materials FOR SELECT USING (is_employee_or_admin());

CREATE TRIGGER update_knowledge_materials_updated_at
  BEFORE UPDATE ON public.knowledge_materials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
