
-- Add department and interests to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS department text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS interests text[] DEFAULT '{}';

-- Create DM message reactions table
CREATE TABLE public.dm_message_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES public.dm_messages(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  emoji text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(message_id, profile_id, emoji)
);

ALTER TABLE public.dm_message_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "DmReaction: read" ON public.dm_message_reactions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM dm_messages dm
    JOIN dm_conversations dc ON dc.id = dm.conversation_id
    WHERE dm.id = dm_message_reactions.message_id
    AND (dc.participant_1 = (SELECT p.id FROM profiles p WHERE p.user_id = auth.uid() LIMIT 1)
      OR dc.participant_2 = (SELECT p.id FROM profiles p WHERE p.user_id = auth.uid() LIMIT 1))
  ));

CREATE POLICY "DmReaction: insert" ON public.dm_message_reactions FOR INSERT
  WITH CHECK (profile_id = (SELECT p.id FROM profiles p WHERE p.user_id = auth.uid() LIMIT 1));

CREATE POLICY "DmReaction: delete" ON public.dm_message_reactions FOR DELETE
  USING (profile_id = (SELECT p.id FROM profiles p WHERE p.user_id = auth.uid() LIMIT 1));

-- Create group message reactions table
CREATE TABLE public.group_message_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES public.workspace_group_messages(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  emoji text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(message_id, profile_id, emoji)
);

ALTER TABLE public.group_message_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "GrpReaction: read" ON public.group_message_reactions FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "GrpReaction: insert" ON public.group_message_reactions FOR INSERT
  WITH CHECK (profile_id = (SELECT p.id FROM profiles p WHERE p.user_id = auth.uid() LIMIT 1));

CREATE POLICY "GrpReaction: delete" ON public.group_message_reactions FOR DELETE
  USING (profile_id = (SELECT p.id FROM profiles p WHERE p.user_id = auth.uid() LIMIT 1));

-- Enable realtime for reactions
ALTER PUBLICATION supabase_realtime ADD TABLE public.dm_message_reactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_message_reactions;
