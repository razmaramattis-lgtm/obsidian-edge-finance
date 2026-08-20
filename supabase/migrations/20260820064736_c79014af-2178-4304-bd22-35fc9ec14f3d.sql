REVOKE ALL ON FUNCTION public.email_batch_progress(integer) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.email_batch_progress(integer) TO authenticated, service_role;