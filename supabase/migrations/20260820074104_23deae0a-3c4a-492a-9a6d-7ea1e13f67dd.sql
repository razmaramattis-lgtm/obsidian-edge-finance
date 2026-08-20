ALTER TABLE public.crm_automation_settings
  ADD COLUMN IF NOT EXISTS employees_min integer,
  ADD COLUMN IF NOT EXISTS employees_max integer,
  ADD COLUMN IF NOT EXISTS require_phone boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS accountant_filter text NOT NULL DEFAULT 'alle';