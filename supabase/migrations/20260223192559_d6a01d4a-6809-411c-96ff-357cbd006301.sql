
-- Workspace notifications table
CREATE TABLE public.workspace_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  actor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'feed_post', 'feed_comment', 'feed_reaction', 'group_message', 'dm_message', 'friend_request'
  reference_id TEXT, -- id of the post/message/group
  reference_type TEXT, -- 'post', 'comment', 'group', 'dm_conversation'
  title TEXT,
  body TEXT,
  image_url TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.workspace_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notifications"
  ON public.workspace_notifications FOR SELECT
  USING (recipient_id = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1));

CREATE POLICY "Users can update own notifications"
  ON public.workspace_notifications FOR UPDATE
  USING (recipient_id = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1));

CREATE POLICY "Users can delete own notifications"
  ON public.workspace_notifications FOR DELETE
  USING (recipient_id = (SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1));

CREATE POLICY "Authenticated users can insert notifications"
  ON public.workspace_notifications FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Index for fast lookups
CREATE INDEX idx_ws_notifications_recipient ON public.workspace_notifications(recipient_id, read, created_at DESC);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.workspace_notifications;
