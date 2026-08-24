CREATE OR REPLACE FUNCTION public.crm_wipe_leads()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_count bigint;
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'only admins can wipe the CRM database';
  END IF;

  SELECT count(*) INTO v_count FROM public.crm_leads;

  TRUNCATE TABLE
    public.crm_email_events,
    public.crm_lead_folder_members,
    public.crm_lead_folders,
    public.crm_leads
  RESTART IDENTITY CASCADE;

  -- Tilbakestill importtilstand slik at neste import starter fra dagens dato
  UPDATE public.crm_import_state
    SET window_end = now()::date,
        window_start = now()::date,
        status = 'idle',
        total_imported = 0,
        updated_at = now();

  PERFORM public.refresh_crm_stats();

  RETURN jsonb_build_object('deleted', v_count);
END;
$function$;

REVOKE EXECUTE ON FUNCTION public.crm_wipe_leads() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.crm_wipe_leads() TO authenticated;