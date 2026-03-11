
-- Email contacts table (mirrors sms_contacts structure)
CREATE TABLE public.email_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.email_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "EmailContacts: admin full" ON public.email_contacts FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "EmailContacts: employee read" ON public.email_contacts FOR SELECT USING (is_employee_or_admin());

-- Email contact groups
CREATE TABLE public.email_contact_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.email_contact_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "EmailContactGroups: admin full" ON public.email_contact_groups FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "EmailContactGroups: employee read" ON public.email_contact_groups FOR SELECT USING (is_employee_or_admin());

-- Email contact group members
CREATE TABLE public.email_contact_group_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.email_contact_groups(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES public.email_contacts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(group_id, contact_id)
);

ALTER TABLE public.email_contact_group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "EmailContactGroupMembers: admin full" ON public.email_contact_group_members FOR ALL USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "EmailContactGroupMembers: employee read" ON public.email_contact_group_members FOR SELECT USING (is_employee_or_admin());

-- Triggers for updated_at
CREATE TRIGGER update_email_contacts_updated_at BEFORE UPDATE ON public.email_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
