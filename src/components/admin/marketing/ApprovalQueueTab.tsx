import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckSquare, Check, X, Linkedin, Facebook, Instagram, Megaphone } from "lucide-react";
import { toast } from "sonner";

interface Post {
  id: string;
  title: string;
  platform: string;
  content: string;
  hashtags: string[] | null;
  status: string;
  created_at: string;
}

const PLATFORM_LABELS: Record<string, string> = {
  linkedin: "LinkedIn", facebook: "Facebook", instagram: "Instagram",
  google_ads: "Google Ads", meta_ads: "Meta Ads",
};

const ApprovalQueueTab = () => {
  const { profile } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const fetchPosts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("marketing_posts")
      .select("*")
      .eq("status", "pending_approval")
      .order("created_at", { ascending: true });
    setPosts((data as Post[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleApprove = async (id: string) => {
    await supabase.from("marketing_posts").update({
      status: "approved",
      approved_by: profile?.id,
    }).eq("id", id);
    toast.success("Godkjent!");
    fetchPosts();
  };

  const handleReject = async (id: string) => {
    await supabase.from("marketing_posts").update({
      status: "rejected",
      rejected_reason: rejectReason || null,
    }).eq("id", id);
    toast.success("Avslått");
    setRejectingId(null);
    setRejectReason("");
    fetchPosts();
  };

  return (
    <div className="space-y-6">
      <p className="text-xs text-muted-foreground">
        Innlegg som venter på godkjenning før de kan publiseres.
      </p>

      {loading ? (
        <p className="text-sm text-muted-foreground">Laster...</p>
      ) : posts.length === 0 ? (
        <Card className="p-8 text-center">
          <CheckSquare size={32} className="mx-auto mb-3 text-muted-foreground/30" />
          <p className="text-muted-foreground">Ingen innlegg venter på godkjenning.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <Card key={p.id} className="p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{p.title}</span>
                    <Badge variant="outline" className="text-[10px]">{PLATFORM_LABELS[p.platform] || p.platform}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{p.content}</p>
                  {p.hashtags && p.hashtags.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {p.hashtags.map((h) => <Badge key={h} variant="secondary" className="text-[10px]">#{h}</Badge>)}
                    </div>
                  )}
                </div>
              </div>

              {rejectingId === p.id ? (
                <div className="space-y-2">
                  <Textarea
                    placeholder="Begrunnelse for avslag (valgfritt)"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" variant="destructive" onClick={() => handleReject(p.id)}>Bekreft avslag</Button>
                    <Button size="sm" variant="ghost" onClick={() => { setRejectingId(null); setRejectReason(""); }}>Avbryt</Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleApprove(p.id)} className="gap-1">
                    <Check size={14} /> Godkjenn
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setRejectingId(p.id)} className="gap-1">
                    <X size={14} /> Avslå
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApprovalQueueTab;
