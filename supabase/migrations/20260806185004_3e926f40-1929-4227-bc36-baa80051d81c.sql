-- 1) Archive files: enforce the visibility column
DROP POLICY IF EXISTS "Archive: public read" ON public.archive_files;

CREATE POLICY "Archive: visibility scoped read"
ON public.archive_files
FOR SELECT
USING (
  private_utils.is_employee_or_admin()
  OR (
    active = true
    AND COALESCE(visibility, 'public') = 'public'
  )
  OR (
    active = true
    AND visibility = 'customer'
    AND auth.uid() IS NOT NULL
  )
);

-- 2) DM messages: recipients may only flip read_at
CREATE OR REPLACE FUNCTION public.enforce_dm_recipient_read_only()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, private_utils
AS $$
BEGIN
  -- The sender (and admins) may edit freely; recipients may only change read_at.
  IF OLD.sender_id = private_utils.current_profile_id() OR private_utils.is_admin() THEN
    RETURN NEW;
  END IF;

  IF NEW.id IS DISTINCT FROM OLD.id
     OR NEW.conversation_id IS DISTINCT FROM OLD.conversation_id
     OR NEW.sender_id IS DISTINCT FROM OLD.sender_id
     OR NEW.content IS DISTINCT FROM OLD.content
     OR NEW.created_at IS DISTINCT FROM OLD.created_at THEN
    RAISE EXCEPTION 'Recipients may only mark messages as read';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS dm_messages_recipient_read_only ON public.dm_messages;
CREATE TRIGGER dm_messages_recipient_read_only
BEFORE UPDATE ON public.dm_messages
FOR EACH ROW EXECUTE FUNCTION public.enforce_dm_recipient_read_only();

REVOKE EXECUTE ON FUNCTION public.enforce_dm_recipient_read_only() FROM anon, authenticated;