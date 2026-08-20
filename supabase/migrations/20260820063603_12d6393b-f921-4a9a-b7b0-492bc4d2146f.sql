ALTER TABLE public.crm_automation_settings
  ADD COLUMN IF NOT EXISTS min_delay_minutes integer NOT NULL DEFAULT 5,
  ADD COLUMN IF NOT EXISTS max_delay_minutes integer NOT NULL DEFAULT 10;