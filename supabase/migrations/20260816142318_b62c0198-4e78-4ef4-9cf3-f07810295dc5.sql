ALTER TABLE public.crm_email_templates
  ADD COLUMN IF NOT EXISTS blocks jsonb,
  ADD COLUMN IF NOT EXISTS design jsonb NOT NULL DEFAULT '{"accent":"#1b5e4b","font":"Arial, Helvetica, sans-serif","textColor":"#232d2a","bgColor":"#ffffff"}'::jsonb,
  ADD COLUMN IF NOT EXISTS preheader text;