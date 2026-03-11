
-- Email messages table (mirrors sms_messages structure)
CREATE TABLE public.email_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email text NOT NULL,
  recipient_name text,
  subject text NOT NULL,
  body text NOT NULL,
  status text NOT NULL DEFAULT 'queued',
  campaign_id uuid,
  sent_at timestamptz,
  error_message text,
  retry_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Email templates table
CREATE TABLE public.email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  subject text NOT NULL DEFAULT '',
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Email campaigns table
CREATE TABLE public.email_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  subject text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'draft',
  scheduled_at timestamptz,
  total_recipients integer NOT NULL DEFAULT 0,
  sent_count integer NOT NULL DEFAULT 0,
  failed_count integer NOT NULL DEFAULT 0,
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Email campaign contacts
CREATE TABLE public.email_campaign_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES public.email_campaigns(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Add foreign key for email_messages campaign_id
ALTER TABLE public.email_messages
  ADD CONSTRAINT email_messages_campaign_id_fkey
  FOREIGN KEY (campaign_id) REFERENCES public.email_campaigns(id) ON DELETE SET NULL;

-- RLS
ALTER TABLE public.email_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_campaign_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access email_messages" ON public.email_messages FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admin full access email_templates" ON public.email_templates FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admin full access email_campaigns" ON public.email_campaigns FOR ALL TO authenticated USING (public.is_admin());
CREATE POLICY "Admin full access email_campaign_contacts" ON public.email_campaign_contacts FOR ALL TO authenticated USING (public.is_admin());

-- Update triggers
CREATE TRIGGER update_email_messages_updated_at BEFORE UPDATE ON public.email_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON public.email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_campaigns_updated_at BEFORE UPDATE ON public.email_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
