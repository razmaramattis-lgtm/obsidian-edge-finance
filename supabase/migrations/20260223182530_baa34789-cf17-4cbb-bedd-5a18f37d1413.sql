
-- Add edited_at to posts and comments for edit tracking
ALTER TABLE public.workspace_posts ADD COLUMN edited_at timestamptz DEFAULT NULL;
ALTER TABLE public.workspace_post_comments ADD COLUMN edited_at timestamptz DEFAULT NULL;

-- Add file_url to group messages and DM messages for attachments
ALTER TABLE public.workspace_group_messages ADD COLUMN file_url text DEFAULT NULL;
ALTER TABLE public.workspace_group_messages ADD COLUMN file_name text DEFAULT NULL;
ALTER TABLE public.dm_messages ADD COLUMN file_url text DEFAULT NULL;
ALTER TABLE public.dm_messages ADD COLUMN file_name text DEFAULT NULL;

-- Add cover_image_url to groups for better design
ALTER TABLE public.workspace_groups ADD COLUMN cover_image_url text DEFAULT NULL;

-- Create friends table
CREATE TABLE public.workspace_friends (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending', -- pending, accepted, rejected
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(requester_id, receiver_id)
);

ALTER TABLE public.workspace_friends ENABLE ROW LEVEL SECURITY;

-- Friends RLS: own read
CREATE POLICY "WsFriends: own read" ON public.workspace_friends
FOR SELECT USING (
  requester_id = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1) OR
  receiver_id = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1)
);

-- Friends RLS: own insert (can only send as yourself)
CREATE POLICY "WsFriends: own insert" ON public.workspace_friends
FOR INSERT WITH CHECK (
  requester_id = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1)
);

-- Friends RLS: own update (receiver can accept/reject, both can update)
CREATE POLICY "WsFriends: own update" ON public.workspace_friends
FOR UPDATE USING (
  requester_id = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1) OR
  receiver_id = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1)
);

-- Friends RLS: own delete (either party can delete/unfriend)
CREATE POLICY "WsFriends: own delete" ON public.workspace_friends
FOR DELETE USING (
  requester_id = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1) OR
  receiver_id = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1)
);

-- Allow post owners to update their own posts
CREATE POLICY "WsPosts: own update" ON public.workspace_posts
FOR UPDATE USING (
  author_id = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1)
);

-- Allow post owners to delete their own posts
CREATE POLICY "WsPosts: own delete" ON public.workspace_posts
FOR DELETE USING (
  author_id = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1) OR is_admin()
);

-- Allow comment owners to update their own comments
CREATE POLICY "WsComments: own update" ON public.workspace_post_comments
FOR UPDATE USING (
  author_id = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1)
);

-- Allow group creators to delete their own groups
CREATE POLICY "WsGroups: creator delete" ON public.workspace_groups
FOR DELETE USING (
  created_by = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1) OR is_admin()
);

-- Allow DM message deletion by sender or admin
CREATE POLICY "DmMsg: own delete" ON public.dm_messages
FOR DELETE USING (
  sender_id = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1) OR is_admin()
);

-- Allow DM conversation deletion
CREATE POLICY "DmConv: own delete" ON public.dm_conversations
FOR DELETE USING (
  participant_1 = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1) OR
  participant_2 = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1) OR
  is_admin()
);

-- Allow group message deletion by sender or admin
CREATE POLICY "WsGroupMsg: own delete" ON public.workspace_group_messages
FOR DELETE USING (
  sender_id = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1) OR is_admin()
);

-- Enable realtime for friends
ALTER PUBLICATION supabase_realtime ADD TABLE public.workspace_friends;
