DO $$
DECLARE
  r text;
  tok text;
  mid uuid;
  subj text;
  htm text;
BEGIN
  FOREACH r IN ARRAY ARRAY['mattis@avargo.no','anniken@avargo.no'] LOOP
    SELECT token INTO tok FROM public.email_unsubscribe_tokens WHERE email = r;
    IF tok IS NULL THEN
      tok := encode(gen_random_bytes(32),'hex');
      INSERT INTO public.email_unsubscribe_tokens(token,email) VALUES (tok,r) ON CONFLICT (email) DO NOTHING;
      SELECT token INTO tok FROM public.email_unsubscribe_tokens WHERE email = r;
    END IF;

    -- INNGÅENDE (varsel om ny henvendelse)
    mid := gen_random_uuid();
    subj := 'TEST inngående: Ny henvendelse via avargo.no';
    htm := '<div style="font-family:Arial,sans-serif;font-size:14px;color:#232d2a"><h2 style="color:#1b5e4b">Ny henvendelse (TEST)</h2><p><strong>Firma:</strong> Testbedrift AS<br><strong>Kontaktperson:</strong> Test Testesen<br><strong>E-post:</strong> test@example.com<br><strong>Telefon:</strong> 98 64 23 91<br><strong>Avdeling:</strong> Regnskap</p><p><strong>Melding:</strong> Dette er en testhenvendelse for å verifisere inngående e-postvarsler.</p></div>';
    PERFORM public.enqueue_email('transactional_emails', jsonb_build_object(
      'message_id', mid::text,
      'to', r,
      'from', 'Avargo <kontakt@avargo.no>',
      'reply_to', 'kontakt@avargo.no',
      'sender_domain', 'avargo.no',
      'subject', subj,
      'html', htm,
      'text', 'Ny henvendelse (TEST) fra Testbedrift AS',
      'purpose', 'transactional',
      'label', 'admin-contact-notification',
      'idempotency_key', 'test-in-' || mid::text,
      'unsubscribe_token', tok,
      'queued_at', now()
    ));
    INSERT INTO public.email_send_log(message_id, template_name, recipient_email, status)
    VALUES (mid::text, 'admin-contact-notification', r, 'pending');

    -- UTGÅENDE (utsendelse fra e-postpanelet)
    mid := gen_random_uuid();
    subj := 'TEST utgående: E-post fra Avargo';
    htm := '<div style="font-family:Arial,sans-serif;font-size:14px;color:#232d2a"><h2 style="color:#1b5e4b">Utgående test</h2><p>Hei! Dette er en testutsendelse fra e-postpanelet i adminportalen, sendt fra kontakt@avargo.no.</p><p>Mvh Avargo</p></div>';
    PERFORM public.enqueue_email('transactional_emails', jsonb_build_object(
      'message_id', mid::text,
      'to', r,
      'from', 'Avargo <kontakt@avargo.no>',
      'reply_to', 'kontakt@avargo.no',
      'sender_domain', 'avargo.no',
      'subject', subj,
      'html', htm,
      'text', 'Utgående test fra Avargo',
      'purpose', 'transactional',
      'label', 'bulk-broadcast',
      'idempotency_key', 'test-out-' || mid::text,
      'unsubscribe_token', tok,
      'queued_at', now()
    ));
    INSERT INTO public.email_send_log(message_id, template_name, recipient_email, status)
    VALUES (mid::text, 'bulk-broadcast', r, 'pending');
  END LOOP;
END $$;