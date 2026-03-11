
-- Marketing content analyses (crawled content from avargo.no)
CREATE TABLE public.marketing_content_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT,
  content_summary TEXT,
  keywords TEXT[],
  tone TEXT,
  themes TEXT[],
  raw_content TEXT,
  crawled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Marketing posts (generated posts for social media)
CREATE TABLE public.marketing_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  platform TEXT NOT NULL DEFAULT 'linkedin', -- linkedin, facebook, instagram, google_ads, meta_ads
  content TEXT NOT NULL,
  hashtags TEXT[],
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft', -- draft, pending_approval, approved, scheduled, published, rejected
  scheduled_at TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  rejected_reason TEXT,
  approved_by UUID REFERENCES public.profiles(id),
  created_by UUID REFERENCES public.profiles(id),
  source_analysis_id UUID REFERENCES public.marketing_content_analyses(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Marketing campaigns (Google Ads / Meta Ads)
CREATE TABLE public.marketing_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  platform TEXT NOT NULL DEFAULT 'google_ads', -- google_ads, meta_ads
  status TEXT NOT NULL DEFAULT 'draft', -- draft, active, paused, completed
  budget NUMERIC,
  budget_currency TEXT DEFAULT 'NOK',
  target_audience TEXT,
  headline TEXT,
  description TEXT,
  cta TEXT,
  start_date DATE,
  end_date DATE,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  spend NUMERIC DEFAULT 0,
  ctr NUMERIC DEFAULT 0,
  cpc NUMERIC DEFAULT 0,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Marketing performance metrics (two-way tracking)
CREATE TABLE public.marketing_performance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source TEXT NOT NULL, -- linkedin, facebook, instagram, google_ads, meta_ads
  source_type TEXT NOT NULL DEFAULT 'organic', -- organic, paid
  reference_id UUID, -- references post or campaign
  reference_type TEXT, -- post, campaign
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  impressions INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  video_views INTEGER DEFAULT 0,
  engagement_rate NUMERIC DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  leads INTEGER DEFAULT 0,
  spend NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- AI Marketing Brain insights
CREATE TABLE public.marketing_ai_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  insight_type TEXT NOT NULL, -- tone, cta, hashtag, timing, budget, audience
  platform TEXT,
  recommendation TEXT NOT NULL,
  confidence NUMERIC DEFAULT 0,
  based_on_posts INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.marketing_content_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_ai_insights ENABLE ROW LEVEL SECURITY;

-- Admin/employee full access
CREATE POLICY "Staff full access" ON public.marketing_content_analyses FOR ALL TO authenticated USING (public.is_employee_or_admin());
CREATE POLICY "Staff full access" ON public.marketing_posts FOR ALL TO authenticated USING (public.is_employee_or_admin());
CREATE POLICY "Staff full access" ON public.marketing_campaigns FOR ALL TO authenticated USING (public.is_employee_or_admin());
CREATE POLICY "Staff full access" ON public.marketing_performance FOR ALL TO authenticated USING (public.is_employee_or_admin());
CREATE POLICY "Staff full access" ON public.marketing_ai_insights FOR ALL TO authenticated USING (public.is_employee_or_admin());

-- Updated_at triggers
CREATE TRIGGER update_marketing_content_analyses_updated_at BEFORE UPDATE ON public.marketing_content_analyses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_marketing_posts_updated_at BEFORE UPDATE ON public.marketing_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_marketing_campaigns_updated_at BEFORE UPDATE ON public.marketing_campaigns FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_marketing_ai_insights_updated_at BEFORE UPDATE ON public.marketing_ai_insights FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Audit triggers for ISO 27001
CREATE TRIGGER audit_marketing_posts AFTER INSERT OR UPDATE OR DELETE ON public.marketing_posts FOR EACH ROW EXECUTE FUNCTION public.audit_log_trigger();
CREATE TRIGGER audit_marketing_campaigns AFTER INSERT OR UPDATE OR DELETE ON public.marketing_campaigns FOR EACH ROW EXECUTE FUNCTION public.audit_log_trigger();
