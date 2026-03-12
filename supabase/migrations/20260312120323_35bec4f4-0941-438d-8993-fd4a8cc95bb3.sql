
-- Advisory categories (Regnskap, HR, Skatt, etc.)
CREATE TABLE public.advisory_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text DEFAULT 'Briefcase',
  sort_order int DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.advisory_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active advisory categories"
  ON public.advisory_categories FOR SELECT
  USING (active = true);

CREATE POLICY "Admins can manage advisory categories"
  ON public.advisory_categories FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Advisor online status for hurtig rådgivning
CREATE TABLE public.advisor_online_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  category_id uuid REFERENCES public.advisory_categories(id) ON DELETE CASCADE NOT NULL,
  is_online boolean DEFAULT false,
  price_per_minute numeric DEFAULT 30,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(profile_id, category_id)
);

ALTER TABLE public.advisor_online_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read online advisors"
  ON public.advisor_online_status FOR SELECT
  USING (true);

CREATE POLICY "Advisors can manage own online status"
  ON public.advisor_online_status FOR ALL
  TO authenticated
  USING (profile_id = public.current_profile_id(auth.uid()))
  WITH CHECK (profile_id = public.current_profile_id(auth.uid()));

CREATE POLICY "Admins can manage all online statuses"
  ON public.advisor_online_status FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Advisory sessions (video calls)
CREATE TABLE public.advisory_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES public.advisory_categories(id) NOT NULL,
  advisor_id uuid REFERENCES public.profiles(id),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  description text,
  status text DEFAULT 'pending' NOT NULL,
  price_per_minute numeric DEFAULT 30,
  started_at timestamptz,
  ended_at timestamptz,
  duration_minutes numeric,
  total_amount numeric,
  stripe_payment_id text,
  payment_status text DEFAULT 'unpaid',
  admin_note text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.advisory_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and employees can read all sessions"
  ON public.advisory_sessions FOR SELECT
  TO authenticated
  USING (public.is_employee_or_admin(auth.uid()));

CREATE POLICY "Anyone can create sessions"
  ON public.advisory_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update sessions"
  ON public.advisory_sessions FOR UPDATE
  TO authenticated
  USING (public.is_employee_or_admin(auth.uid()))
  WITH CHECK (public.is_employee_or_admin(auth.uid()));

-- Enable realtime for sessions and online status
ALTER PUBLICATION supabase_realtime ADD TABLE public.advisory_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.advisor_online_status;

-- Insert default categories
INSERT INTO public.advisory_categories (name, description, icon, sort_order) VALUES
  ('Regnskap', 'Bokføring, MVA, årsregnskap og skattemelding', 'Calculator', 1),
  ('Skatt', 'Skatteplanlegging, fradrag og optimalisering', 'PiggyBank', 2),
  ('HR & Personal', 'Ansettelser, lønn, personalhåndbok', 'Users', 3),
  ('Selskapsrett', 'Stiftelse, aksjonæravtaler, fusjon', 'Landmark', 4),
  ('Markedsføring', 'Digital markedsføring, SEO og SoMe', 'Megaphone', 5),
  ('IT & Utvikling', 'Nettsider, systemer og automatisering', 'Code', 6);
