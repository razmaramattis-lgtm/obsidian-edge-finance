
-- Workspace Posts
CREATE TABLE public.workspace_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text,
  content text NOT NULL,
  pinned boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.workspace_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "WsPosts: authenticated read" ON public.workspace_posts FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "WsPosts: own insert" ON public.workspace_posts FOR INSERT WITH CHECK (author_id = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1));
CREATE POLICY "WsPosts: own or admin update" ON public.workspace_posts FOR UPDATE USING (author_id = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1) OR is_admin());
CREATE POLICY "WsPosts: admin delete" ON public.workspace_posts FOR DELETE USING (author_id = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1) OR is_admin());

-- Post reactions
CREATE TABLE public.workspace_post_reactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid NOT NULL REFERENCES public.workspace_posts(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  emoji text NOT NULL DEFAULT '👍',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(post_id, profile_id, emoji)
);
ALTER TABLE public.workspace_post_reactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "WsReactions: authenticated read" ON public.workspace_post_reactions FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "WsReactions: own insert" ON public.workspace_post_reactions FOR INSERT WITH CHECK (profile_id = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1));
CREATE POLICY "WsReactions: own delete" ON public.workspace_post_reactions FOR DELETE USING (profile_id = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1));

-- Post comments
CREATE TABLE public.workspace_post_comments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid NOT NULL REFERENCES public.workspace_posts(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.workspace_post_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "WsComments: authenticated read" ON public.workspace_post_comments FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "WsComments: own insert" ON public.workspace_post_comments FOR INSERT WITH CHECK (author_id = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1));
CREATE POLICY "WsComments: own or admin delete" ON public.workspace_post_comments FOR DELETE USING (author_id = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1) OR is_admin());

-- Workspace Groups
CREATE TABLE public.workspace_groups (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  color text DEFAULT '#6366f1',
  is_private boolean NOT NULL DEFAULT false,
  created_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.workspace_groups ENABLE ROW LEVEL SECURITY;

-- Group members
CREATE TABLE public.workspace_group_members (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id uuid NOT NULL REFERENCES public.workspace_groups(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member',
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(group_id, profile_id)
);
ALTER TABLE public.workspace_group_members ENABLE ROW LEVEL SECURITY;

-- Group policies (after members table exists)
CREATE POLICY "WsGroups: authenticated read" ON public.workspace_groups FOR SELECT USING (
  auth.uid() IS NOT NULL AND (
    is_private = false 
    OR created_by = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1)
    OR EXISTS (SELECT 1 FROM public.workspace_group_members WHERE group_id = workspace_groups.id AND profile_id = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1))
  )
);
CREATE POLICY "WsGroups: authenticated insert" ON public.workspace_groups FOR INSERT WITH CHECK (created_by = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1));
CREATE POLICY "WsGroups: owner or admin update" ON public.workspace_groups FOR UPDATE USING (created_by = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1) OR is_admin());
CREATE POLICY "WsGroups: owner or admin delete" ON public.workspace_groups FOR DELETE USING (created_by = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1) OR is_admin());

CREATE POLICY "WsGroupMembers: authenticated read" ON public.workspace_group_members FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "WsGroupMembers: insert" ON public.workspace_group_members FOR INSERT WITH CHECK (
  profile_id = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1)
  OR is_admin()
  OR EXISTS (SELECT 1 FROM workspace_groups WHERE id = group_id AND created_by = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1))
);
CREATE POLICY "WsGroupMembers: delete" ON public.workspace_group_members FOR DELETE USING (
  profile_id = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1)
  OR is_admin()
  OR EXISTS (SELECT 1 FROM workspace_groups WHERE id = group_id AND created_by = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1))
);

-- Group messages
CREATE TABLE public.workspace_group_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id uuid NOT NULL REFERENCES public.workspace_groups(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.workspace_group_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "WsGroupMsg: read" ON public.workspace_group_messages FOR SELECT USING (
  auth.uid() IS NOT NULL AND (
    EXISTS (SELECT 1 FROM workspace_group_members WHERE group_id = workspace_group_messages.group_id AND profile_id = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1))
    OR EXISTS (SELECT 1 FROM workspace_groups WHERE id = workspace_group_messages.group_id AND is_private = false)
    OR is_admin()
  )
);
CREATE POLICY "WsGroupMsg: insert" ON public.workspace_group_messages FOR INSERT WITH CHECK (
  sender_id = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1)
  AND (
    EXISTS (SELECT 1 FROM workspace_group_members WHERE group_id = workspace_group_messages.group_id AND profile_id = sender_id)
    OR EXISTS (SELECT 1 FROM workspace_groups WHERE id = workspace_group_messages.group_id AND is_private = false)
  )
);
CREATE POLICY "WsGroupMsg: delete" ON public.workspace_group_messages FOR DELETE USING (
  sender_id = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1) OR is_admin()
);

-- Direct Messages
CREATE TABLE public.dm_conversations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_1 uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  participant_2 uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(participant_1, participant_2)
);
ALTER TABLE public.dm_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "DmConv: own read" ON public.dm_conversations FOR SELECT USING (
  participant_1 = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1)
  OR participant_2 = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1)
);
CREATE POLICY "DmConv: own insert" ON public.dm_conversations FOR INSERT WITH CHECK (
  participant_1 = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1)
  OR participant_2 = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1)
);

CREATE TABLE public.dm_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id uuid NOT NULL REFERENCES public.dm_conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.dm_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "DmMsg: read" ON public.dm_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM dm_conversations WHERE id = dm_messages.conversation_id AND (
    participant_1 = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1)
    OR participant_2 = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1)
  ))
);
CREATE POLICY "DmMsg: insert" ON public.dm_messages FOR INSERT WITH CHECK (
  sender_id = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1)
  AND EXISTS (SELECT 1 FROM dm_conversations WHERE id = dm_messages.conversation_id AND (participant_1 = sender_id OR participant_2 = sender_id))
);

-- Realtime (skip chat_messages, already added)
ALTER PUBLICATION supabase_realtime ADD TABLE public.workspace_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.workspace_post_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.workspace_group_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.dm_messages;

-- Open chat to all authenticated users
CREATE POLICY "ChatCat: authenticated read" ON public.chat_categories FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "ChatMsg: authenticated read" ON public.chat_messages FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "ChatMsg: authenticated insert" ON public.chat_messages FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND sender_id = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1)
);
