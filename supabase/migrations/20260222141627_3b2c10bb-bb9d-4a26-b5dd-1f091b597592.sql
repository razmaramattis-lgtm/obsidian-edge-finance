
-- Add specialty fields to customer_companies
ALTER TABLE public.customer_companies
ADD COLUMN IF NOT EXISTS accounting_system text,
ADD COLUMN IF NOT EXISTS bank text,
ADD COLUMN IF NOT EXISTS insurance_company text,
ADD COLUMN IF NOT EXISTS num_employees integer,
ADD COLUMN IF NOT EXISTS annual_revenue text,
ADD COLUMN IF NOT EXISTS vat_registered boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS employer_registered boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS internal_notes text;
