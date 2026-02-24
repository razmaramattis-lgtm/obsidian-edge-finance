import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface PendingItem {
  id: string;
  label: string;
  sublabel: string;
  table: string;
  statusField: string;
  category: string;
}

export interface AdminNotifications {
  partnerRequests: number;
  advisorRequests: number;
  employeeInvitations: number;
  benefitApplications: number;
  contactSubmissions: number;
  pendingBookings: number;
  accountFeedback: number;
  jobApplications: number;
  openApplications: number;
  total: number;
  loading: boolean;
  items: PendingItem[];
  refresh: () => void;
  approve: (item: PendingItem) => Promise<void>;
  reject: (item: PendingItem) => Promise<void>;
}

export const useAdminNotifications = (): AdminNotifications => {
  const [counts, setCounts] = useState({
    partnerRequests: 0,
    advisorRequests: 0,
    employeeInvitations: 0,
    benefitApplications: 0,
    contactSubmissions: 0,
    pendingBookings: 0,
    accountFeedback: 0,
    jobApplications: 0,
    openApplications: 0,
  });
  const [items, setItems] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    const [pr, ar, ei, ba, cs, bk, af, ja, oa] = await Promise.all([
      supabase.from("partnership_requests").select("id, status, company_id, message", { count: "exact" }).eq("status", "pending").limit(10),
      supabase.from("advisor_requests").select("id, status, company_id, message", { count: "exact" }).eq("status", "pending").limit(10),
      supabase.from("customer_employee_invitations").select("id, status, employee_name, employee_email, company_id", { count: "exact" }).eq("status", "pending").limit(10),
      supabase.from("benefit_agreement_applications").select("id, status, title, company_id", { count: "exact" }).eq("status", "pending").limit(10),
      supabase.from("contact_submissions").select("id, status, company_name, contact_person, email", { count: "exact" }).eq("status", "new").limit(10),
      supabase.from("bookings").select("id, status, customer_name, company_name, booking_date, booking_time", { count: "exact" }).eq("status", "pending").limit(10),
      supabase.from("account_feedback").select("id, status, search_term, top_result_account, top_result_name, message", { count: "exact" }).eq("status", "new").limit(10),
      supabase.from("job_applications").select("id, status, full_name, email, job_listing_id", { count: "exact" }).eq("status", "new").limit(10),
      supabase.from("open_applications").select("id, status, full_name, email, preferred_category", { count: "exact" }).eq("status", "new").limit(10),
    ]);

    setCounts({
      partnerRequests: pr.count || 0,
      advisorRequests: ar.count || 0,
      employeeInvitations: ei.count || 0,
      benefitApplications: ba.count || 0,
      contactSubmissions: cs.count || 0,
      pendingBookings: bk.count || 0,
      accountFeedback: af.count || 0,
      jobApplications: ja.count || 0,
      openApplications: oa.count || 0,
    });

    const pendingItems: PendingItem[] = [];

    (pr.data || []).forEach(r => pendingItems.push({
      id: r.id, label: "Avtaleforespørsel", sublabel: r.message || "Ny forespørsel",
      table: "partnership_requests", statusField: "status", category: "partner_requests",
    }));
    (ar.data || []).forEach(r => pendingItems.push({
      id: r.id, label: "Rådgiverforespørsel", sublabel: r.message || "Ny forespørsel",
      table: "advisor_requests", statusField: "status", category: "advisor_requests",
    }));
    (ei.data || []).forEach(r => pendingItems.push({
      id: r.id, label: "Ansattinvitasjon", sublabel: r.employee_name + " – " + r.employee_email,
      table: "customer_employee_invitations", statusField: "status", category: "employee_invitations",
    }));
    (ba.data || []).forEach(r => pendingItems.push({
      id: r.id, label: "Fordelsavtale-søknad", sublabel: r.title,
      table: "benefit_agreement_applications", statusField: "status", category: "benefit_applications",
    }));
    (cs.data || []).forEach(r => pendingItems.push({
      id: r.id, label: "Ny henvendelse", sublabel: (r.contact_person || r.company_name || r.email) ?? "Ukjent",
      table: "contact_submissions", statusField: "status", category: "contact_submissions",
    }));
    (bk.data || []).forEach(r => pendingItems.push({
      id: r.id, label: "Booking", sublabel: `${r.customer_name} – ${r.booking_date}`,
      table: "bookings", statusField: "status", category: "bookings",
    }));
    ((af.data as any[]) || []).forEach(r => pendingItems.push({
      id: r.id, label: "Kontohjelp-melding", sublabel: `«${r.search_term}»${r.top_result_account ? ` → ${r.top_result_account} ${r.top_result_name}` : ""}`,
      table: "account_feedback", statusField: "status", category: "account_feedback",
    }));
    ((ja.data as any[]) || []).forEach(r => pendingItems.push({
      id: r.id, label: "Jobbsøknad", sublabel: r.full_name + " – " + r.email,
      table: "job_applications", statusField: "status", category: "job_applications",
    }));
    ((oa.data as any[]) || []).forEach(r => pendingItems.push({
      id: r.id, label: "Åpen søknad", sublabel: r.full_name + " – " + r.email,
      table: "open_applications", statusField: "status", category: "open_applications",
    }));

    setItems(pendingItems);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 30000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  const approve = useCallback(async (item: PendingItem) => {
    const newStatus = item.table === "contact_submissions" ? "contacted"
      : item.table === "account_feedback" ? "handled"
      : "approved";
    await supabase.from(item.table as any).update({ [item.statusField]: newStatus } as any).eq("id", item.id);
    await fetchAll();
  }, [fetchAll]);

  const reject = useCallback(async (item: PendingItem) => {
    const newStatus = item.table === "contact_submissions" ? "archived"
      : item.table === "account_feedback" ? "handled"
      : "rejected";
    await supabase.from(item.table as any).update({ [item.statusField]: newStatus } as any).eq("id", item.id);
    await fetchAll();
  }, [fetchAll]);

  const total =
    counts.partnerRequests +
    counts.advisorRequests +
    counts.employeeInvitations +
    counts.benefitApplications +
    counts.contactSubmissions +
    counts.pendingBookings +
    counts.accountFeedback +
    counts.jobApplications +
    counts.openApplications;

  return { ...counts, total, loading, items, refresh: fetchAll, approve, reject };
};
