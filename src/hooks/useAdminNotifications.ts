import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AdminNotifications {
  partnerRequests: number;
  advisorRequests: number;
  employeeInvitations: number;
  benefitApplications: number;
  contactSubmissions: number;
  pendingBookings: number;
  total: number;
  loading: boolean;
  refresh: () => void;
}

export const useAdminNotifications = (): AdminNotifications => {
  const [counts, setCounts] = useState({
    partnerRequests: 0,
    advisorRequests: 0,
    employeeInvitations: 0,
    benefitApplications: 0,
    contactSubmissions: 0,
    pendingBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    const [pr, ar, ei, ba, cs, bk] = await Promise.all([
      supabase.from("partnership_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("advisor_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("customer_employee_invitations").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("benefit_agreement_applications").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("contact_submissions").select("id", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "pending"),
    ]);
    setCounts({
      partnerRequests: pr.count || 0,
      advisorRequests: ar.count || 0,
      employeeInvitations: ei.count || 0,
      benefitApplications: ba.count || 0,
      contactSubmissions: cs.count || 0,
      pendingBookings: bk.count || 0,
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch();
    const interval = setInterval(fetch, 30000);
    return () => clearInterval(interval);
  }, [fetch]);

  const total =
    counts.partnerRequests +
    counts.advisorRequests +
    counts.employeeInvitations +
    counts.benefitApplications +
    counts.contactSubmissions +
    counts.pendingBookings;

  return { ...counts, total, loading, refresh: fetch };
};
