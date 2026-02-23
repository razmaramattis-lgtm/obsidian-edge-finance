import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Trash2, FileText, Image as ImageIcon, FolderOpen, Plus, Download } from "lucide-react";
import UserAvatar from "./UserAvatar";
import { uploadFile } from "./helpers";
import { formatDate } from "./helpers";

interface GroupFile {
  id: string;
  group_id: string;
  uploaded_by: string;
  file_url: string;
  file_name: string;
  file_type: string;
  folder: string;
  file_size: string | null;
  created_at: string;
  profiles?: { name: string; avatar_url?: string | null };
}

interface Props {
  groupId: string;
  profileId: string;
  isAdmin: boolean;
  tab: "filer" | "bilder" | "ressurser";
}

const isImage = (name: string) => /\.(jpg|jpeg|png|webp|gif|svg|bmp)$/i.test(name);

const GroupFilesPanel = ({ groupId, profileId, isAdmin, tab }: Props) => {
  const [files, setFiles] = useState<GroupFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [newFolder, setNewFolder] = useState("");
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fileType = tab === "bilder" ? "image" : tab === "ressurser" ? "resource" : "file";

  const fetchFiles = async () => {
    const { data } = await supabase
      .from("group_files" as any)
      .select("*, profiles(name, avatar_url)")
      .eq("group_id", groupId)
      .eq("file_type", fileType)
      .order("created_at", { ascending: false });
    setFiles((data as any as GroupFile[]) || []);
  };

  useEffect(() => { fetchFiles(); }, [groupId, tab]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const result = await uploadFile(supabase, "workspace-uploads", `groups/${groupId}/${fileType}`, file);
    if (result) {
      await supabase.from("group_files" as any).insert([{
        group_id: groupId,
        uploaded_by: profileId,
        file_url: result.url,
        file_name: result.name,
        file_type: fileType,
        folder: activeFolder || "Generelt",
        file_size: `${(file.size / 1024).toFixed(0)} KB`,
      }]);
      fetchFiles();
    }
    setUploading(false);
    e.target.value = "";
  };

  const deleteFile = async (id: string) => {
    await supabase.from("group_files" as any).delete().eq("id", id);
    fetchFiles();
  };

  const folders = [...new Set(files.map(f => f.folder))];
  const visibleFiles = activeFolder ? files.filter(f => f.folder === activeFolder) : files;

  const addFolder = () => {
    if (!newFolder.trim()) return;
    setActiveFolder(newFolder.trim());
    setNewFolder("");
    setShowNewFolder(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>
          {tab === "bilder" ? "Bilder" : tab === "ressurser" ? "Ressurser" : "Filer"}
        </h3>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowNewFolder(!showNewFolder)} className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all" title="Ny mappe">
            <FolderOpen size={16} />
          </button>
          <button onClick={() => inputRef.current?.click()} disabled={uploading} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 disabled:opacity-50">
            <Upload size={12} /> {uploading ? "Laster opp…" : "Last opp"}
          </button>
          <input ref={inputRef} type="file" accept={tab === "bilder" ? "image/*" : undefined} className="hidden" onChange={handleUpload} />
        </div>
      </div>

      {showNewFolder && (
        <div className="flex items-center gap-2 mb-4">
          <input value={newFolder} onChange={e => setNewFolder(e.target.value)} placeholder="Mappenavn…" className="h-9 flex-1 rounded-xl border border-border/20 bg-muted/20 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary/20" onKeyDown={e => e.key === "Enter" && addFolder()} />
          <button onClick={addFolder} className="px-3 py-2 rounded-xl bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-all">Opprett</button>
        </div>
      )}

      {/* Folder tabs */}
      {folders.length > 0 && (
        <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
          <button onClick={() => setActiveFolder(null)} className={`px-3 py-1.5 rounded-xl text-[10px] font-medium whitespace-nowrap transition-all ${!activeFolder ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted/40"}`}>
            Alle
          </button>
          {folders.map(f => (
            <button key={f} onClick={() => setActiveFolder(f)} className={`px-3 py-1.5 rounded-xl text-[10px] font-medium whitespace-nowrap transition-all ${activeFolder === f ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted/40"}`}>
              <FolderOpen size={10} className="inline mr-1" />{f}
            </button>
          ))}
        </div>
      )}

      {tab === "bilder" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {visibleFiles.map(f => (
            <div key={f.id} className="group/file relative rounded-xl overflow-hidden border border-border/15 bg-muted/10 hover:border-primary/20 transition-all">
              <a href={f.file_url} target="_blank" rel="noopener noreferrer">
                <img src={f.file_url} alt={f.file_name} className="w-full aspect-square object-cover" loading="lazy" />
              </a>
              <div className="p-2">
                <p className="text-[10px] text-muted-foreground truncate">{f.file_name}</p>
                <p className="text-[9px] text-muted-foreground/60">{formatDate(f.created_at)}</p>
              </div>
              {(f.uploaded_by === profileId || isAdmin) && (
                <button onClick={() => deleteFile(f.id)} className="absolute top-1.5 right-1.5 opacity-0 group-hover/file:opacity-100 p-1.5 rounded-lg bg-black/40 backdrop-blur-sm text-white hover:bg-destructive/80 transition-all">
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {visibleFiles.map(f => (
            <div key={f.id} className="group/file flex items-center gap-3 p-3 rounded-xl border border-border/15 bg-card/40 hover:border-primary/15 transition-all">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                {isImage(f.file_name) ? <ImageIcon size={16} className="text-primary" /> : <FileText size={16} className="text-primary" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{f.file_name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {f.file_size} · {formatDate(f.created_at)} · {(f.profiles as any)?.name}
                </p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover/file:opacity-100 transition-all">
                <a href={f.file_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"><Download size={14} /></a>
                {(f.uploaded_by === profileId || isAdmin) && (
                  <button onClick={() => deleteFile(f.id)} className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"><Trash2 size={14} /></button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {visibleFiles.length === 0 && (
        <div className="text-center py-12">
          <div className="w-14 h-14 rounded-2xl bg-muted/30 flex items-center justify-center mx-auto mb-3">
            {tab === "bilder" ? <ImageIcon size={24} className="text-muted-foreground/40" /> : <FileText size={24} className="text-muted-foreground/40" />}
          </div>
          <p className="text-muted-foreground text-xs">
            {tab === "bilder" ? "Ingen bilder ennå" : tab === "ressurser" ? "Ingen ressurser ennå" : "Ingen filer ennå"}
          </p>
          <p className="text-muted-foreground/60 text-[10px] mt-1">Last opp for å dele med gruppen</p>
        </div>
      )}
    </div>
  );
};

export default GroupFilesPanel;
