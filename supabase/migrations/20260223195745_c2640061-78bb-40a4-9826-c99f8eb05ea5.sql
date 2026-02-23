
-- Add read_at column to dm_messages
ALTER TABLE public.dm_messages ADD COLUMN read_at TIMESTAMPTZ DEFAULT NULL;

-- Allow participants to update read_at on messages sent TO them
CREATE POLICY "Recipients can mark messages as read"
ON public.dm_messages
FOR UPDATE
USING (
  sender_id != (SELECT p.id FROM public.profiles p WHERE p.user_id = auth.uid() LIMIT 1)
  AND EXISTS (
    SELECT 1 FROM public.dm_conversations c
    WHERE c.id = dm_messages.conversation_id
    AND (
      (c.participant_1 = (SELECT p.id FROM public.profiles p WHERE p.user_id = auth.uid() LIMIT 1))
      OR (c.participant_2 = (SELECT p.id FROM public.profiles p WHERE p.user_id = auth.uid() LIMIT 1))
    )
  )
)
WITH CHECK (
  sender_id != (SELECT p.id FROM public.profiles p WHERE p.user_id = auth.uid() LIMIT 1)
);
