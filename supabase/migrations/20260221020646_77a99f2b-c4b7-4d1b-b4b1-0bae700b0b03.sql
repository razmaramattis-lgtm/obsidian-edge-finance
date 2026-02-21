
-- Advisor availability: which employees offer 1-1 and their weekly schedule
CREATE TABLE public.advisor_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  day_of_week smallint NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Mon, 6=Sun
  start_time time NOT NULL DEFAULT '09:00',
  end_time time NOT NULL DEFAULT '17:00',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(profile_id, day_of_week)
);

-- Blocked dates: specific dates/times an advisor is unavailable
CREATE TABLE public.advisor_blocked_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  blocked_date date NOT NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Bookings from customers
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  advisor_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  company_name text NOT NULL,
  message text,
  booking_date date NOT NULL,
  booking_time time NOT NULL,
  status text NOT NULL DEFAULT 'pending', -- pending, confirmed, cancelled
  teams_link text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.advisor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisor_blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Advisor availability policies
CREATE POLICY "AdvAvail: public read active" ON public.advisor_availability FOR SELECT USING (active = true OR is_employee_or_admin());
CREATE POLICY "AdvAvail: admin insert" ON public.advisor_availability FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "AdvAvail: admin update" ON public.advisor_availability FOR UPDATE USING (is_admin());
CREATE POLICY "AdvAvail: admin delete" ON public.advisor_availability FOR DELETE USING (is_admin());

-- Blocked dates policies
CREATE POLICY "BlockedDates: employee read" ON public.advisor_blocked_dates FOR SELECT USING (is_employee_or_admin());
CREATE POLICY "BlockedDates: admin insert" ON public.advisor_blocked_dates FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "BlockedDates: admin delete" ON public.advisor_blocked_dates FOR DELETE USING (is_admin());

-- Bookings policies: public can insert (create booking), employees can read
CREATE POLICY "Bookings: public insert" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Bookings: employee read" ON public.bookings FOR SELECT USING (is_employee_or_admin());
CREATE POLICY "Bookings: admin update" ON public.bookings FOR UPDATE USING (is_admin());
CREATE POLICY "Bookings: admin delete" ON public.bookings FOR DELETE USING (is_admin());

-- Triggers for updated_at
CREATE TRIGGER update_advisor_availability_updated_at BEFORE UPDATE ON public.advisor_availability FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
