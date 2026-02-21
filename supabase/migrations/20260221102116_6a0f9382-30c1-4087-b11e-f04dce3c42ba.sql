
-- Allow customers to read collaboration agreements that are not admin_only
CREATE POLICY "CollabAgr: customer read non-admin"
ON public.collaboration_agreements
FOR SELECT
USING (is_customer() AND target_audience != 'admin_only');
