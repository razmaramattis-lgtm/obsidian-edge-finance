-- Create HR handbook table
CREATE TABLE public.hr_handbook (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  content text,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.hr_handbook ENABLE ROW LEVEL SECURITY;

-- All employees can read
CREATE POLICY "HrHandbook: employee read"
ON public.hr_handbook
FOR SELECT
USING (is_employee_or_admin());

-- Only admin can write
CREATE POLICY "HrHandbook: admin insert"
ON public.hr_handbook
FOR INSERT
WITH CHECK (is_admin());

CREATE POLICY "HrHandbook: admin update"
ON public.hr_handbook
FOR UPDATE
USING (is_admin());

CREATE POLICY "HrHandbook: admin delete"
ON public.hr_handbook
FOR DELETE
USING (is_admin());

-- Trigger for updated_at
CREATE TRIGGER update_hr_handbook_updated_at
BEFORE UPDATE ON public.hr_handbook
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();