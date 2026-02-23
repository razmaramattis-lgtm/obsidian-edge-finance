CREATE POLICY "Users can update own reads"
ON public.group_message_reads
FOR UPDATE
USING (profile_id = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1))
WITH CHECK (profile_id = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1));