
-- Allow customers to insert documents for their own company
CREATE POLICY "CustDoc: own insert"
ON public.customer_documents
FOR INSERT
WITH CHECK (company_id = own_company_id());

-- Allow customers to delete documents for their own company
CREATE POLICY "CustDoc: own delete"
ON public.customer_documents
FOR DELETE
USING (company_id = own_company_id());

-- Allow customers to update documents for their own company
CREATE POLICY "CustDoc: own update"
ON public.customer_documents
FOR UPDATE
USING (company_id = own_company_id());
