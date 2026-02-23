
-- Create comment replies table
CREATE TABLE public.workspace_comment_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID NOT NULL REFERENCES public.workspace_post_comments(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  edited_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.workspace_comment_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "CommentReplies: read" ON public.workspace_comment_replies
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "CommentReplies: insert" ON public.workspace_comment_replies
  FOR INSERT WITH CHECK (author_id = (SELECT p.id FROM profiles p WHERE p.user_id = auth.uid() LIMIT 1));

CREATE POLICY "CommentReplies: own delete" ON public.workspace_comment_replies
  FOR DELETE USING (author_id = (SELECT p.id FROM profiles p WHERE p.user_id = auth.uid() LIMIT 1) OR is_admin());

CREATE POLICY "CommentReplies: own update" ON public.workspace_comment_replies
  FOR UPDATE USING (author_id = (SELECT p.id FROM profiles p WHERE p.user_id = auth.uid() LIMIT 1) OR is_admin());

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.workspace_comment_replies;
