
-- Allow users to delete their own chat messages
CREATE POLICY "ChatMsg: own delete" ON public.chat_messages
  FOR DELETE USING (
    sender_id = (SELECT p.id FROM profiles p WHERE p.user_id = auth.uid() LIMIT 1)
  );

-- Allow users to delete their own comments  
CREATE POLICY "PostComments: own delete" ON public.workspace_post_comments
  FOR DELETE USING (
    author_id = (SELECT p.id FROM profiles p WHERE p.user_id = auth.uid() LIMIT 1)
  );
