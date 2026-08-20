create or replace function public.crm_search_lead_ids(_q text, _limit int default 500)
returns table(id uuid)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_employee_or_admin(auth.uid()) then
    raise exception 'not authorized';
  end if;
  if _q is null or length(btrim(_q)) < 3 then
    return;
  end if;
  return query
    select l.id from public.crm_leads l
    where l.search_text ilike '%' || btrim(_q) || '%'
    limit greatest(1, least(_limit, 2000));
end;
$$;

revoke all on function public.crm_search_lead_ids(text, int) from public, anon;
grant execute on function public.crm_search_lead_ids(text, int) to authenticated;