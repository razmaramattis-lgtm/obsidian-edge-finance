import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Trash2, Edit2, Eye, EyeOff, Search, X, Briefcase, Users, ChevronDown, ChevronUp, ImagePlus, Loader2, FileText, Inbox, Mail, Phone, Calendar, MapPin, User, ExternalLink, MessageSquare, Clock, Download, CheckSquare, Square, Filter, UserPlus } from "lucide-react";
import { toast } from "sonner";
import RichTextEditor from "./RichTextEditor";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface JobListing {
  id: string; title: string; slug: string; category: string; location: string;
  employment_type: string; work_hours: string; work_language: string; work_location: string;
  num_positions: number; start_date: string; deadline: string | null;
  intro: string | null; description: string | null; qualifications: string | null;
  tasks: string | null; we_offer: string | null; about_company: string | null;
  contact_name: string | null; contact_title: string | null; contact_email: string | null;
  contact_phone: string | null; published: boolean; active: boolean; created_at: string;
  images: string[] | null; highlights: string[] | null;
}

interface JobApplication {
  id: string; job_listing_id: string; full_name: string; email: string; phone: string;
  message: string | null; cv_file_name: string | null; cv_url: string | null;
  status: string; admin_note: string | null; created_at: string;
  address: string | null; city: string | null; postal_code: string | null;
  date_of_birth: string | null;
}

interface OpenApplication {
  id: string; full_name: string; email: string; phone: string;
  linkedin_url: string | null; portfolio_url: string | null;
  preferred_category: string | null; message: string | null;
  cv_file_name: string | null; cv_url: string | null;
  status: string; admin_note: string | null; created_at: string;
  address: string | null; city: string | null; postal_code: string | null;
  date_of_birth: string | null; available_from: string | null;
}

const CATEGORIES = ["Regnskap", "Personal", "Marked", "IT"];
const WORK_LOCATIONS = [
  { value: "Hybridkontor", label: "🏠 Hybrid (kontor + hjemme)" },
  { value: "På kontoret", label: "🏢 På kontoret" },
  { value: "Remote / hjemmekontor", label: "🌐 Remote / hjemmekontor" },
];

const ABOUT_AVARGO = `<p>Avargo er et moderne rådgivningsselskap som leverer tjenester innen regnskap, HR, marked og IT. Vi kombinerer faglig tyngde med teknologisk innovasjon for å gi våre kunder innsikt, trygghet og vekst.</p><p>Hos oss jobber du i et tverrfaglig miljø med høy kompetanse, uten overtid, og med bransjens beste vilkår.</p>`;

const WE_OFFER = `<ul><li>Konkurransedyktig lønn og gode pensjonsvilkår</li><li>Fleksibel arbeidstid uten overtid</li><li>Moderne kontorer og teknologi</li><li>Kontinuerlig faglig utvikling og kursing</li><li>Et inkluderende og sosialt arbeidsmiljø</li><li>Gode forsikringsordninger</li></ul>`;

// Templates per category with work_location dynamic text
const TEMPLATES: Record<string, { title: string; intro: string; description: string; tasks: string; qualifications: string }> = {
  Regnskap: {
    title: "Regnskapsfører",
    intro: "Vi søker en engasjert regnskapsfører som ønsker å jobbe med varierte kunder i et moderne og teknologidrevet miljø. Hos oss får du faglig utvikling, gode vilkår og et sterkt team rundt deg.",
    description: "<p>Vi ser etter en grundig og løsningsorientert regnskapsfører som trives med kundeansvar og ønsker å jobbe i et dynamisk fagmiljø. Du vil ha ansvar for en egen kundeportefølje og jobbe tett med våre rådgivere.</p>",
    tasks: "<ul><li>Løpende bokføring og avstemming for kundeportefølje</li><li>Utarbeidelse av årsregnskap og ligningspapirer</li><li>MVA-oppgaver og skattemeldinger</li><li>Rådgivning innen regnskap og økonomi</li><li>Lønn og personaladministrasjon</li></ul>",
    qualifications: "<ul><li>Regnskapsfører (statsautorisert er et pluss)</li><li>Minimum 2 års relevant erfaring</li><li>God kjennskap til norske regnskapsregler</li><li>Erfaring med Tripletex, Fiken eller tilsvarende</li><li>Gode kommunikasjonsevner på norsk</li></ul>",
  },
  Personal: {
    title: "HR-rådgiver",
    intro: "Vi søker en dyktig HR-rådgiver som vil hjelpe våre kunder med alt innen personalledelse, arbeidsrett og organisasjonsutvikling.",
    description: "<p>Som HR-rådgiver hos Avargo vil du jobbe tett med kunder innen personaladministrasjon, arbeidsrett og organisasjonsutvikling. Du får en variert hverdag med høy grad av selvstendighet.</p>",
    tasks: "<ul><li>Rådgivning innen arbeidsrett og ansettelsesprosesser</li><li>Utarbeidelse av personalhåndbøker og policyer</li><li>Oppfølging av arbeidsmiljø og HMS</li><li>Støtte i omstillings- og endringsprosesser</li><li>Kurs og opplæring for kunders ledere</li></ul>",
    qualifications: "<ul><li>Utdanning innen HR, juss eller lignende</li><li>Erfaring fra HR-rådgivning eller personalledelse</li><li>God kjennskap til norsk arbeidsrett</li><li>Evne til å bygge relasjoner og gi trygg veiledning</li></ul>",
  },
  Marked: {
    title: "Markedsfører",
    intro: "Vi søker en kreativ og analytisk markedsfører som vil hjelpe våre kunder med digital synlighet, annonsering og merkevarebygging.",
    description: "<p>Du vil jobbe med strategi, innholdsproduksjon og digital markedsføring for en rekke kunder. Hos oss får du frihet til å teste nye kanaler og metoder.</p>",
    tasks: "<ul><li>Planlegge og gjennomføre digitale kampanjer</li><li>Innholdsproduksjon for sosiale medier og nettsider</li><li>SEO-optimalisering og Google Ads</li><li>Analysere resultater og optimalisere</li><li>Rådgivning innen merkevare og posisjonering</li></ul>",
    qualifications: "<ul><li>Utdanning innen markedsføring eller kommunikasjon</li><li>Erfaring med digitale kanaler og annonsering</li><li>Gode skriftlige ferdigheter på norsk</li><li>Analytisk og kreativ tilnærming</li></ul>",
  },
  IT: {
    title: "IT-rådgiver / Utvikler",
    intro: "Vi søker en teknisk dyktig IT-rådgiver eller utvikler som vil bygge og vedlikeholde moderne løsninger for våre kunder og interne systemer.",
    description: "<p>Du vil jobbe med utvikling, integrasjoner og teknisk rådgivning i et tverrfaglig team. Vi bruker moderne teknologi og verdsetter innovasjon og kvalitet.</p>",
    tasks: "<ul><li>Utvikling og vedlikehold av nettsider og webapplikasjoner</li><li>Integrering av systemer og API-er</li><li>Teknisk rådgivning og behovsanalyse</li><li>Automatisering av prosesser</li><li>Bidra til intern produktutvikling</li></ul>",
    qualifications: "<ul><li>Relevant utdanning innen IT eller informatikk</li><li>Erfaring med React, TypeScript eller lignende</li><li>Kjennskap til skyløsninger og databaser</li><li>Evne til å forstå forretningsbehov og oversette til tekniske løsninger</li></ul>",
  },
};

const emptyForm = {
  title: "", slug: "", category: "Regnskap", location: "Skien",
  employment_type: "Fast, heltid 100%", work_hours: "Dagtid, ukedager",
  work_language: "Norsk eller engelsk", work_location: "Hybridkontor",
  num_positions: 1, start_date: "Etter avtale", deadline: "",
  intro: "", description: "", qualifications: "", tasks: "", we_offer: WE_OFFER,
  about_company: ABOUT_AVARGO, contact_name: "Emil Follaug", contact_title: "Daglig leder",
  contact_email: "Emil@avargo.no", contact_phone: "464 25 354",
  published: false, active: true, images: [] as string[], highlights: [] as string[],
};

const JobListingsPanel = () => {
  const { profile } = useAuth();
  const [listings, setListings] = useState<JobListing[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [openApps, setOpenApps] = useState<OpenApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<JobListing | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [viewApps, setViewApps] = useState<string | null>(null);
  const [showOpenApps, setShowOpenApps] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<"listings" | "applications" | "open" | "fri">("listings");
  const [expandedApp, setExpandedApp] = useState<string | null>(null);
  const [expandedOpenApp, setExpandedOpenApp] = useState<string | null>(null);
  const [appNotes, setAppNotes] = useState<Record<string, string>>({});
  const imgInputRef = useRef<HTMLInputElement>(null);
  const [openCatFilter, setOpenCatFilter] = useState<string>("alle");
  const [openStatusFilter, setOpenStatusFilter] = useState<string>("alle");
  const [jobCatFilter, setJobCatFilter] = useState<string>("alle");
  const [jobStatusFilter, setJobStatusFilter] = useState<string>("alle");
  const [selectedOpenApps, setSelectedOpenApps] = useState<Set<string>>(new Set());
  const [selectedJobApps, setSelectedJobApps] = useState<Set<string>>(new Set());
  const [interviewConfirm, setInterviewConfirm] = useState<{
    appId: string;
    name: string;
    email: string;
    table: "job_applications" | "open_applications";
    positionTitle?: string;
  } | null>(null);
  const [interviewType, setInterviewType] = useState<"standard" | "digital" | "fysisk">("standard");
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [interviewTeamsLink, setInterviewTeamsLink] = useState("");
  const [interviewLocation, setInterviewLocation] = useState("");
  const [interviewSending, setInterviewSending] = useState(false);
  const [rejectionConfirm, setRejectionConfirm] = useState<{
    appId: string;
    name: string;
    email: string;
    table: "job_applications" | "open_applications";
    positionTitle?: string;
  } | null>(null);
  const [rejectionFeedback, setRejectionFeedback] = useState("");
  const [rejectionSending, setRejectionSending] = useState(false);
  const [offerConfirm, setOfferConfirm] = useState<{
    appId: string;
    name: string;
    email: string;
    table: "job_applications" | "open_applications";
    positionTitle?: string;
  } | null>(null);
  const [offerStartDate, setOfferStartDate] = useState("");
  const [offerSalary, setOfferSalary] = useState("");
  const [offerWorkLocation, setOfferWorkLocation] = useState("");
  const [offerSending, setOfferSending] = useState(false);

  const fetchAll = async () => {
    const [{ data: jobs }, { data: apps }, { data: opens }] = await Promise.all([
      supabase.from("job_listings").select("*").order("created_at", { ascending: false }),
      supabase.from("job_applications").select("*").order("created_at", { ascending: false }),
      supabase.from("open_applications").select("*").order("created_at", { ascending: false }),
    ]);
    setListings((jobs as JobListing[]) || []);
    setApplications((apps as JobApplication[]) || []);
    setOpenApps((opens as OpenApplication[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const slugify = (t: string) => t.toLowerCase().replace(/[^a-z0-9æøå]+/g, "-").replace(/^-|-$/g, "");

  const applyTemplate = (category: string) => {
    const tpl = TEMPLATES[category];
    if (!tpl) return;
    const workLocText = WORK_LOCATIONS.find(w => w.value === form.work_location)?.label.replace(/^[^ ]+ /, '') || form.work_location;
    setForm(prev => ({
      ...prev,
      category,
      title: tpl.title,
      slug: slugify(tpl.title + "-" + prev.location),
      intro: tpl.intro.replace(/\{work_location\}/g, workLocText),
      description: tpl.description.replace(/\{work_location\}/g, workLocText),
      tasks: tpl.tasks,
      qualifications: tpl.qualifications,
      we_offer: WE_OFFER,
      about_company: ABOUT_AVARGO,
    }));
  };

  const updateWorkLocation = (wl: string) => {
    setForm(prev => ({ ...prev, work_location: wl }));
  };

  const uploadImage = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) { toast.error("Maks 5 MB per bilde"); return; }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `job-images/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("workspace-uploads").upload(path, file);
    if (error) { toast.error("Kunne ikke laste opp bilde"); setUploading(false); return; }
    const { data } = supabase.storage.from("workspace-uploads").getPublicUrl(path);
    setForm(prev => ({ ...prev, images: [...prev.images, data.publicUrl] }));
    setUploading(false);
  };

  const removeImage = (idx: number) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const slug = form.slug || slugify(form.title);
    const payload = { ...form, slug, deadline: form.deadline || null };
    if (editing) {
      const { error } = await supabase.from("job_listings").update(payload).eq("id", editing.id);
      if (error) toast.error("Kunne ikke lagre"); else toast.success("Stilling oppdatert");
    } else {
      const { error } = await supabase.from("job_listings").insert([payload]);
      if (error) toast.error(error.message); else toast.success("Stilling opprettet");
    }
    setShowForm(false); setEditing(null); setForm(emptyForm);
    fetchAll(); setSaving(false);
  };

  const del = async (id: string) => {
    if (!confirm("Slett denne stillingsannonsen?")) return;
    await supabase.from("job_listings").delete().eq("id", id);
    toast.success("Slettet"); fetchAll();
  };

  const togglePublish = async (job: JobListing) => {
    await supabase.from("job_listings").update({ published: !job.published }).eq("id", job.id);
    fetchAll();
  };

  const sendRejectionEmail = async (name: string, email: string, positionTitle?: string, feedback?: string) => {
    try {
      const { error } = await supabase.functions.invoke("rejection-email", {
        body: {
          applicant_name: name,
          applicant_email: email,
          position_title: positionTitle || null,
          rejection_feedback: feedback || null,
          sender_name: profile?.name || "Rekruttering",
          sender_title: profile?.title || null,
        },
      });
      if (error) throw error;
      toast.success("Avslagsmelding sendt til " + name);
    } catch (err) {
      console.error("Rejection email failed:", err);
      toast.error("Kunne ikke sende avslagsmelding");
    }
  };

  const confirmInterviewInvitation = async () => {
    if (!interviewConfirm) return;
    setInterviewSending(true);
    const { appId, name, email, table, positionTitle } = interviewConfirm;
    await supabase.from(table).update({ status: "innkalt_intervju" }).eq("id", appId);
    try {
      const { error } = await supabase.functions.invoke("interview-invitation", {
        body: {
          applicant_name: name,
          applicant_email: email,
          position_title: positionTitle || null,
          sender_name: profile?.name || "Rekruttering",
          sender_email: profile?.email || "kontakt@avargo.no",
          sender_phone: profile?.phone || null,
          sender_title: profile?.title || null,
          interview_date: interviewDate.trim() || null,
          interview_time: interviewTime.trim() || null,
          interview_type: interviewType === "standard" ? null : interviewType,
          teams_link: interviewTeamsLink.trim() || null,
          interview_location: interviewLocation.trim() || null,
        },
      });
      if (error) throw error;
      toast.success("Intervjuinnkalling sendt til " + name);
    } catch (err) {
      console.error("Interview invitation failed:", err);
      toast.error("Kunne ikke sende intervjuinnkalling");
    }
    setInterviewConfirm(null);
    setInterviewSending(false);
    setInterviewType("standard");
    setInterviewDate("");
    setInterviewTime("");
    setInterviewTeamsLink("");
    setInterviewLocation("");
    fetchAll();
  };

  const hireApplicant = async (name: string, email: string) => {
    const tempPassword = crypto.randomUUID().slice(0, 12);
    try {
      const { data, error } = await supabase.functions.invoke("create-employee", {
        body: {
          email,
          password: tempPassword,
          name,
          role: "employee",
          approver_name: profile?.name || "Avargo",
          approver_title: profile?.title || "Rekruttering",
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success(`${name} er opprettet som ansatt og har mottatt innloggingsdetaljer`);
    } catch (err: any) {
      console.error("Hire error:", err);
      toast.error("Kunne ikke opprette ansatt: " + (err.message || "Ukjent feil"));
    }
  };

  const updateAppStatus = async (appId: string, status: string) => {
    const app = applications.find(a => a.id === appId);
    if (app && status === "innkalt_intervju") {
      const job = listings.find(j => j.id === app.job_listing_id);
      setInterviewConfirm({ appId, name: app.full_name, email: app.email, table: "job_applications", positionTitle: job?.title });
      return;
    }
    if (app && status === "avslått") {
      const job = listings.find(j => j.id === app.job_listing_id);
      setRejectionFeedback("");
      setRejectionConfirm({ appId, name: app.full_name, email: app.email, table: "job_applications", positionTitle: job?.title });
      return;
    }
    if (app && status === "tilbud") {
      const job = listings.find(j => j.id === app.job_listing_id);
      setOfferStartDate(""); setOfferSalary(""); setOfferWorkLocation("");
      setOfferConfirm({ appId, name: app.full_name, email: app.email, table: "job_applications", positionTitle: job?.title });
      return;
    }
    await supabase.from("job_applications").update({ status }).eq("id", appId);
    if (app) {
      if (status === "ansatt") {
        await hireApplicant(app.full_name, app.email);
      }
    }
    fetchAll();
  };

  const filtered = listings.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.category.toLowerCase().includes(search.toLowerCase()) ||
    j.location.toLowerCase().includes(search.toLowerCase())
  );

  const inputCls = "w-full h-9 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";

  if (loading) return <div className="text-muted-foreground text-sm">Laster…</div>;

  const updateOpenAppStatus = async (appId: string, status: string) => {
    const app = openApps.find(a => a.id === appId);
    if (app && status === "innkalt_intervju") {
      setInterviewConfirm({ appId, name: app.full_name, email: app.email, table: "open_applications" });
      return;
    }
    if (app && status === "avslått") {
      setRejectionFeedback("");
      setRejectionConfirm({ appId, name: app.full_name, email: app.email, table: "open_applications" });
      return;
    }
    if (app && status === "tilbud") {
      setOfferStartDate(""); setOfferSalary(""); setOfferWorkLocation("");
      setOfferConfirm({ appId, name: app.full_name, email: app.email, table: "open_applications" });
      return;
    }
    await supabase.from("open_applications").update({ status }).eq("id", appId);
    if (app) {
      if (status === "ansatt") {
        await hireApplicant(app.full_name, app.email);
      }
    }
    fetchAll();
  };

  const saveAppNote = async (appId: string, table: "job_applications" | "open_applications") => {
    const note = appNotes[appId];
    if (note === undefined) return;
    await supabase.from(table).update({ admin_note: note }).eq("id", appId);
    toast.success("Notat lagret");
    fetchAll();
  };

  const getSignedCvUrl = async (cvUrl: string | null) => {
    if (!cvUrl) return null;
    // Extract path from the full URL
    const match = cvUrl.match(/cv-uploads\/(.+)$/);
    if (!match) return cvUrl;
    const { data } = await supabase.storage.from("cv-uploads").createSignedUrl(match[1], 3600);
    return data?.signedUrl || cvUrl;
  };

  const openCv = async (cvUrl: string | null) => {
    const url = await getSignedCvUrl(cvUrl);
    if (url) window.open(url, "_blank");
    else toast.error("Kunne ikke åpne CV");
  };

  const deleteOpenApp = async (id: string) => {
    if (!confirm("Slett denne søknaden?")) return;
    await supabase.from("open_applications").delete().eq("id", id);
    setSelectedOpenApps(prev => { const n = new Set(prev); n.delete(id); return n; });
    toast.success("Søknad slettet"); fetchAll();
  };

  const bulkDeleteOpenApps = async () => {
    if (selectedOpenApps.size === 0) return;
    if (!confirm(`Slett ${selectedOpenApps.size} søknad(er)?`)) return;
    const ids = Array.from(selectedOpenApps);
    await supabase.from("open_applications").delete().in("id", ids);
    setSelectedOpenApps(new Set());
    toast.success(`${ids.length} søknad(er) slettet`); fetchAll();
  };

  const deleteJobApp = async (id: string) => {
    if (!confirm("Slett denne søknaden?")) return;
    await supabase.from("job_applications").delete().eq("id", id);
    setSelectedJobApps(prev => { const n = new Set(prev); n.delete(id); return n; });
    toast.success("Søknad slettet"); fetchAll();
  };

  const bulkDeleteJobApps = async () => {
    if (selectedJobApps.size === 0) return;
    if (!confirm(`Slett ${selectedJobApps.size} søknad(er)?`)) return;
    const ids = Array.from(selectedJobApps);
    await supabase.from("job_applications").delete().in("id", ids);
    setSelectedJobApps(new Set());
    toast.success(`${ids.length} søknad(er) slettet`); fetchAll();
  };

  const toggleSelectOpen = (id: string) => {
    setSelectedOpenApps(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const toggleSelectJob = (id: string) => {
    setSelectedJobApps(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const STATUS_LABELS: Record<string, string> = {
    ny: "Ny", kontaktet: "Kontaktet", under_vurdering: "Under vurdering",
    innkalt_intervju: "Innkalt til intervju", intervju: "Under intervju",
    tilbud: "Tilbud", ansatt: "Ansatt", avslått: "Avslått",
  };

  // Separate Avargo Fri from regular open apps
  const regularOpenApps = openApps.filter(app => !app.message?.startsWith("[AVARGO FRI]"));
  const friOpenApps = openApps.filter(app => app.message?.startsWith("[AVARGO FRI]"));

  const filteredOpenApps = regularOpenApps.filter(app => {
    if (openCatFilter !== "alle" && app.preferred_category !== openCatFilter) return false;
    if (openStatusFilter !== "alle" && app.status !== openStatusFilter) return false;
    return true;
  });

  const filteredFriApps = friOpenApps.filter(app => {
    if (openCatFilter !== "alle" && app.preferred_category !== openCatFilter) return false;
    if (openStatusFilter !== "alle" && app.status !== openStatusFilter) return false;
    return true;
  });

  // All job applications with category from listing
  const allJobAppsWithCategory = applications.map(app => {
    const job = listings.find(j => j.id === app.job_listing_id);
    return { ...app, jobCategory: job?.category || "Ukjent", jobTitle: job?.title || "Ukjent stilling" };
  });

  const filteredAllJobApps = allJobAppsWithCategory.filter(app => {
    if (jobCatFilter !== "alle" && app.jobCategory !== jobCatFilter) return false;
    if (jobStatusFilter !== "alle" && app.status !== jobStatusFilter) return false;
    return true;
  });

  const filteredJobApps = (jobId: string) => applications.filter(a => {
    if (a.job_listing_id !== jobId) return false;
    if (jobStatusFilter !== "alle" && a.status !== jobStatusFilter) return false;
    return true;
  });

  const renderOpenAppCard = (app: OpenApplication) => {
    const isExpanded = expandedOpenApp === app.id;
    const isSelected = selectedOpenApps.has(app.id);
    return (
      <div key={app.id} className={`glass rounded-2xl border overflow-hidden transition-colors ${isSelected ? "border-primary/40 bg-primary/5" : "border-border/20"}`}>
        <div className="flex items-center">
          <button type="button" onClick={() => toggleSelectOpen(app.id)}
            className="px-3 py-3 text-muted-foreground hover:text-primary transition-colors shrink-0">
            {isSelected ? <CheckSquare size={14} className="text-primary" /> : <Square size={14} />}
          </button>
          <button type="button" onClick={() => setExpandedOpenApp(isExpanded ? null : app.id)}
            className="flex-1 px-2 py-3 flex items-center justify-between gap-3 text-left hover:bg-muted/10 transition-colors">
            <div className="min-w-0 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <User size={14} className="text-primary" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium">{app.full_name}</p>
                  {app.preferred_category && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">{app.preferred_category}</span>
                  )}
                  {app.message?.startsWith("[AVARGO FRI]") && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-secondary/10 text-secondary">Avargo Fri</span>
                  )}
                  <span className={`text-[9px] px-2 py-0.5 rounded-full ${
                    app.status === "ny" ? "bg-primary/10 text-primary" :
                    app.status === "innkalt_intervju" ? "bg-emerald-100 text-emerald-700" :
                    app.status === "intervju" ? "bg-accent/50 text-accent-foreground" :
                    app.status === "avslått" ? "bg-destructive/10 text-destructive" :
                    app.status === "ansatt" ? "bg-primary/20 text-primary" :
                    "bg-muted text-muted-foreground"
                  }`}>{STATUS_LABELS[app.status] || app.status}</span>
                </div>
                <p className="text-[10px] text-muted-foreground">{app.email} · {new Date(app.created_at).toLocaleDateString("nb-NO")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button type="button" onClick={e => { e.stopPropagation(); deleteOpenApp(app.id); }}
                className="text-muted-foreground hover:text-destructive transition-colors p-1">
                <Trash2 size={12} />
              </button>
              {isExpanded ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
            </div>
          </button>
        </div>

        {isExpanded && (
          <div className="border-t border-border/10 px-5 py-4 space-y-4 bg-muted/5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-background/50 border border-border/10">
                <Mail size={14} className="text-primary shrink-0" />
                <div>
                  <p className="text-[9px] text-muted-foreground/60 uppercase tracking-wider">E-post</p>
                  <a href={`mailto:${app.email}`} className="text-xs text-foreground hover:text-primary transition-colors">{app.email}</a>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-background/50 border border-border/10">
                <Phone size={14} className="text-primary shrink-0" />
                <div>
                  <p className="text-[9px] text-muted-foreground/60 uppercase tracking-wider">Telefon</p>
                  <a href={`tel:${app.phone}`} className="text-xs text-foreground hover:text-primary transition-colors">{app.phone}</a>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-background/50 border border-border/10">
                <Calendar size={14} className="text-primary shrink-0" />
                <div>
                  <p className="text-[9px] text-muted-foreground/60 uppercase tracking-wider">Søkt</p>
                  <p className="text-xs">{new Date(app.created_at).toLocaleString("nb-NO", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                </div>
              </div>
              {app.preferred_category && (
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-background/50 border border-border/10">
                  <Briefcase size={14} className="text-primary shrink-0" />
                  <div>
                    <p className="text-[9px] text-muted-foreground/60 uppercase tracking-wider">Ønsket fagområde</p>
                    <p className="text-xs">{app.preferred_category}</p>
                  </div>
                </div>
              )}
              {(app.address || app.city) && (
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-background/50 border border-border/10">
                  <MapPin size={14} className="text-primary shrink-0" />
                  <div>
                    <p className="text-[9px] text-muted-foreground/60 uppercase tracking-wider">Adresse</p>
                    <p className="text-xs">{[app.address, app.postal_code, app.city].filter(Boolean).join(", ")}</p>
                  </div>
                </div>
              )}
              {app.date_of_birth && (
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-background/50 border border-border/10">
                  <User size={14} className="text-primary shrink-0" />
                  <div>
                    <p className="text-[9px] text-muted-foreground/60 uppercase tracking-wider">Fødselsdato</p>
                    <p className="text-xs">{new Date(app.date_of_birth).toLocaleDateString("nb-NO")}</p>
                  </div>
                </div>
              )}
              {app.available_from && (
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-background/50 border border-border/10">
                  <Clock size={14} className="text-primary shrink-0" />
                  <div>
                    <p className="text-[9px] text-muted-foreground/60 uppercase tracking-wider">Tilgjengelig fra</p>
                    <p className="text-xs">{app.available_from}</p>
                  </div>
                </div>
              )}
            </div>

            {(app.linkedin_url || app.portfolio_url) && (
              <div className="flex flex-wrap gap-2">
                {app.linkedin_url && (
                  <a href={app.linkedin_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs hover:bg-primary/20 transition-colors">
                    <ExternalLink size={11} /> LinkedIn-profil
                  </a>
                )}
                {app.portfolio_url && (
                  <a href={app.portfolio_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs hover:bg-primary/20 transition-colors">
                    <ExternalLink size={11} /> Portefølje
                  </a>
                )}
              </div>
            )}

            {app.cv_file_name && (
              <div className="p-3 rounded-xl bg-background/50 border border-border/10">
                <p className="text-[9px] text-muted-foreground/60 uppercase tracking-wider mb-2">CV / Vedlegg</p>
                <button onClick={() => openCv(app.cv_url)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors">
                  <Download size={13} /> {app.cv_file_name}
                </button>
              </div>
            )}

            {app.message && (
              <div className="p-3 rounded-xl bg-background/50 border border-border/10">
                <p className="text-[9px] text-muted-foreground/60 uppercase tracking-wider mb-2">
                  <MessageSquare size={10} className="inline mr-1" />Melding fra søker
                </p>
                <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap">{app.message}</p>
              </div>
            )}

            <div className="p-3 rounded-xl bg-background/50 border border-border/10">
              <p className="text-[9px] text-muted-foreground/60 uppercase tracking-wider mb-2">Internt notat</p>
              <textarea
                value={appNotes[app.id] ?? app.admin_note ?? ""}
                onChange={e => setAppNotes(prev => ({ ...prev, [app.id]: e.target.value }))}
                placeholder="Skriv et internt notat om søkeren…"
                rows={2}
                className="w-full rounded-lg border border-border/20 bg-muted/20 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 mb-2"
              />
              <button onClick={() => saveAppNote(app.id, "open_applications")}
                className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[10px] font-medium hover:opacity-90">
                Lagre notat
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">Status:</span>
                <select value={app.status} onChange={e => updateOpenAppStatus(app.id, e.target.value)}
                  className="h-8 rounded-lg border border-border/30 bg-muted/30 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="ny">Ny</option>
                  <option value="kontaktet">Kontaktet</option>
                  <option value="under_vurdering">Under vurdering</option>
                  <option value="innkalt_intervju">Innkalt til intervju</option>
                  <option value="intervju">Under intervju</option>
                  <option value="tilbud">Tilbud</option>
                  <option value="ansatt">Ansatt</option>
                  <option value="avslått">Avslått</option>
                </select>
              </div>
              <div className="flex gap-2">
                <a href={`mailto:${app.email}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[10px] font-medium hover:opacity-90 transition-opacity">
                  <Mail size={11} /> Send e-post
                </a>
                <a href={`tel:${app.phone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-[10px] font-medium hover:opacity-90 transition-opacity">
                  <Phone size={11} /> Ring
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border/10 pb-2 overflow-x-auto">
        <button onClick={() => setActiveTab("listings")}
          className={`px-4 py-2 rounded-t-xl text-xs font-medium transition-all whitespace-nowrap ${activeTab === "listings" ? "bg-primary/10 text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}>
          <Briefcase size={12} className="inline mr-1.5" />Stillinger ({listings.length})
        </button>
        <button onClick={() => setActiveTab("applications")}
          className={`px-4 py-2 rounded-t-xl text-xs font-medium transition-all whitespace-nowrap ${activeTab === "applications" ? "bg-primary/10 text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}>
          <Users size={12} className="inline mr-1.5" />S&#248;knader ({applications.length})
        </button>
        <button onClick={() => setActiveTab("open")}
          className={`px-4 py-2 rounded-t-xl text-xs font-medium transition-all whitespace-nowrap ${activeTab === "open" ? "bg-primary/10 text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}>
          <Inbox size={12} className="inline mr-1.5" />&#197;pne s&#248;knader ({regularOpenApps.length})
        </button>
        <button onClick={() => setActiveTab("fri")}
          className={`px-4 py-2 rounded-t-xl text-xs font-medium transition-all whitespace-nowrap ${activeTab === "fri" ? "bg-primary/10 text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}>
          <Inbox size={12} className="inline mr-1.5" />Avargo Fri ({friOpenApps.length})
        </button>
      </div>

      {/* ============ SØKNADER TAB (all job applications) ============ */}
      {activeTab === "applications" && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter size={12} className="text-muted-foreground" />
              <select value={jobCatFilter} onChange={e => setJobCatFilter(e.target.value)}
                className="h-8 rounded-lg border border-border/30 bg-muted/30 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="alle">Alle avdelinger</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={jobStatusFilter} onChange={e => setJobStatusFilter(e.target.value)}
                className="h-8 rounded-lg border border-border/30 bg-muted/30 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="alle">Alle statuser</option>
                <option value="ny">Ny</option>
                <option value="innkalt_intervju">Innkalt til intervju</option>
                <option value="intervju">Under intervju</option>
                <option value="avslått">Avslått</option>
                <option value="under_vurdering">Under vurdering</option>
                <option value="tilbud">Tilbud</option>
                <option value="ansatt">Ansatt</option>
              </select>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              {filteredAllJobApps.length > 0 && (
                <button type="button" onClick={() => {
                  if (selectedJobApps.size === filteredAllJobApps.length) setSelectedJobApps(new Set());
                  else setSelectedJobApps(new Set(filteredAllJobApps.map(a => a.id)));
                }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground border border-border/20 hover:bg-muted/30 transition-colors">
                  {selectedJobApps.size === filteredAllJobApps.length && filteredAllJobApps.length > 0 ? <CheckSquare size={12} /> : <Square size={12} />}
                  {selectedJobApps.size > 0 ? `${selectedJobApps.size} valgt` : "Velg alle"}
                </button>
              )}
              {selectedJobApps.size > 0 && (
                <button type="button" onClick={bulkDeleteJobApps}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-destructive bg-destructive/10 hover:bg-destructive/20 transition-colors">
                  <Trash2 size={12} /> Slett {selectedJobApps.size}
                </button>
              )}
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground">{filteredAllJobApps.length} søknad(er)</p>

          {filteredAllJobApps.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Ingen søknader matcher filteret</p>
          ) : filteredAllJobApps.map(app => {
            const isExpanded = expandedApp === app.id;
            const isSelected = selectedJobApps.has(app.id);
            return (
              <div key={app.id} className={`glass rounded-2xl border overflow-hidden transition-colors ${isSelected ? "border-primary/40 bg-primary/5" : "border-border/20"}`}>
                <div className="flex items-center">
                  <button type="button" onClick={() => toggleSelectJob(app.id)}
                    className="px-3 py-3 text-muted-foreground hover:text-primary transition-colors shrink-0">
                    {isSelected ? <CheckSquare size={14} className="text-primary" /> : <Square size={14} />}
                  </button>
                  <button type="button" onClick={() => setExpandedApp(isExpanded ? null : app.id)}
                    className="flex-1 px-2 py-3 flex items-center justify-between gap-3 text-left hover:bg-muted/10 transition-colors">
                    <div className="min-w-0 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <User size={14} className="text-primary" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium">{app.full_name}</p>
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">{app.jobCategory}</span>
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{app.jobTitle}</span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full ${
                            app.status === "ny" ? "bg-primary/10 text-primary" :
                            app.status === "innkalt_intervju" ? "bg-emerald-100 text-emerald-700" :
                            app.status === "intervju" ? "bg-accent/50 text-accent-foreground" :
                            app.status === "avslått" ? "bg-destructive/10 text-destructive" :
                            app.status === "ansatt" ? "bg-primary/20 text-primary" :
                            "bg-muted text-muted-foreground"
                          }`}>{STATUS_LABELS[app.status] || app.status}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">{app.email} · {new Date(app.created_at).toLocaleDateString("nb-NO")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button type="button" onClick={e => { e.stopPropagation(); deleteJobApp(app.id); }}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1">
                        <Trash2 size={12} />
                      </button>
                      {isExpanded ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
                    </div>
                  </button>
                </div>

                {isExpanded && (
                  <div className="border-t border-border/10 px-5 py-4 space-y-4 bg-muted/5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2.5 p-3 rounded-xl bg-background/50 border border-border/10">
                        <Mail size={14} className="text-primary shrink-0" />
                        <div>
                          <p className="text-[9px] text-muted-foreground/60 uppercase tracking-wider">E-post</p>
                          <a href={`mailto:${app.email}`} className="text-xs text-foreground hover:text-primary transition-colors">{app.email}</a>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 p-3 rounded-xl bg-background/50 border border-border/10">
                        <Phone size={14} className="text-primary shrink-0" />
                        <div>
                          <p className="text-[9px] text-muted-foreground/60 uppercase tracking-wider">Telefon</p>
                          <a href={`tel:${app.phone}`} className="text-xs text-foreground hover:text-primary transition-colors">{app.phone}</a>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 p-3 rounded-xl bg-background/50 border border-border/10">
                        <Calendar size={14} className="text-primary shrink-0" />
                        <div>
                          <p className="text-[9px] text-muted-foreground/60 uppercase tracking-wider">Søkt</p>
                          <p className="text-xs">{new Date(app.created_at).toLocaleString("nb-NO", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 p-3 rounded-xl bg-background/50 border border-border/10">
                        <Briefcase size={14} className="text-primary shrink-0" />
                        <div>
                          <p className="text-[9px] text-muted-foreground/60 uppercase tracking-wider">Stilling / Avdeling</p>
                          <p className="text-xs">{app.jobTitle} ({app.jobCategory})</p>
                        </div>
                      </div>
                      {app.date_of_birth && (
                        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-background/50 border border-border/10">
                          <User size={14} className="text-primary shrink-0" />
                          <div>
                            <p className="text-[9px] text-muted-foreground/60 uppercase tracking-wider">Fødselsdato</p>
                            <p className="text-xs">{new Date(app.date_of_birth).toLocaleDateString("nb-NO")}</p>
                          </div>
                        </div>
                      )}
                      {(app.address || app.city) && (
                        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-background/50 border border-border/10">
                          <MapPin size={14} className="text-primary shrink-0" />
                          <div>
                            <p className="text-[9px] text-muted-foreground/60 uppercase tracking-wider">Adresse</p>
                            <p className="text-xs">{[app.address, app.postal_code, app.city].filter(Boolean).join(", ")}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {app.cv_file_name && (
                      <div className="p-3 rounded-xl bg-background/50 border border-border/10">
                        <p className="text-[9px] text-muted-foreground/60 uppercase tracking-wider mb-2">CV / Vedlegg</p>
                        <button onClick={() => openCv(app.cv_url)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors">
                          <Download size={13} /> {app.cv_file_name}
                        </button>
                      </div>
                    )}

                    {app.message && (
                      <div className="p-3 rounded-xl bg-background/50 border border-border/10">
                        <p className="text-[9px] text-muted-foreground/60 uppercase tracking-wider mb-2">
                          <MessageSquare size={10} className="inline mr-1" />Melding fra søker
                        </p>
                        <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap">{app.message}</p>
                      </div>
                    )}

                    <div className="p-3 rounded-xl bg-background/50 border border-border/10">
                      <p className="text-[9px] text-muted-foreground/60 uppercase tracking-wider mb-2">Internt notat</p>
                      <textarea
                        value={appNotes[app.id] ?? app.admin_note ?? ""}
                        onChange={e => setAppNotes(prev => ({ ...prev, [app.id]: e.target.value }))}
                        placeholder="Skriv et internt notat om søkeren…"
                        rows={2}
                        className="w-full rounded-lg border border-border/20 bg-muted/20 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 mb-2"
                      />
                      <button onClick={() => saveAppNote(app.id, "job_applications")}
                        className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[10px] font-medium hover:opacity-90">
                        Lagre notat
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground">Status:</span>
                        <select value={app.status} onChange={e => updateAppStatus(app.id, e.target.value)}
                          className="h-8 rounded-lg border border-border/30 bg-muted/30 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30">
                          <option value="ny">Ny</option>
                          <option value="under_vurdering">Under vurdering</option>
                          <option value="innkalt_intervju">Innkalt til intervju</option>
                          <option value="intervju">Under intervju</option>
                          <option value="tilbud">Tilbud sendt</option>
                          <option value="ansatt">Ansatt</option>
                          <option value="avslått">Avslått</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <a href={`mailto:${app.email}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[10px] font-medium hover:opacity-90 transition-opacity">
                          <Mail size={11} /> Send e-post
                        </a>
                        <a href={`tel:${app.phone}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-[10px] font-medium hover:opacity-90 transition-opacity">
                          <Phone size={11} /> Ring
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ============ ÅPNE SØKNADER TAB ============ */}
      {activeTab === "open" && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter size={12} className="text-muted-foreground" />
              <select value={openCatFilter} onChange={e => setOpenCatFilter(e.target.value)}
                className="h-8 rounded-lg border border-border/30 bg-muted/30 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="alle">Alle fagområder</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={openStatusFilter} onChange={e => setOpenStatusFilter(e.target.value)}
                className="h-8 rounded-lg border border-border/30 bg-muted/30 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="alle">Alle statuser</option>
                <option value="ny">Ny</option>
                <option value="innkalt_intervju">Innkalt til intervju</option>
                <option value="intervju">Under intervju</option>
                <option value="avslått">Avslått</option>
                <option value="kontaktet">Kontaktet</option>
                <option value="under_vurdering">Under vurdering</option>
                <option value="tilbud">Tilbud</option>
                <option value="ansatt">Ansatt</option>
              </select>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              {filteredOpenApps.length > 0 && (
                <button type="button" onClick={() => {
                  if (selectedOpenApps.size === filteredOpenApps.length) setSelectedOpenApps(new Set());
                  else setSelectedOpenApps(new Set(filteredOpenApps.map(a => a.id)));
                }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground border border-border/20 hover:bg-muted/30 transition-colors">
                  {selectedOpenApps.size === filteredOpenApps.length && filteredOpenApps.length > 0 ? <CheckSquare size={12} /> : <Square size={12} />}
                  {selectedOpenApps.size > 0 ? `${selectedOpenApps.size} valgt` : "Velg alle"}
                </button>
              )}
              {selectedOpenApps.size > 0 && (
                <button type="button" onClick={bulkDeleteOpenApps}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-destructive bg-destructive/10 hover:bg-destructive/20 transition-colors">
                  <Trash2 size={12} /> Slett {selectedOpenApps.size}
                </button>
              )}
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground">{filteredOpenApps.length} søknad(er)</p>

          {filteredOpenApps.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Ingen søknader matcher filteret</p>
          ) : filteredOpenApps.map(app => renderOpenAppCard(app))}
        </div>
      )}

      {/* ============ AVARGO FRI TAB ============ */}
      {activeTab === "fri" && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter size={12} className="text-muted-foreground" />
              <select value={openCatFilter} onChange={e => setOpenCatFilter(e.target.value)}
                className="h-8 rounded-lg border border-border/30 bg-muted/30 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="alle">Alle fagområder</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={openStatusFilter} onChange={e => setOpenStatusFilter(e.target.value)}
                className="h-8 rounded-lg border border-border/30 bg-muted/30 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="alle">Alle statuser</option>
                <option value="ny">Ny</option>
                <option value="innkalt_intervju">Innkalt til intervju</option>
                <option value="intervju">Under intervju</option>
                <option value="avslått">Avslått</option>
                <option value="kontaktet">Kontaktet</option>
                <option value="under_vurdering">Under vurdering</option>
                <option value="tilbud">Tilbud</option>
                <option value="ansatt">Ansatt</option>
              </select>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              {filteredFriApps.length > 0 && (
                <button type="button" onClick={() => {
                  if (selectedOpenApps.size === filteredFriApps.length) setSelectedOpenApps(new Set());
                  else setSelectedOpenApps(new Set(filteredFriApps.map(a => a.id)));
                }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground border border-border/20 hover:bg-muted/30 transition-colors">
                  {selectedOpenApps.size === filteredFriApps.length && filteredFriApps.length > 0 ? <CheckSquare size={12} /> : <Square size={12} />}
                  {selectedOpenApps.size > 0 ? `${selectedOpenApps.size} valgt` : "Velg alle"}
                </button>
              )}
              {selectedOpenApps.size > 0 && (
                <button type="button" onClick={bulkDeleteOpenApps}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-destructive bg-destructive/10 hover:bg-destructive/20 transition-colors">
                  <Trash2 size={12} /> Slett {selectedOpenApps.size}
                </button>
              )}
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground">{filteredFriApps.length} søknad(er)</p>

          {filteredFriApps.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Ingen Avargo Fri-søknader matcher filteret</p>
          ) : filteredFriApps.map(app => renderOpenAppCard(app))}
        </div>
      )}

      {activeTab === "listings" && (
      <>

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Søk i stillinger…"
            className="w-full h-9 pl-8 pr-3 rounded-xl border border-border/20 bg-muted/20 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{listings.length} stillinger</span>
          <button onClick={() => { setShowForm(true); setEditing(null); setForm(emptyForm); }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs hover:opacity-90">
            <Plus size={13} /> Ny stillingsannonse
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={save} className="glass rounded-2xl p-5 border border-border/20 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm">{editing ? "Rediger" : "Ny"} stillingsannonse</h3>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
          </div>

          {/* Quick template selector */}
          {!editing && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Velg mal for rask utfylling:</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button key={cat} type="button" onClick={() => applyTemplate(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all border ${
                      form.category === cat && form.title === TEMPLATES[cat]?.title
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/30 text-muted-foreground border-border/30 hover:bg-muted/50 hover:text-foreground"
                    }`}>
                    📝 {cat}-mal
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Basic fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Stillingstittel *</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value, slug: slugify(e.target.value + "-" + form.location) })} required className={inputCls} />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">URL-slug</label>
              <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Kategori</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={inputCls}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Sted / kontor</label>
              <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Type ansettelse</label>
              <input value={form.employment_type} onChange={e => setForm({ ...form, employment_type: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Arbeidssted</label>
              <select value={form.work_location} onChange={e => updateWorkLocation(e.target.value)} className={inputCls}>
                {WORK_LOCATIONS.map(wl => <option key={wl.value} value={wl.value}>{wl.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Oppstart</label>
              <input value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Søknadsfrist</label>
              <input value={form.deadline || ""} onChange={e => setForm({ ...form, deadline: e.target.value })} placeholder="Valgfritt" className={inputCls} />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Arbeidstid</label>
              <input value={form.work_hours} onChange={e => setForm({ ...form, work_hours: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Antall stillinger</label>
              <input type="number" value={form.num_positions} onChange={e => setForm({ ...form, num_positions: parseInt(e.target.value) || 1 })} className={inputCls} />
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="text-[10px] text-muted-foreground mb-2 block">Bilder til annonsen</label>
            <input ref={imgInputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => {
              const files = e.target.files;
              if (files) Array.from(files).forEach(f => uploadImage(f));
              e.target.value = "";
            }} />
            <div className="flex flex-wrap gap-3">
              {form.images.map((url, i) => (
                <div key={i} className="relative group w-24 h-24 rounded-xl overflow-hidden border border-border/20">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(i)}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Trash2 size={16} className="text-white" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => imgInputRef.current?.click()} disabled={uploading}
                className="w-24 h-24 rounded-xl border-2 border-dashed border-border/30 hover:border-primary/40 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-all">
                {uploading ? <Loader2 size={18} className="animate-spin" /> : <><ImagePlus size={18} /><span className="text-[9px]">Legg til</span></>}
              </button>
            </div>
          </div>

          {/* Highlights / Keywords */}
          <div>
            <label className="text-[10px] text-muted-foreground mb-1 block">Høydepunkter / nøkkelord (vises som interaktivt spill)</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.highlights.map((h, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs border border-primary/20">
                  {h}
                  <button type="button" onClick={() => setForm(prev => ({ ...prev, highlights: prev.highlights.filter((_, idx) => idx !== i) }))}
                    className="hover:text-destructive transition-colors"><X size={12} /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="F.eks. Teknologidrevet, Fleksibel arbeidstid…"
                className="flex-1 h-9 rounded-xl border border-border/30 bg-muted/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const val = (e.target as HTMLInputElement).value.trim();
                    if (val && !form.highlights.includes(val)) {
                      setForm(prev => ({ ...prev, highlights: [...prev.highlights, val] }));
                      (e.target as HTMLInputElement).value = "";
                    }
                  }
                }}
              />
              <button type="button" className="h-9 px-3 rounded-xl bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                onClick={() => {
                  const input = document.querySelector<HTMLInputElement>('input[placeholder*="Teknologidrevet"]');
                  if (input) {
                    const val = input.value.trim();
                    if (val && !form.highlights.includes(val)) {
                      setForm(prev => ({ ...prev, highlights: [...prev.highlights, val] }));
                      input.value = "";
                    }
                  }
                }}>Legg til</button>
            </div>
            <p className="text-[9px] text-muted-foreground/60 mt-1">Trykk Enter eller «Legg til» for hvert nøkkelord</p>
          </div>

          {/* Rich text sections */}
          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Intro / kort beskrivelse</label>
              <textarea value={form.intro || ""} onChange={e => setForm({ ...form, intro: e.target.value })} rows={2}
                className="w-full rounded-xl border border-border/30 bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Hva vi ser etter</label>
              <RichTextEditor content={form.description || ""} onChange={v => setForm({ ...form, description: v })} />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Arbeidsoppgaver</label>
              <RichTextEditor content={form.tasks || ""} onChange={v => setForm({ ...form, tasks: v })} />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Kvalifikasjoner</label>
              <RichTextEditor content={form.qualifications || ""} onChange={v => setForm({ ...form, qualifications: v })} />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Vi tilbyr</label>
              <RichTextEditor content={form.we_offer || ""} onChange={v => setForm({ ...form, we_offer: v })} />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Om bedriften</label>
              <RichTextEditor content={form.about_company || ""} onChange={v => setForm({ ...form, about_company: v })} />
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[10px] text-muted-foreground mb-2">Kontaktperson</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input value={form.contact_name || ""} onChange={e => setForm({ ...form, contact_name: e.target.value })} placeholder="Navn" className={inputCls} />
              <input value={form.contact_title || ""} onChange={e => setForm({ ...form, contact_title: e.target.value })} placeholder="Tittel" className={inputCls} />
              <input value={form.contact_email || ""} onChange={e => setForm({ ...form, contact_email: e.target.value })} placeholder="E-post" className={inputCls} />
              <input value={form.contact_phone || ""} onChange={e => setForm({ ...form, contact_phone: e.target.value })} placeholder="Telefon" className={inputCls} />
            </div>
          </div>

          {/* Publish + save */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} className="rounded" />
              Publiser umiddelbart
            </label>
            <div className="flex gap-2">
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="px-4 py-2 rounded-xl text-xs border border-border/30 hover:bg-muted/50">Avbryt</button>
              <button type="submit" disabled={saving} className="px-5 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-medium hover:opacity-90 disabled:opacity-50">
                {saving ? "Lagrer…" : editing ? "Oppdater" : "Opprett stilling"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Listings */}
      <div className="space-y-2">
        {filtered.map(job => {
          const appCount = applications.filter(a => a.job_listing_id === job.id).length;
          return (
            <div key={job.id} className="glass rounded-2xl border border-border/20 overflow-hidden">
              <div className="px-5 py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <Briefcase size={16} className="text-primary shrink-0" strokeWidth={1.5} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{job.title}</p>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${job.published ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"}`}>
                        {job.published ? "Publisert" : "Utkast"}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">{job.category} · {job.location} · {job.work_location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {appCount > 0 && (
                    <button onClick={() => setViewApps(viewApps === job.id ? null : job.id)}
                      className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                      <Users size={11} /> {appCount} {viewApps === job.id ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                    </button>
                  )}
                  <button onClick={() => togglePublish(job)} className="text-muted-foreground hover:text-primary transition-colors" title={job.published ? "Avpubliser" : "Publiser"}>
                    {job.published ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                  <button onClick={() => {
                    setEditing(job);
                    setForm({
                      title: job.title, slug: job.slug, category: job.category, location: job.location,
                      employment_type: job.employment_type, work_hours: job.work_hours, work_language: job.work_language,
                      work_location: job.work_location, num_positions: job.num_positions, start_date: job.start_date,
                      deadline: job.deadline || "", intro: job.intro || "", description: job.description || "",
                      qualifications: job.qualifications || "", tasks: job.tasks || "", we_offer: job.we_offer || "",
                      about_company: job.about_company || "", contact_name: job.contact_name || "",
                      contact_title: job.contact_title || "", contact_email: job.contact_email || "",
                      contact_phone: job.contact_phone || "", published: job.published, active: job.active,
                      images: job.images || [], highlights: job.highlights || [],
                    });
                    setShowForm(true);
                  }} className="text-muted-foreground hover:text-foreground transition-colors"><Edit2 size={13} /></button>
                  <button onClick={() => del(job.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={13} /></button>
                </div>
              </div>

              {viewApps === job.id && (() => {
                const jobApps = filteredJobApps(job.id);
                return (
                <div className="border-t border-border/10 px-5 py-4 space-y-3 bg-muted/5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground/60">Søknader til «{job.title}» ({jobApps.length})</p>
                    <div className="flex items-center gap-2">
                      <select value={jobStatusFilter} onChange={e => setJobStatusFilter(e.target.value)}
                        className="h-7 rounded-lg border border-border/30 bg-muted/30 px-2 text-[10px] focus:outline-none focus:ring-2 focus:ring-primary/30">
                        <option value="alle">Alle statuser</option>
                        <option value="ny">Ny</option>
                        <option value="innkalt_intervju">Innkalt til intervju</option>
                        <option value="intervju">Under intervju</option>
                        <option value="avslått">Avslått</option>
                        <option value="under_vurdering">Under vurdering</option>
                        <option value="tilbud">Tilbud</option>
                        <option value="ansatt">Ansatt</option>
                      </select>
                      {jobApps.length > 0 && (
                        <button type="button" onClick={() => {
                          if (selectedJobApps.size === jobApps.length) setSelectedJobApps(new Set());
                          else setSelectedJobApps(new Set(jobApps.map(a => a.id)));
                        }} className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] text-muted-foreground hover:text-foreground border border-border/20 hover:bg-muted/30 transition-colors">
                          {selectedJobApps.size === jobApps.length && jobApps.length > 0 ? <CheckSquare size={10} /> : <Square size={10} />}
                          {selectedJobApps.size > 0 ? `${selectedJobApps.size} valgt` : "Velg"}
                        </button>
                      )}
                      {selectedJobApps.size > 0 && (
                        <button type="button" onClick={bulkDeleteJobApps}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] text-destructive bg-destructive/10 hover:bg-destructive/20 transition-colors">
                          <Trash2 size={10} /> Slett {selectedJobApps.size}
                        </button>
                      )}
                    </div>
                  </div>
                  {jobApps.map(app => {
                    const isExp = expandedApp === app.id;
                    const isSelected = selectedJobApps.has(app.id);
                    return (
                      <div key={app.id} className={`rounded-xl border overflow-hidden transition-colors ${isSelected ? "border-primary/40 bg-primary/5" : "border-border/15 bg-background/30"}`}>
                        <div className="flex items-center">
                          <button type="button" onClick={() => toggleSelectJob(app.id)}
                            className="px-2.5 py-2.5 text-muted-foreground hover:text-primary transition-colors shrink-0">
                            {isSelected ? <CheckSquare size={12} className="text-primary" /> : <Square size={12} />}
                          </button>
                          <button type="button" onClick={() => setExpandedApp(isExp ? null : app.id)}
                            className="flex-1 px-2 py-2.5 flex items-center justify-between gap-3 text-left hover:bg-muted/10 transition-colors">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <User size={12} className="text-primary" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-xs font-medium">{app.full_name}</p>
                                  <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${
                                    app.status === "ny" ? "bg-primary/10 text-primary" :
                                    app.status === "innkalt_intervju" ? "bg-emerald-100 text-emerald-700" :
                                    app.status === "intervju" ? "bg-accent/50 text-accent-foreground" :
                                    app.status === "avslått" ? "bg-destructive/10 text-destructive" :
                                    app.status === "ansatt" ? "bg-primary/20 text-primary" :
                                    "bg-muted text-muted-foreground"
                                  }`}>{STATUS_LABELS[app.status] || app.status}</span>
                                </div>
                                <p className="text-[10px] text-muted-foreground">{app.email} · {new Date(app.created_at).toLocaleDateString("nb-NO")}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button type="button" onClick={e => { e.stopPropagation(); deleteJobApp(app.id); }}
                                className="text-muted-foreground hover:text-destructive transition-colors p-1">
                                <Trash2 size={11} />
                              </button>
                              {isExp ? <ChevronUp size={12} className="text-muted-foreground" /> : <ChevronDown size={12} className="text-muted-foreground" />}
                            </div>
                          </button>
                        </div>

                        {isExp && (
                          <div className="border-t border-border/10 px-4 py-3 space-y-3">
                            {/* Contact */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-background/50 border border-border/10">
                                <Mail size={12} className="text-primary shrink-0" />
                                <div>
                                  <p className="text-[8px] text-muted-foreground/60 uppercase tracking-wider">E-post</p>
                                  <a href={`mailto:${app.email}`} className="text-[11px] hover:text-primary transition-colors">{app.email}</a>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-background/50 border border-border/10">
                                <Phone size={12} className="text-primary shrink-0" />
                                <div>
                                  <p className="text-[8px] text-muted-foreground/60 uppercase tracking-wider">Telefon</p>
                                  <a href={`tel:${app.phone}`} className="text-[11px] hover:text-primary transition-colors">{app.phone}</a>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-background/50 border border-border/10">
                                <Calendar size={12} className="text-primary shrink-0" />
                                <div>
                                  <p className="text-[8px] text-muted-foreground/60 uppercase tracking-wider">Søkt</p>
                                  <p className="text-[11px]">{new Date(app.created_at).toLocaleString("nb-NO", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-background/50 border border-border/10">
                                <Briefcase size={12} className="text-primary shrink-0" />
                                <div>
                                  <p className="text-[8px] text-muted-foreground/60 uppercase tracking-wider">Stilling</p>
                                  <p className="text-[11px]">{job.title}</p>
                                </div>
                              </div>
                            </div>

                            {/* CV */}
                            {app.cv_file_name && (
                              <div className="p-2.5 rounded-lg bg-background/50 border border-border/10">
                                <p className="text-[8px] text-muted-foreground/60 uppercase tracking-wider mb-1.5">CV / Vedlegg</p>
                                <button onClick={() => openCv(app.cv_url)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[11px] font-medium hover:bg-primary/20 transition-colors">
                                  <Download size={11} /> {app.cv_file_name}
                                </button>
                              </div>
                            )}

                            {/* Message */}
                            {app.message && (
                              <div className="p-2.5 rounded-lg bg-background/50 border border-border/10">
                                <p className="text-[8px] text-muted-foreground/60 uppercase tracking-wider mb-1.5">
                                  <MessageSquare size={9} className="inline mr-1" />Melding fra søker
                                </p>
                                <p className="text-[11px] text-foreground/80 leading-relaxed whitespace-pre-wrap">{app.message}</p>
                              </div>
                            )}

                            {/* Admin note */}
                            <div className="p-2.5 rounded-lg bg-background/50 border border-border/10">
                              <p className="text-[8px] text-muted-foreground/60 uppercase tracking-wider mb-1.5">Internt notat</p>
                              <textarea
                                value={appNotes[app.id] ?? app.admin_note ?? ""}
                                onChange={e => setAppNotes(prev => ({ ...prev, [app.id]: e.target.value }))}
                                placeholder="Skriv et internt notat…"
                                rows={2}
                                className="w-full rounded-lg border border-border/20 bg-muted/20 px-3 py-1.5 text-[11px] focus:outline-none focus:ring-2 focus:ring-primary/30 mb-1.5"
                              />
                              <button onClick={() => saveAppNote(app.id, "job_applications")}
                                className="px-3 py-1 rounded-lg bg-primary text-primary-foreground text-[10px] font-medium hover:opacity-90">
                                Lagre notat
                              </button>
                            </div>

                            {/* Status + actions */}
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-muted-foreground">Status:</span>
                                <select value={app.status} onChange={e => updateAppStatus(app.id, e.target.value)}
                                  className="h-7 rounded-lg border border-border/30 bg-muted/30 px-2 text-[10px] focus:outline-none focus:ring-2 focus:ring-primary/30">
                                  <option value="ny">Ny</option>
                                  <option value="under_vurdering">Under vurdering</option>
                                  <option value="innkalt_intervju">Innkalt til intervju</option>
                                  <option value="intervju">Under intervju</option>
                                  <option value="tilbud">Tilbud sendt</option>
                                  <option value="ansatt">Ansatt</option>
                                  <option value="avslått">Avslått</option>
                                </select>
                              </div>
                              <div className="flex gap-2">
                                <a href={`mailto:${app.email}`}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[10px] font-medium hover:opacity-90">
                                  <Mail size={10} /> Send e-post
                                </a>
                                <a href={`tel:${app.phone}`}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-[10px] font-medium hover:opacity-90">
                                  <Phone size={10} /> Ring
                                </a>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {jobApps.length === 0 && (
                    <p className="text-[11px] text-muted-foreground text-center py-4">Ingen søknader matcher filteret</p>
                  )}
                </div>
                );
              })()}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">Ingen stillingsannonser funnet</p>
        )}
      </div>
      </>
      )}

      {/* Interview invitation confirmation dialog */}
      <AlertDialog open={!!interviewConfirm} onOpenChange={(open) => {
        if (!open) {
          setInterviewConfirm(null);
          setInterviewType("standard");
          setInterviewDate("");
          setInterviewTime("");
          setInterviewTeamsLink("");
          setInterviewLocation("");
        }
      }}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Send intervjuinnkalling</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>
                  Innkalling til <strong>{interviewConfirm?.name}</strong> ({interviewConfirm?.email}).
                  {interviewConfirm?.positionTitle && <> Stilling: <strong>{interviewConfirm.positionTitle}</strong>.</>}
                </p>

                <div>
                  <label className="text-xs font-medium text-foreground block mb-1.5">Type intervju</label>
                  <select value={interviewType} onChange={e => setInterviewType(e.target.value as "standard" | "digital" | "fysisk")}
                    className="w-full rounded-lg border border-border/30 bg-muted/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="standard">Standardmail (kandidaten foreslår tid)</option>
                    <option value="digital">Digitalt intervju (Teams/Video)</option>
                    <option value="fysisk">Fysisk intervju</option>
                  </select>
                </div>

                {interviewType !== "standard" && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-foreground block mb-1.5">Dato</label>
                        <input type="date" value={interviewDate} onChange={e => setInterviewDate(e.target.value)}
                          className="w-full rounded-lg border border-border/30 bg-muted/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-foreground block mb-1.5">Klokkeslett</label>
                        <input type="time" value={interviewTime} onChange={e => setInterviewTime(e.target.value)}
                          className="w-full rounded-lg border border-border/30 bg-muted/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                      </div>
                    </div>
                  </>
                )}

                {interviewType === "digital" && (
                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1.5">Teams-lenke (valgfritt)</label>
                    <input type="url" value={interviewTeamsLink} onChange={e => setInterviewTeamsLink(e.target.value)}
                      placeholder="https://teams.microsoft.com/l/meetup-join/..."
                      className="w-full rounded-lg border border-border/30 bg-muted/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                )}

                {interviewType === "fysisk" && (
                  <div>
                    <label className="text-xs font-medium text-foreground block mb-1.5">Sted / adresse</label>
                    <input type="text" value={interviewLocation} onChange={e => setInterviewLocation(e.target.value)}
                      placeholder="F.eks: Oscars gate 2B, 3714 Skien"
                      className="w-full rounded-lg border border-border/30 bg-muted/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                )}

                <p className="text-[10px] text-muted-foreground">
                  {interviewType === "standard"
                    ? "E-posten ber kandidaten foreslå tidspunkter. Ditt navn, e-post og telefon legges ved."
                    : "E-posten vil inneholde intervjudetaljer og dine kontaktopplysninger."}
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel disabled={interviewSending}>Avbryt</AlertDialogCancel>
            <AlertDialogAction disabled={interviewSending} onClick={async (e) => { e.preventDefault(); await confirmInterviewInvitation(); }}>
              {interviewSending ? <><Loader2 size={14} className="animate-spin mr-1" /> Sender…</> : "Send innkalling"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rejection confirmation dialog */}
      <AlertDialog open={!!rejectionConfirm} onOpenChange={(open) => { if (!open) setRejectionConfirm(null); }}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Send avslag til {rejectionConfirm?.name}?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>
                  Du er i ferd med å sende et avslag til <strong>{rejectionConfirm?.name}</strong> ({rejectionConfirm?.email}).
                  {rejectionConfirm?.positionTitle && <> Stilling: <strong>{rejectionConfirm.positionTitle}</strong>.</>}
                </p>
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1.5">
                    Tilbakemelding til søkeren (valgfritt)
                  </label>
                  <textarea
                    value={rejectionFeedback}
                    onChange={e => setRejectionFeedback(e.target.value)}
                    placeholder="F.eks: Vi savnet noe mer erfaring innen... / Vi anbefaler deg å... / Konkurransen var sterk og vi valgte en kandidat med..."
                    rows={4}
                    className="w-full rounded-lg border border-border/30 bg-muted/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Denne teksten inkluderes i e-posten som konstruktiv tilbakemelding. La feltet stå tomt for standardmelding.
                  </p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel disabled={rejectionSending}>Avbryt</AlertDialogCancel>
            <AlertDialogAction
              disabled={rejectionSending}
              onClick={async (e) => {
                e.preventDefault();
                if (!rejectionConfirm) return;
                setRejectionSending(true);
                const { appId, name, email, table, positionTitle } = rejectionConfirm;
                await supabase.from(table).update({ status: "avslått" }).eq("id", appId);
                await sendRejectionEmail(name, email, positionTitle, rejectionFeedback.trim() || undefined);
                setRejectionConfirm(null);
                setRejectionFeedback("");
                setRejectionSending(false);
                fetchAll();
              }}
            >
              {rejectionSending ? <><Loader2 size={14} className="animate-spin mr-1" /> Sender…</> : "Send avslag"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Job offer confirmation dialog */}
      <AlertDialog open={!!offerConfirm} onOpenChange={(open) => { if (!open) setOfferConfirm(null); }}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Send jobbtilbud til {offerConfirm?.name}?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>
                  Du er i ferd med å sende et jobbtilbud til <strong>{offerConfirm?.name}</strong> ({offerConfirm?.email}).
                  {offerConfirm?.positionTitle && <> Stilling: <strong>{offerConfirm.positionTitle}</strong>.</>}
                </p>
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1.5">Ønsket tiltredelsesdato *</label>
                  <input
                    type="text"
                    value={offerStartDate}
                    onChange={e => setOfferStartDate(e.target.value)}
                    placeholder="F.eks: 1. mars 2026 / Etter avtale"
                    className="w-full rounded-lg border border-border/30 bg-muted/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1.5">Lønn *</label>
                  <input
                    type="text"
                    value={offerSalary}
                    onChange={e => setOfferSalary(e.target.value)}
                    placeholder="F.eks: 550 000 kr / år"
                    className="w-full rounded-lg border border-border/30 bg-muted/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1.5">Arbeidssted *</label>
                  <input
                    type="text"
                    value={offerWorkLocation}
                    onChange={e => setOfferWorkLocation(e.target.value)}
                    placeholder="F.eks: Oscars gate 2B, Skien (hybrid)"
                    className="w-full rounded-lg border border-border/30 bg-muted/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground">
                  E-posten vil inneholde en varm velkomst, tilbudsdetaljer, og be kandidaten sende personnummer, kontonummer og annen nødvendig informasjon til din e-post.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel disabled={offerSending}>Avbryt</AlertDialogCancel>
            <AlertDialogAction
              disabled={offerSending || !offerStartDate.trim() || !offerSalary.trim() || !offerWorkLocation.trim()}
              onClick={async (e) => {
                e.preventDefault();
                if (!offerConfirm) return;
                setOfferSending(true);
                const { appId, name, email, table, positionTitle } = offerConfirm;
                await supabase.from(table).update({ status: "tilbud" }).eq("id", appId);
                try {
                  const { error } = await supabase.functions.invoke("job-offer-email", {
                    body: {
                      applicant_name: name,
                      applicant_email: email,
                      position_title: positionTitle || null,
                      start_date: offerStartDate.trim(),
                      salary: offerSalary.trim(),
                      work_location: offerWorkLocation.trim(),
                      sender_name: profile?.name || "Rekruttering",
                      sender_title: profile?.title || null,
                      sender_email: profile?.email || "kontakt@avargo.no",
                      sender_phone: profile?.phone || null,
                    },
                  });
                  if (error) throw error;
                  toast.success("Jobbtilbud sendt til " + name);
                } catch (err) {
                  console.error("Job offer email failed:", err);
                  toast.error("Kunne ikke sende jobbtilbud-e-post");
                }
                setOfferConfirm(null);
                setOfferSending(false);
                fetchAll();
              }}
            >
              {offerSending ? <><Loader2 size={14} className="animate-spin mr-1" /> Sender…</> : "Send tilbud"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default JobListingsPanel;
