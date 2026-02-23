export const formatTime = (ts: string) =>
  new Date(ts).toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" });

export const formatDate = (ts: string) =>
  new Date(ts).toLocaleDateString("nb-NO", { day: "numeric", month: "short" });

export const timeAgo = (ts: string) => {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "nå";
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}t`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return formatDate(ts);
};

export const groupColors = [
  "from-violet-600 to-purple-500",
  "from-blue-600 to-cyan-500",
  "from-emerald-600 to-teal-500",
  "from-rose-600 to-pink-500",
  "from-amber-600 to-orange-500",
  "from-indigo-600 to-blue-500",
  "from-fuchsia-600 to-pink-500",
];

export const getGroupGradient = (_color: string, name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return groupColors[Math.abs(hash) % groupColors.length];
};

export const roleLabel = (r: string) =>
  r === "admin" ? "Administrator" : r === "employee" ? "Ansatt" : "Kunde";

export const isGifContent = (content: string) => /^!\[gif\]\((.+)\)$/.test(content);
export const extractGifUrl = (content: string) => content.match(/^!\[gif\]\((.+)\)$/)?.[1] || "";
export const isGifUrl = (content: string) => /^https?:\/\/.*\.(gif|giphy)/i.test(content);

export const uploadFile = async (
  supabase: any,
  bucket: string,
  folder: string,
  file: File
): Promise<{ url: string; name: string } | null> => {
  const ext = file.name.split(".").pop();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file);
  if (error) return null;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { url: data.publicUrl, name: file.name };
};
