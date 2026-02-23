
-- Create comment likes table
CREATE TABLE public.workspace_comment_likes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id uuid NOT NULL REFERENCES public.workspace_post_comments(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(comment_id, profile_id)
);

ALTER TABLE public.workspace_comment_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "CommentLikes: authenticated read" ON public.workspace_comment_likes
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "CommentLikes: own insert" ON public.workspace_comment_likes
  FOR INSERT WITH CHECK (
    profile_id = (SELECT p.id FROM profiles p WHERE p.user_id = auth.uid() LIMIT 1)
  );

CREATE POLICY "CommentLikes: own delete" ON public.workspace_comment_likes
  FOR DELETE USING (
    profile_id = (SELECT p.id FROM profiles p WHERE p.user_id = auth.uid() LIMIT 1)
  );

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.workspace_comment_likes;
