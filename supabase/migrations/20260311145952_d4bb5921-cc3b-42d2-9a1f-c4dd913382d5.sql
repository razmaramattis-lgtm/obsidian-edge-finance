
-- SMS Contacts
CREATE TABLE public.sms_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  tags text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.sms_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "SmsContacts: admin full" ON public.sms_contacts FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "SmsContacts: employee read" ON public.sms_contacts FOR SELECT USING (is_employee_or_admin());

-- SMS Contact Groups
CREATE TABLE public.sms_contact_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.sms_contact_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "SmsContactGroups: admin full" ON public.sms_contact_groups FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "SmsContactGroups: employee read" ON public.sms_contact_groups FOR SELECT USING (is_employee_or_admin());

-- SMS Contact Group Members (junction)
CREATE TABLE public.sms_contact_group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.sms_contact_groups(id) ON DELETE CASCADE,
  contact_id uuid NOT NULL REFERENCES public.sms_contacts(id) ON DELETE CASCADE,
  UNIQUE(group_id, contact_id)
);
ALTER TABLE public.sms_contact_group_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "SmsContactGroupMembers: admin full" ON public.sms_contact_group_members FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "SmsContactGroupMembers: employee read" ON public.sms_contact_group_members FOR SELECT USING (is_employee_or_admin());

-- SMS Devices (Android gateways)
CREATE TABLE public.sms_devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_name text NOT NULL,
  phone_number text NOT NULL,
  api_key text NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  status text NOT NULL DEFAULT 'offline',
  messages_sent_today integer NOT NULL DEFAULT 0,
  last_seen timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.sms_devices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "SmsDevices: admin full" ON public.sms_devices FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "SmsDevices: employee read" ON public.sms_devices FOR SELECT USING (is_employee_or_admin());

-- SMS Templates
CREATE TABLE public.sms_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.sms_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "SmsTemplates: admin full" ON public.sms_templates FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "SmsTemplates: employee read" ON public.sms_templates FOR SELECT USING (is_employee_or_admin());

-- SMS Campaigns
CREATE TABLE public.sms_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  scheduled_at timestamptz,
  completed_at timestamptz,
  total_recipients integer NOT NULL DEFAULT 0,
  sent_count integer NOT NULL DEFAULT 0,
  failed_count integer NOT NULL DEFAULT 0,
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.sms_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "SmsCampaigns: admin full" ON public.sms_campaigns FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "SmsCampaigns: employee read" ON public.sms_campaigns FOR SELECT USING (is_employee_or_admin());

-- SMS Campaign Contacts (junction)
CREATE TABLE public.sms_campaign_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES public.sms_campaigns(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES public.sms_contacts(id) ON DELETE SET NULL,
  phone text NOT NULL
);
ALTER TABLE public.sms_campaign_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "SmsCampaignContacts: admin full" ON public.sms_campaign_contacts FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "SmsCampaignContacts: employee read" ON public.sms_campaign_contacts FOR SELECT USING (is_employee_or_admin());

-- SMS Messages (queue)
CREATE TABLE public.sms_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'queued',
  device_id uuid REFERENCES public.sms_devices(id) ON DELETE SET NULL,
  campaign_id uuid REFERENCES public.sms_campaigns(id) ON DELETE SET NULL,
  error_message text,
  retry_count integer NOT NULL DEFAULT 0,
  queued_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.sms_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "SmsMessages: admin full" ON public.sms_messages FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "SmsMessages: employee read" ON public.sms_messages FOR SELECT USING (is_employee_or_admin());

-- SMS Settings
CREATE TABLE public.sms_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.sms_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "SmsSettings: admin full" ON public.sms_settings FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "SmsSettings: employee read" ON public.sms_settings FOR SELECT USING (is_employee_or_admin());

-- Default settings
INSERT INTO public.sms_settings (key, value) VALUES
  ('message_delay_ms', '2500'),
  ('max_messages_per_device', '500'),
  ('retry_attempts', '3'),
  ('gateway_server_url', '');
