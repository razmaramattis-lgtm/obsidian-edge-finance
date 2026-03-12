
-- Replace overly permissive INSERT policy with a scoped one
DROP POLICY "Anyone can create sessions" ON public.advisory_sessions;

CREATE POLICY "Anyone can insert advisory sessions"
  ON public.advisory_sessions FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    status = 'pending'
    AND advisor_id IS NULL
    AND payment_status = 'unpaid'
  );
