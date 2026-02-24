
-- Create job_listings table
CREATE TABLE public.job_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL DEFAULT 'Regnskap',
  location TEXT NOT NULL DEFAULT 'Skien',
  employment_type TEXT NOT NULL DEFAULT 'Fast, heltid 100%',
  work_hours TEXT NOT NULL DEFAULT 'Dagtid, ukedager',
  work_language TEXT NOT NULL DEFAULT 'Norsk eller engelsk',
  work_location TEXT NOT NULL DEFAULT 'Hybridkontor',
  num_positions INTEGER NOT NULL DEFAULT 1,
  start_date TEXT NOT NULL DEFAULT 'Etter avtale',
  deadline TEXT,
  intro TEXT,
  description TEXT,
  qualifications TEXT,
  tasks TEXT,
  we_offer TEXT,
  about_company TEXT,
  contact_name TEXT,
  contact_title TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.job_listings ENABLE ROW LEVEL SECURITY;

-- Public read for published/active listings
CREATE POLICY "Anyone can view published job listings"
ON public.job_listings FOR SELECT
USING (published = true AND active = true);

-- Admin full access (authenticated users who are admins)
CREATE POLICY "Admins can manage job listings"
ON public.job_listings FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Create job_applications table
CREATE TABLE public.job_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_listing_id UUID NOT NULL REFERENCES public.job_listings(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT,
  cv_url TEXT,
  cv_file_name TEXT,
  status TEXT NOT NULL DEFAULT 'ny',
  admin_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (apply)
CREATE POLICY "Anyone can submit job applications"
ON public.job_applications FOR INSERT
WITH CHECK (true);

-- Admin full access
CREATE POLICY "Admins can manage job applications"
ON public.job_applications FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Triggers for updated_at
CREATE TRIGGER update_job_listings_updated_at
BEFORE UPDATE ON public.job_listings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at
BEFORE UPDATE ON public.job_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
