
-- Strategy plans for long-term marketing
CREATE TABLE public.marketing_strategy_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  platforms TEXT[] NOT NULL DEFAULT '{}',
  goals JSONB DEFAULT '{}',
  weekly_posts JSONB DEFAULT '[]',
  weekly_campaigns JSONB DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'draft',
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.marketing_strategy_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and employees can manage strategy plans"
  ON public.marketing_strategy_plans FOR ALL
  TO authenticated
  USING (public.is_employee_or_admin(auth.uid()))
  WITH CHECK (public.is_employee_or_admin(auth.uid()));

-- Add image_url column to marketing_posts for AI-generated images
ALTER TABLE public.marketing_posts ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.marketing_posts ADD COLUMN IF NOT EXISTS image_prompt TEXT;
ALTER TABLE public.marketing_posts ADD COLUMN IF NOT EXISTS ai_generated BOOLEAN DEFAULT false;
ALTER TABLE public.marketing_posts ADD COLUMN IF NOT EXISTS strategy_plan_id UUID REFERENCES public.marketing_strategy_plans(id);

-- Add trigger for updated_at
CREATE TRIGGER update_marketing_strategy_plans_updated_at
  BEFORE UPDATE ON public.marketing_strategy_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
