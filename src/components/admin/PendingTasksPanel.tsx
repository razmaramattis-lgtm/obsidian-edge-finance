import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAdminNotifications, PendingItem } from "@/hooks/useAdminNotifications";
import {
  Check, X, ChevronDown, ChevronUp, Inbox, Users, UserPlus,
  Handshake, CalendarDays, Mail, AlertCircle, Loader2
} from "lucide-react";

const categoryConfig: Record<string, { label: string; icon: React.ElementType }> = {
  partner_requests: { label: "Avtaleforespørsler", icon: Inbox },
  advisor_requests: { label: "Rådgiverforespørsler", icon: Users },
  employee_invitations: { label: "Ansattinvitasjoner", icon: UserPlus },
  benefit_applications: { label: "Fordelsavtale-søknader", icon: Handshake },
  bookings: { label: "Ventende bookinger", icon: CalendarDays },
  contact_submissions: { label: "Nye henvendelser", icon: Mail },
};

interface Props {
  onStatusChange?: () => void;
}

const PendingTasksPanel = ({ onStatusChange }: Props) => {
  const notifications = useAdminNotifications();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [details, setDetails] = useState<Record<string, any>>({});

  const grouped = notifications.items.reduce<Record<string, PendingItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const fetchDetail = async (item: PendingItem) => {
    if (details[item.id]) return;
    const { data } = await supabase.from(item.table as any).select("*").eq("id", item.id).single();
    if (data) setDetails(prev => ({ ...prev, [item.id]: data }));
  };

  const toggleExpand = async (item: PendingItem) => {
    if (expandedId === item.id) {
      setExpandedId(null);
    } else {
      setExpandedId(item.id);
      await fetchDetail(item);
    }
  };

  const handleAction = async (item: PendingItem, action: "approve" | "reject") => {
    setLoadingId(item.id);
    if (action === "approve") {
      await notifications.approve(item);
    } else {
      await notifications.reject(item);
    }
    setLoadingId(null);
    setExpandedId(null);
    onStatusChange?.();
  };

  const renderDetail = (item: PendingItem) => {
    const d = details[item.id];
    if (!d) return <Loader2 size={14} className="animate-spin text-muted-foreground mx-auto my-4" />;

    const fields: { label: string; value: string }[] = [];

    switch (item.table) {
      case "partnership_requests":
        if (d.message) fields.push({ label: "Melding", value: d.message });
        if (d.company_id) fields.push({ label: "Selskap-ID", value: d.company_id });
        break;
      case "advisor_requests":
        if (d.message) fields.push({ label: "Melding", value: d.message });
        if (d.company_id) fields.push({ label: "Selskap-ID", value: d.company_id });
        break;
      case "customer_employee_invitations":
        if (d.employee_name) fields.push({ label: "Ansatt", value: d.employee_name });
        if (d.employee_email) fields.push({ label: "E-post", value: d.employee_email });
        if (d.role) fields.push({ label: "Rolle", value: d.role });
        break;
      case "benefit_agreement_applications":
        if (d.title) fields.push({ label: "Tittel", value: d.title });
        if (d.description) fields.push({ label: "Beskrivelse", value: d.description });
        if (d.offering) fields.push({ label: "Tilbud", value: d.offering });
        if (d.website) fields.push({ label: "Nettside", value: d.website });
        if (d.contact_name) fields.push({ label: "Kontaktperson", value: d.contact_name });
        if (d.contact_email) fields.push({ label: "Kontakt-epost", value: d.contact_email });
        break;
      case "contact_submissions":
        if (d.contact_person) fields.push({ label: "Kontaktperson", value: d.contact_person });
        if (d.company_name) fields.push({ label: "Selskap", value: d.company_name });
        if (d.email) fields.push({ label: "E-post", value: d.email });
        if (d.phone) fields.push({ label: "Telefon", value: d.phone });
        if (d.message) fields.push({ label: "Melding", value: d.message });
        if (d.package) fields.push({ label: "Pakke", value: d.package });
        if (d.industry) fields.push({ label: "Bransje", value: d.industry });
        break;
      case "bookings":
        if (d.customer_name) fields.push({ label: "Kunde", value: d.customer_name });
        if (d.company_name) fields.push({ label: "Selskap", value: d.company_name });
        if (d.customer_email) fields.push({ label: "E-post", value: d.customer_email });
        if (d.customer_phone) fields.push({ label: "Telefon", value: d.customer_phone });
        if (d.booking_date) fields.push({ label: "Dato", value: d.booking_date });
        if (d.booking_time) fields.push({ label: "Tid", value: d.booking_time });
        if (d.message) fields.push({ label: "Melding", value: d.message });
        break;
    }

    if (fields.length === 0) {
      return <p className="text-xs text-muted-foreground py-2">Ingen tilleggsdata tilgjengelig.</p>;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 py-2">
        {fields.map(f => (
          <div key={f.label}>
            <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider">{f.label}</p>
            <p className="text-xs text-foreground break-words">{f.value}</p>
          </div>
        ))}
      </div>
    );
  };

  if (notifications.loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={20} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (notifications.items.length === 0) {
    return (
      <div className="text-center py-20">
        <Check size={32} className="mx-auto text-primary/30 mb-3" />
        <h2 className="font-heading text-lg mb-1">Alt er behandlet</h2>
        <p className="text-sm text-muted-foreground">Ingen ventende oppgaver akkurat nå.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <AlertCircle size={18} className="text-destructive" strokeWidth={1.5} />
        <div>
          <h2 className="font-heading text-lg">Ventende oppgaver</h2>
          <p className="text-xs text-muted-foreground">{notifications.total} elementer venter på behandling</p>
        </div>
      </div>

      {Object.entries(grouped).map(([category, items]) => {
        const config = categoryConfig[category] || { label: category, icon: Inbox };
        const Icon = config.icon;
        return (
          <div key={category} className="glass rounded-2xl border border-border/20 overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-3 border-b border-border/10 bg-muted/20">
              <Icon size={15} strokeWidth={1.5} className="text-muted-foreground" />
              <h3 className="text-sm font-medium flex-1">{config.label}</h3>
              <span className="min-w-[20px] h-[20px] flex items-center justify-center rounded-full bg-destructive/10 text-destructive text-[10px] font-bold px-1.5">
                {items.length}
              </span>
            </div>
            <div className="divide-y divide-border/5">
              {items.map(item => (
                <div key={item.id}>
                  <div className="flex items-center gap-3 px-5 py-3 hover:bg-muted/20 transition-colors">
                    <button
                      onClick={() => toggleExpand(item)}
                      className="flex items-center gap-3 flex-1 min-w-0 text-left"
                    >
                      {expandedId === item.id ? (
                        <ChevronUp size={13} className="text-muted-foreground/50 shrink-0" />
                      ) : (
                        <ChevronDown size={13} className="text-muted-foreground/50 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{item.sublabel}</p>
                        <p className="text-[10px] text-muted-foreground">{item.label}</p>
                      </div>
                    </button>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleAction(item, "approve")}
                        disabled={loadingId === item.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
                      >
                        {loadingId === item.id ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
                        Godkjenn
                      </button>
                      <button
                        onClick={() => handleAction(item, "reject")}
                        disabled={loadingId === item.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors disabled:opacity-50"
                      >
                        <X size={11} />
                        Avslå
                      </button>
                    </div>
                  </div>
                  <AnimatePresence>
                    {expandedId === item.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-4 pl-12 border-t border-border/5 bg-muted/10">
                          {renderDetail(item)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PendingTasksPanel;
