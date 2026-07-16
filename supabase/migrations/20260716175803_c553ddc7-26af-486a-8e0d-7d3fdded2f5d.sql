
GRANT EXECUTE ON FUNCTION public.current_profile_id(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.customer_can_read_advisor(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_customer(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_dm_participant(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_employee_or_admin(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.own_company_id(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.realtime_topic_allowed() TO authenticated;
