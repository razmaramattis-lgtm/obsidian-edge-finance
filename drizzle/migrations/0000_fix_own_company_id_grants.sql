GRANT USAGE ON SCHEMA private_utils TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION private_utils.own_company_id(uuid) TO anon, authenticated, service_role;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public' AND p.proname='own_company_id') THEN
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.own_company_id(uuid) TO anon, authenticated, service_role';
  END IF;
END $$;