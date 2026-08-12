ALTER TABLE public.crm_email_templates ADD COLUMN IF NOT EXISTS reason text;

INSERT INTO public.crm_email_templates (name, category, subject, body_html, reason, is_default, active)
SELECT * FROM (VALUES
  (
    'Gratulerer med nytt selskap',
    'ny_bedrift',
    'Gratulerer med {{ firma }} – her er de viktigste tingene å få på plass',
    '<h2 style="color:#1b5e4b;">Gratulerer med etableringen av {{ firma }}!</h2><p>Hei {{ navn }},</p><p>Vi ser at {{ firma }} nylig ble registrert i Enhetsregisteret. Det er en spennende fase – og de valgene dere tar de første månedene har mye å si for økonomien videre.</p><p>Avargo er et autorisert regnskapsbyrå som hjelper små og mellomstore bedrifter med regnskap, lønn, MVA og årsoppgjør til fast pris. Du får en fast rådgiver, svar innen 24 timer og full oversikt fra dag én.</p><ul><li>Riktig oppsett av kontoplan og MVA fra start</li><li>Lønn og A-melding uten stress</li><li>Fast månedspris – ingen overraskelser</li></ul><p><a href="https://avargo.no/book-mote" style="display:inline-block;background:#1b5e4b;color:#ffffff;padding:12px 22px;border-radius:999px;text-decoration:none;">Book en uforpliktende prat</a></p><p>Eller ring oss direkte på 98 64 23 91.</p><p>Med vennlig hilsen<br>Avargo Regnskap AS</p>',
    'Du mottar denne e-posten fordi {{ firma }} nylig er registrert i Enhetsregisteret, og vi tilbyr regnskapstjenester til nyetablerte selskaper.',
    true, true
  ),
  (
    'Vurderer dere å bytte regnskapsfører?',
    'har_regnskapsforer',
    'Betaler {{ firma }} for mye for regnskapet?',
    '<h2 style="color:#1b5e4b;">Er dere fornøyd med regnskapsføreren deres?</h2><p>Hei {{ navn }},</p><p>Mange bedrifter i {{ kommune }} opplever uforutsigbare regnskapshonorarer og lang svartid. Hos Avargo får dere fast pris, en dedikert rådgiver og svar innen 24 timer.</p><ul><li>Fast månedspris – dere vet alltid hva regnskapet koster</li><li>Én fast kontaktperson som kjenner bedriften</li><li>Vi håndterer hele flyttingen fra dagens regnskapsfører</li></ul><p><a href="https://avargo.no/priser" style="display:inline-block;background:#1b5e4b;color:#ffffff;padding:12px 22px;border-radius:999px;text-decoration:none;">Se våre priser</a></p><p>Ta gjerne kontakt på 98 64 23 91 for en uforpliktende sammenligning.</p><p>Med vennlig hilsen<br>Avargo Regnskap AS</p>',
    'Du mottar denne e-posten fordi {{ firma }} er registrert i Enhetsregisteret, og vi tilbyr regnskapstjenester til bedrifter i {{ kommune }}.',
    true, true
  ),
  (
    'Gjør dere regnskapet selv?',
    'ingen_regnskapsforer',
    'Bruker {{ firma }} for mye tid på regnskapet?',
    '<h2 style="color:#1b5e4b;">Bruk tiden på driften – ikke på bilag</h2><p>Hei {{ navn }},</p><p>Vi ser at {{ firma }} ikke har registrert en ekstern regnskapsfører. Mange gjør regnskapet selv, men bruker fort flere timer i måneden på bilag, MVA og lønn.</p><p>Avargo tar over hele jobben til fast pris, slik at dere kan konsentrere dere om driften.</p><ul><li>Bilag, MVA, lønn og årsoppgjør</li><li>Fast rådgiver og svar innen 24 timer</li><li>Full oversikt i en enkel kundeportal</li></ul><p><a href="https://avargo.no/kontakt" style="display:inline-block;background:#1b5e4b;color:#ffffff;padding:12px 22px;border-radius:999px;text-decoration:none;">Be oss ringe deg</a></p><p>Med vennlig hilsen<br>Avargo Regnskap AS</p>',
    'Du mottar denne e-posten fordi {{ firma }} er registrert i Enhetsregisteret, og vi tilbyr regnskapstjenester til små og mellomstore bedrifter.',
    true, true
  )
) AS t(name, category, subject, body_html, reason, is_default, active)
WHERE NOT EXISTS (SELECT 1 FROM public.crm_email_templates);