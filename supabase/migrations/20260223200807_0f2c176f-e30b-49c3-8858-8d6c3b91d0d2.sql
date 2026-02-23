
-- Group message read receipts
CREATE TABLE public.group_message_reads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES public.workspace_group_messages(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(message_id, profile_id)
);

ALTER TABLE public.group_message_reads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view reads" ON public.group_message_reads FOR SELECT USING (true);
CREATE POLICY "Users can insert own reads" ON public.group_message_reads FOR INSERT WITH CHECK (profile_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE INDEX idx_group_message_reads_message ON public.group_message_reads(message_id);
CREATE INDEX idx_group_message_reads_profile ON public.group_message_reads(profile_id);
