
-- SECURITY INVOKER wrappers in public that just delegate to the SECURITY DEFINER versions in private_utils.
-- These are safe to expose because they run with the caller's privileges; the definer helpers inside are protected by their own logic.

CREATE OR REPLACE FUNCTION public.is_admin(uid uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public, private_utils
AS $$ SELECT private_utils.is_admin(uid) $$;

CREATE OR REPLACE FUNCTION public.is_employee_or_admin(uid uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public, private_utils
AS $$ SELECT private_utils.is_employee_or_admin(uid) $$;

CREATE OR REPLACE FUNCTION public.current_profile_id(uid uuid DEFAULT auth.uid())
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public, private_utils
AS $$ SELECT private_utils.current_profile_id(uid) $$;

GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_employee_or_admin(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.current_profile_id(uuid) TO anon, authenticated;
