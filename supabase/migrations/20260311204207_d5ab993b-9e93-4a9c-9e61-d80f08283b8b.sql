
-- Tighten the insert policy to only allow the trigger function (SECURITY DEFINER) 
-- by restricting direct inserts to the actor matching the current user
DROP POLICY "Authenticated can insert audit log" ON public.audit_log;

CREATE POLICY "System can insert audit log"
  ON public.audit_log FOR INSERT
  TO authenticated
  WITH CHECK (actor_id = public.current_profile_id(auth.uid()) OR actor_id IS NULL);
