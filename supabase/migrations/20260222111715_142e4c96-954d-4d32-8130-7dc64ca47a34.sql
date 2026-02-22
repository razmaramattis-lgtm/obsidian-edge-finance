
-- Table for account search feedback reports
CREATE TABLE public.account_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  search_term TEXT NOT NULL,
  top_result_account TEXT,
  top_result_name TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  admin_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.account_feedback ENABLE ROW LEVEL SECURITY;

-- Anyone can submit feedback (public form)
CREATE POLICY "AccountFeedback: public insert"
  ON public.account_feedback FOR INSERT
  WITH CHECK (true);

-- Only admin can read/update/delete
CREATE POLICY "AccountFeedback: admin read"
  ON public.account_feedback FOR SELECT
  USING (is_admin());

CREATE POLICY "AccountFeedback: admin update"
  ON public.account_feedback FOR UPDATE
  USING (is_admin());

CREATE POLICY "AccountFeedback: admin delete"
  ON public.account_feedback FOR DELETE
  USING (is_admin());

-- Trigger for updated_at
CREATE TRIGGER update_account_feedback_updated_at
  BEFORE UPDATE ON public.account_feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
