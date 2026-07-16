
CREATE SCHEMA IF NOT EXISTS private_utils;
GRANT USAGE ON SCHEMA private_utils TO anon, authenticated, service_role;

ALTER FUNCTION public.current_profile_id(uuid) SET SCHEMA private_utils;
ALTER FUNCTION public.customer_can_read_advisor(uuid, uuid) SET SCHEMA private_utils;
ALTER FUNCTION public.is_admin(uuid) SET SCHEMA private_utils;
ALTER FUNCTION public.is_customer(uuid) SET SCHEMA private_utils;
ALTER FUNCTION public.is_dm_participant(uuid, uuid) SET SCHEMA private_utils;
ALTER FUNCTION public.is_employee_or_admin(uuid) SET SCHEMA private_utils;
ALTER FUNCTION public.own_company_id(uuid) SET SCHEMA private_utils;
ALTER FUNCTION public.realtime_topic_allowed() SET SCHEMA private_utils;

GRANT EXECUTE ON FUNCTION private_utils.current_profile_id(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION private_utils.customer_can_read_advisor(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION private_utils.is_admin(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION private_utils.is_customer(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION private_utils.is_dm_participant(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION private_utils.is_employee_or_admin(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION private_utils.own_company_id(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION private_utils.realtime_topic_allowed() TO authenticated;
