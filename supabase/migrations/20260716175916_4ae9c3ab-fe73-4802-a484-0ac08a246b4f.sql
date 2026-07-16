
ALTER FUNCTION public.list_public_advisors() SET SCHEMA private_utils;
ALTER FUNCTION public.get_advisor_unavailability(uuid[]) SET SCHEMA private_utils;

GRANT EXECUTE ON FUNCTION private_utils.list_public_advisors() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION private_utils.get_advisor_unavailability(uuid[]) TO service_role;

CREATE OR REPLACE FUNCTION public.list_public_advisors()
RETURNS TABLE(id uuid, name text)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public, private_utils
AS $$ SELECT * FROM private_utils.list_public_advisors() $$;

CREATE OR REPLACE FUNCTION public.get_advisor_unavailability(_advisor_ids uuid[])
RETURNS TABLE(profile_id uuid, blocked_date date, booking_date date, booking_time time without time zone)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public, private_utils
AS $$ SELECT * FROM private_utils.get_advisor_unavailability(_advisor_ids) $$;

GRANT EXECUTE ON FUNCTION public.list_public_advisors() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_advisor_unavailability(uuid[]) TO service_role;
