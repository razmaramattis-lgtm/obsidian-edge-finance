
ALTER TABLE public.courses ADD COLUMN coming_soon boolean NOT NULL DEFAULT true;
ALTER TABLE public.courses ADD COLUMN has_certificate boolean NOT NULL DEFAULT false;
