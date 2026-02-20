
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'employee');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  role app_role NOT NULL DEFAULT 'employee',
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Blog posts
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  excerpt TEXT,
  category TEXT DEFAULT 'Blogg',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Services
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'Briefcase',
  href TEXT,
  group_name TEXT DEFAULT 'Regnskap & Økonomi',
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Industries
CREATE TABLE public.industries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'Building2',
  href TEXT,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.industries ENABLE ROW LEVEL SECURITY;

-- Pricing plans
CREATE TABLE public.pricing_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price INTEGER NOT NULL DEFAULT 0,
  price_suffix TEXT DEFAULT '/mnd',
  description TEXT,
  features JSONB DEFAULT '[]',
  highlighted BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;

-- Archive files (public downloadable)
CREATE TABLE public.archive_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'Generelt',
  file_url TEXT,
  file_name TEXT,
  file_size TEXT,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.archive_files ENABLE ROW LEVEL SECURITY;

-- Resources (public templates)
CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'Maler',
  file_url TEXT,
  file_name TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- HMS documents (internal)
CREATE TABLE public.hms_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  file_url TEXT,
  file_name TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.hms_documents ENABLE ROW LEVEL SECURITY;

-- Internal resources
CREATE TABLE public.internal_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  file_name TEXT,
  category TEXT DEFAULT 'Generelt',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.internal_resources ENABLE ROW LEVEL SECURITY;

-- Collaboration agreements
CREATE TABLE public.collaboration_agreements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  partner TEXT,
  file_url TEXT,
  file_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.collaboration_agreements ENABLE ROW LEVEL SECURITY;

-- Chat categories
CREATE TABLE public.chat_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#6366f1',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_categories ENABLE ROW LEVEL SECURITY;

-- Chat messages
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.chat_categories(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Helper function: is_admin
CREATE OR REPLACE FUNCTION public.is_admin(uid UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = uid AND role = 'admin'
  );
$$;

-- Helper function: is_employee_or_admin
CREATE OR REPLACE FUNCTION public.is_employee_or_admin(uid UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = uid
  );
$$;

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_industries_updated_at BEFORE UPDATE ON public.industries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pricing_plans_updated_at BEFORE UPDATE ON public.pricing_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_archive_files_updated_at BEFORE UPDATE ON public.archive_files FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON public.resources FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_hms_documents_updated_at BEFORE UPDATE ON public.hms_documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_internal_resources_updated_at BEFORE UPDATE ON public.internal_resources FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_collaboration_agreements_updated_at BEFORE UPDATE ON public.collaboration_agreements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies: profiles
CREATE POLICY "Profiles: admin full access" ON public.profiles FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Profiles: own read" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Profiles: own update" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies: blog_posts
CREATE POLICY "Blog: public read published" ON public.blog_posts FOR SELECT USING (published = true OR public.is_admin());
CREATE POLICY "Blog: admin write" ON public.blog_posts FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Blog: admin update" ON public.blog_posts FOR UPDATE USING (public.is_admin());
CREATE POLICY "Blog: admin delete" ON public.blog_posts FOR DELETE USING (public.is_admin());

-- RLS Policies: services
CREATE POLICY "Services: public read" ON public.services FOR SELECT USING (true);
CREATE POLICY "Services: admin write" ON public.services FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Services: admin update" ON public.services FOR UPDATE USING (public.is_admin());
CREATE POLICY "Services: admin delete" ON public.services FOR DELETE USING (public.is_admin());

-- RLS Policies: industries
CREATE POLICY "Industries: public read" ON public.industries FOR SELECT USING (true);
CREATE POLICY "Industries: admin write" ON public.industries FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Industries: admin update" ON public.industries FOR UPDATE USING (public.is_admin());
CREATE POLICY "Industries: admin delete" ON public.industries FOR DELETE USING (public.is_admin());

-- RLS Policies: pricing_plans
CREATE POLICY "Pricing: public read" ON public.pricing_plans FOR SELECT USING (true);
CREATE POLICY "Pricing: admin write" ON public.pricing_plans FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Pricing: admin update" ON public.pricing_plans FOR UPDATE USING (public.is_admin());
CREATE POLICY "Pricing: admin delete" ON public.pricing_plans FOR DELETE USING (public.is_admin());

-- RLS Policies: archive_files
CREATE POLICY "Archive: public read" ON public.archive_files FOR SELECT USING (active = true OR public.is_admin());
CREATE POLICY "Archive: admin write" ON public.archive_files FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Archive: admin update" ON public.archive_files FOR UPDATE USING (public.is_admin());
CREATE POLICY "Archive: admin delete" ON public.archive_files FOR DELETE USING (public.is_admin());

-- RLS Policies: resources
CREATE POLICY "Resources: public read" ON public.resources FOR SELECT USING (active = true OR public.is_admin());
CREATE POLICY "Resources: admin write" ON public.resources FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Resources: admin update" ON public.resources FOR UPDATE USING (public.is_admin());
CREATE POLICY "Resources: admin delete" ON public.resources FOR DELETE USING (public.is_admin());

-- RLS Policies: hms_documents (internal only)
CREATE POLICY "HMS: employee read" ON public.hms_documents FOR SELECT USING (public.is_employee_or_admin());
CREATE POLICY "HMS: admin write" ON public.hms_documents FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "HMS: admin update" ON public.hms_documents FOR UPDATE USING (public.is_admin());
CREATE POLICY "HMS: admin delete" ON public.hms_documents FOR DELETE USING (public.is_admin());

-- RLS Policies: internal_resources
CREATE POLICY "InternalRes: employee read" ON public.internal_resources FOR SELECT USING (public.is_employee_or_admin());
CREATE POLICY "InternalRes: admin write" ON public.internal_resources FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "InternalRes: admin update" ON public.internal_resources FOR UPDATE USING (public.is_admin());
CREATE POLICY "InternalRes: admin delete" ON public.internal_resources FOR DELETE USING (public.is_admin());

-- RLS Policies: collaboration_agreements
CREATE POLICY "CollabAgr: employee read" ON public.collaboration_agreements FOR SELECT USING (public.is_employee_or_admin());
CREATE POLICY "CollabAgr: admin write" ON public.collaboration_agreements FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "CollabAgr: admin update" ON public.collaboration_agreements FOR UPDATE USING (public.is_admin());
CREATE POLICY "CollabAgr: admin delete" ON public.collaboration_agreements FOR DELETE USING (public.is_admin());

-- RLS Policies: chat_categories
CREATE POLICY "ChatCat: employee read" ON public.chat_categories FOR SELECT USING (public.is_employee_or_admin());
CREATE POLICY "ChatCat: admin write" ON public.chat_categories FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "ChatCat: admin update" ON public.chat_categories FOR UPDATE USING (public.is_admin());
CREATE POLICY "ChatCat: admin delete" ON public.chat_categories FOR DELETE USING (public.is_admin());

-- RLS Policies: chat_messages
CREATE POLICY "ChatMsg: employee read" ON public.chat_messages FOR SELECT USING (public.is_employee_or_admin());
CREATE POLICY "ChatMsg: employee insert" ON public.chat_messages FOR INSERT WITH CHECK (
  public.is_employee_or_admin() AND
  sender_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1)
);
CREATE POLICY "ChatMsg: own update" ON public.chat_messages FOR UPDATE USING (
  sender_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1) OR public.is_admin()
);
CREATE POLICY "ChatMsg: admin delete" ON public.chat_messages FOR DELETE USING (public.is_admin());

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('archive-files', 'archive-files', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('resources', 'resources', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('internal-docs', 'internal-docs', false) ON CONFLICT DO NOTHING;

-- Storage policies: archive-files (public read)
CREATE POLICY "Archive storage: public read" ON storage.objects FOR SELECT USING (bucket_id = 'archive-files');
CREATE POLICY "Archive storage: admin upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'archive-files' AND public.is_admin());
CREATE POLICY "Archive storage: admin update" ON storage.objects FOR UPDATE USING (bucket_id = 'archive-files' AND public.is_admin());
CREATE POLICY "Archive storage: admin delete" ON storage.objects FOR DELETE USING (bucket_id = 'archive-files' AND public.is_admin());

-- Storage policies: resources (public read)
CREATE POLICY "Resources storage: public read" ON storage.objects FOR SELECT USING (bucket_id = 'resources');
CREATE POLICY "Resources storage: admin upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resources' AND public.is_admin());
CREATE POLICY "Resources storage: admin delete" ON storage.objects FOR DELETE USING (bucket_id = 'resources' AND public.is_admin());

-- Storage policies: internal-docs (employees only)
CREATE POLICY "Internal storage: employee read" ON storage.objects FOR SELECT USING (bucket_id = 'internal-docs' AND public.is_employee_or_admin());
CREATE POLICY "Internal storage: admin upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'internal-docs' AND public.is_admin());
CREATE POLICY "Internal storage: admin delete" ON storage.objects FOR DELETE USING (bucket_id = 'internal-docs' AND public.is_admin());

-- Realtime for chat
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_categories;
