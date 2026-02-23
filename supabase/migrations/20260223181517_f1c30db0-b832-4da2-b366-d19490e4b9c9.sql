
-- Add emoji column to comment likes to support multiple reaction types
ALTER TABLE public.workspace_comment_likes ADD COLUMN emoji text NOT NULL DEFAULT '👍';

-- Drop the unique constraint on (comment_id, profile_id) and replace with (comment_id, profile_id, emoji)
ALTER TABLE public.workspace_comment_likes DROP CONSTRAINT workspace_comment_likes_comment_id_profile_id_key;
ALTER TABLE public.workspace_comment_likes ADD CONSTRAINT workspace_comment_likes_comment_profile_emoji_key UNIQUE(comment_id, profile_id, emoji);
