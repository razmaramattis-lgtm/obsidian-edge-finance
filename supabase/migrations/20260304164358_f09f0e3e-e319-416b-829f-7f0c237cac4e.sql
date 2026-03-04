-- Harden helper functions
CREATE OR REPLACE FUNCTION public.current_profile_id(uid uuid DEFAULT auth.uid())
RETURNS uuid
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF uid IS NULL THEN
    RETURN NULL;
  END IF;

  RETURN (
    SELECT p.id
    FROM public.profiles p
    WHERE p.user_id = uid
      AND COALESCE(p.active, true) = true
    LIMIT 1
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.is_admin(uid uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF uid IS NULL THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.user_id = uid
      AND p.role = 'admin'
      AND COALESCE(p.active, true) = true
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.is_employee_or_admin(uid uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF uid IS NULL THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.user_id = uid
      AND p.role IN ('admin', 'employee')
      AND COALESCE(p.active, true) = true
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.is_customer(uid uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF uid IS NULL THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.user_id = uid
      AND p.role = 'customer'
      AND COALESCE(p.active, true) = true
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.own_company_id(uid uuid DEFAULT auth.uid())
RETURNS uuid
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF uid IS NULL THEN
    RETURN NULL;
  END IF;

  RETURN (
    SELECT cc.id
    FROM public.customer_companies cc
    JOIN public.profiles p ON p.id = cc.profile_id
    WHERE p.user_id = uid
      AND p.role = 'customer'
      AND COALESCE(p.active, true) = true
    LIMIT 1
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.customer_can_read_advisor(_advisor_profile_id uuid, uid uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.customer_companies cc
    JOIN public.profiles cp ON cp.id = cc.profile_id
    WHERE cp.user_id = uid
      AND cp.role = 'customer'
      AND COALESCE(cp.active, true) = true
      AND (_advisor_profile_id = cc.primary_advisor_id OR _advisor_profile_id = cc.backup_advisor_id)
  );
$$;

CREATE OR REPLACE FUNCTION public.list_public_advisors()
RETURNS TABLE(id uuid, name text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.name
  FROM public.profiles p
  WHERE p.role IN ('admin', 'employee')
    AND p.booking_active = true
    AND COALESCE(p.active, true) = true
  ORDER BY p.name;
$$;

GRANT EXECUTE ON FUNCTION public.list_public_advisors() TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_advisor_unavailability(_advisor_ids uuid[])
RETURNS TABLE(profile_id uuid, blocked_date date, booking_date date, booking_time time without time zone)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT bd.profile_id, bd.blocked_date, NULL::date AS booking_date, NULL::time AS booking_time
  FROM public.advisor_blocked_dates bd
  WHERE bd.profile_id = ANY(_advisor_ids)
  UNION ALL
  SELECT b.advisor_id AS profile_id, NULL::date AS blocked_date, b.booking_date, b.booking_time
  FROM public.bookings b
  WHERE b.advisor_id = ANY(_advisor_ids)
    AND b.status <> 'cancelled';
$$;

GRANT EXECUTE ON FUNCTION public.get_advisor_unavailability(uuid[]) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.is_dm_participant(_conversation_id uuid, uid uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.dm_conversations c
    WHERE c.id = _conversation_id
      AND (
        c.participant_1 = public.current_profile_id(uid)
        OR c.participant_2 = public.current_profile_id(uid)
      )
  );
$$;

-- Tighten profiles access
DROP POLICY IF EXISTS "Profiles: authenticated read all" ON public.profiles;
DROP POLICY IF EXISTS "Profiles: employee read colleagues" ON public.profiles;
DROP POLICY IF EXISTS "Profiles: customer read assigned advisors" ON public.profiles;

CREATE POLICY "Profiles: employee read colleagues"
ON public.profiles
FOR SELECT
USING (
  public.is_employee_or_admin()
  AND role IN ('admin', 'employee')
  AND COALESCE(active, true) = true
);

CREATE POLICY "Profiles: customer read assigned advisors"
ON public.profiles
FOR SELECT
USING (
  public.is_customer()
  AND role IN ('admin', 'employee')
  AND public.customer_can_read_advisor(id)
  AND COALESCE(active, true) = true
);

-- Simplify DM message policies
DROP POLICY IF EXISTS "DmMsg: insert" ON public.dm_messages;
DROP POLICY IF EXISTS "DmMsg: read" ON public.dm_messages;
DROP POLICY IF EXISTS "Recipients can mark messages as read" ON public.dm_messages;

CREATE POLICY "DmMsg: insert"
ON public.dm_messages
FOR INSERT
WITH CHECK (
  sender_id = public.current_profile_id()
  AND public.is_dm_participant(conversation_id)
);

CREATE POLICY "DmMsg: read"
ON public.dm_messages
FOR SELECT
USING (public.is_dm_participant(conversation_id));

CREATE POLICY "Recipients can mark messages as read"
ON public.dm_messages
FOR UPDATE
USING (
  sender_id <> public.current_profile_id()
  AND public.is_dm_participant(conversation_id)
)
WITH CHECK (
  sender_id <> public.current_profile_id()
  AND public.is_dm_participant(conversation_id)
);

-- Remove overly permissive public insert policies in favor of validated edge functions
DROP POLICY IF EXISTS "Bookings: public insert" ON public.bookings;
DROP POLICY IF EXISTS "ContactSub: public insert" ON public.contact_submissions;
DROP POLICY IF EXISTS "AccountFeedback: public insert" ON public.account_feedback;
DROP POLICY IF EXISTS "JobApp: public insert" ON public.job_applications;
DROP POLICY IF EXISTS "OpenApp: public insert" ON public.open_applications;
DROP POLICY IF EXISTS "SamarbeidApp: public insert" ON public.samarbeid_applications;