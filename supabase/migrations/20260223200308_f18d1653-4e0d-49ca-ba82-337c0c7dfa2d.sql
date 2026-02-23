-- Add membership status to group members for invite/request flow
ALTER TABLE public.workspace_group_members
ADD COLUMN status TEXT NOT NULL DEFAULT 'approved';

-- For existing members, they stay approved. New joins will be 'pending'.