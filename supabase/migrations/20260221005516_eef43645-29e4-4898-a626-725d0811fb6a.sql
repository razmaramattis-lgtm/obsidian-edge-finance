
-- Create courses table
CREATE TABLE public.courses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'Bokføring',
  active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Public read for active courses
CREATE POLICY "Courses: public read" ON public.courses
  FOR SELECT USING (true);

-- Admin write
CREATE POLICY "Courses: admin insert" ON public.courses
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Courses: admin update" ON public.courses
  FOR UPDATE USING (is_admin());

CREATE POLICY "Courses: admin delete" ON public.courses
  FOR DELETE USING (is_admin());

-- Trigger for updated_at
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
