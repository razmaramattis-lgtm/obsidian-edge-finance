CREATE POLICY "WsPosts: author read own" ON public.workspace_posts
FOR SELECT TO authenticated USING (author_id = private_utils.current_profile_id(auth.uid()));