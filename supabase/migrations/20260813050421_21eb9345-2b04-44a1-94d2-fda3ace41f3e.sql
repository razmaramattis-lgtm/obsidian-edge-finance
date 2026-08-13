UPDATE crm_email_templates
SET body_html = regexp_replace(body_html, '<p>Med vennlig hilsen<br>Avargo Regnskap AS</p>\s*$', '', 'i')
WHERE body_html ILIKE '%Med vennlig hilsen<br>Avargo Regnskap AS</p>';