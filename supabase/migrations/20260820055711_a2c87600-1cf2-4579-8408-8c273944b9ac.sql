CREATE OR REPLACE FUNCTION public.crm_municipalities()
RETURNS TABLE(municipality text)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  WITH RECURSIVE t AS (
    (SELECT l.municipality AS m FROM public.crm_leads l WHERE l.municipality IS NOT NULL ORDER BY l.municipality LIMIT 1)
    UNION ALL
    (SELECT (SELECT l.municipality FROM public.crm_leads l
             WHERE l.municipality > t.m ORDER BY l.municipality LIMIT 1)
     FROM t WHERE t.m IS NOT NULL)
  )
  SELECT m FROM t WHERE m IS NOT NULL ORDER BY m;
$$;

REVOKE ALL ON FUNCTION public.crm_municipalities() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.crm_municipalities() TO authenticated, service_role;