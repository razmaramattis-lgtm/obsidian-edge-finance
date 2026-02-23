
-- Function to notify all admins when admin-relevant events occur
CREATE OR REPLACE FUNCTION public.notify_admins_on_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  admin_rec RECORD;
  n_type text;
  n_title text;
  n_body text;
  n_ref_id text;
  n_ref_type text;
BEGIN
  CASE TG_TABLE_NAME
    WHEN 'contact_submissions' THEN
      n_type := 'admin_contact';
      n_title := 'Ny henvendelse';
      n_body := COALESCE(NEW.contact_person, NEW.company_name, NEW.email, 'Ukjent');
      n_ref_id := NEW.id::text;
      n_ref_type := 'contact_submission';
    WHEN 'bookings' THEN
      n_type := 'admin_booking';
      n_title := 'Ny booking';
      n_body := NEW.customer_name || ' – ' || NEW.booking_date::text;
      n_ref_id := NEW.id::text;
      n_ref_type := 'booking';
    WHEN 'advisor_requests' THEN
      n_type := 'admin_advisor';
      n_title := 'Rådgiverforespørsel';
      n_body := COALESCE(NEW.message, 'Ny forespørsel');
      n_ref_id := NEW.id::text;
      n_ref_type := 'advisor_request';
    WHEN 'partnership_requests' THEN
      n_type := 'admin_partner';
      n_title := 'Avtaleforespørsel';
      n_body := COALESCE(NEW.message, 'Ny forespørsel');
      n_ref_id := NEW.id::text;
      n_ref_type := 'partnership_request';
    WHEN 'customer_employee_invitations' THEN
      n_type := 'admin_invitation';
      n_title := 'Ansattinvitasjon';
      n_body := NEW.employee_name || ' – ' || NEW.employee_email;
      n_ref_id := NEW.id::text;
      n_ref_type := 'employee_invitation';
    WHEN 'benefit_agreement_applications' THEN
      n_type := 'admin_benefit';
      n_title := 'Fordelsavtale-søknad';
      n_body := NEW.title;
      n_ref_id := NEW.id::text;
      n_ref_type := 'benefit_application';
    WHEN 'account_feedback' THEN
      n_type := 'admin_feedback';
      n_title := 'Kontohjelp-melding';
      n_body := '«' || NEW.search_term || '»';
      n_ref_id := NEW.id::text;
      n_ref_type := 'account_feedback';
    ELSE
      RETURN NEW;
  END CASE;

  FOR admin_rec IN SELECT id FROM profiles WHERE role = 'admin'
  LOOP
    INSERT INTO workspace_notifications (recipient_id, actor_id, type, title, body, reference_id, reference_type)
    VALUES (admin_rec.id, admin_rec.id, n_type, n_title, n_body, n_ref_id, n_ref_type);
  END LOOP;

  RETURN NEW;
END;
$$;

-- Create triggers for each admin-relevant table
CREATE TRIGGER notify_admins_contact AFTER INSERT ON public.contact_submissions FOR EACH ROW EXECUTE FUNCTION public.notify_admins_on_event();
CREATE TRIGGER notify_admins_booking AFTER INSERT ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.notify_admins_on_event();
CREATE TRIGGER notify_admins_advisor AFTER INSERT ON public.advisor_requests FOR EACH ROW EXECUTE FUNCTION public.notify_admins_on_event();
CREATE TRIGGER notify_admins_partner AFTER INSERT ON public.partnership_requests FOR EACH ROW EXECUTE FUNCTION public.notify_admins_on_event();
CREATE TRIGGER notify_admins_invitation AFTER INSERT ON public.customer_employee_invitations FOR EACH ROW EXECUTE FUNCTION public.notify_admins_on_event();
CREATE TRIGGER notify_admins_benefit AFTER INSERT ON public.benefit_agreement_applications FOR EACH ROW EXECUTE FUNCTION public.notify_admins_on_event();
CREATE TRIGGER notify_admins_feedback AFTER INSERT ON public.account_feedback FOR EACH ROW EXECUTE FUNCTION public.notify_admins_on_event();
