import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FileText, Upload, X, Loader2 } from "lucide-react";

interface CvUploadProps {
  onUploaded: (url: string, fileName: string) => void;
  cvUrl?: string | null;
  cvFileName?: string | null;
  onRemove?: () => void;
}

const CvUpload = ({ onUploaded, cvUrl, cvFileName, onRemove }: CvUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Filen kan ikke være større enn 10 MB.");
      return;
    }
    const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(file.type)) {
      toast.error("Kun PDF og Word-filer er tillatt.");
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("cv-uploads").upload(path, file);
    if (error) {
      toast.error("Kunne ikke laste opp filen.");
      setUploading(false);
      return;
    }
    const { data: signedData, error: signError } = await supabase.storage.from("cv-uploads").createSignedUrl(path, 60 * 60 * 24 * 365); // 1 year
    if (signError || !signedData?.signedUrl) {
      toast.error("Kunne ikke generere nedlastingslenke.");
      setUploading(false);
      return;
    }
    onUploaded(signedData.signedUrl, file.name);
    setUploading(false);
  };

  return (
    <div>
      <input ref={inputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => {
        const f = e.target.files?.[0];
        if (f) handleFile(f);
        e.target.value = "";
      }} />
      {cvFileName ? (
        <div className="flex items-center gap-2 p-3 rounded-xl border border-primary/20 bg-primary/5">
          <FileText size={16} className="text-primary shrink-0" />
          <span className="text-sm text-foreground truncate flex-1">{cvFileName}</span>
          {onRemove && (
            <button type="button" onClick={onRemove} className="text-muted-foreground hover:text-destructive transition-colors">
              <X size={14} />
            </button>
          )}
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}
          className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-border/30 hover:border-primary/40 bg-muted/10 hover:bg-primary/5 transition-all text-sm text-muted-foreground hover:text-primary disabled:opacity-50">
          {uploading ? <><Loader2 size={16} className="animate-spin" /> Laster opp…</> : <><Upload size={16} /> Last opp CV (PDF / Word)</>}
        </button>
      )}
    </div>
  );
};

export default CvUpload;
