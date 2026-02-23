-- Replace the overly permissive service role policy with a restrictive one
DROP POLICY IF EXISTS "PushSub: service role full" ON public.push_subscriptions;

-- Service role access is handled via SECURITY DEFINER functions, no open policy needed
-- Add update policy for own subscriptions
CREATE POLICY "PushSub: own update" ON public.push_subscriptions
  FOR UPDATE USING (
    profile_id = (SELECT p.id FROM profiles p WHERE p.user_id = auth.uid() LIMIT 1)
  );
