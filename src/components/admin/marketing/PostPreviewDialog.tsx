import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Linkedin, Facebook, Instagram, Megaphone, Heart, MessageCircle, Share2, ThumbsUp, Send, Bookmark, MoreHorizontal } from "lucide-react";

interface Post {
  id: string;
  title: string;
  platform: string;
  content: string;
  hashtags: string[] | null;
  image_url: string | null;
}

interface PostPreviewDialogProps {
  post: Post | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LinkedInPreview = ({ post }: { post: Post }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 max-w-[500px] mx-auto text-left">
    {/* Header */}
    <div className="flex items-center gap-3 p-4 pb-2">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center text-white font-bold text-lg">A</div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-900">Avargo</p>
        <p className="text-xs text-gray-500">Regnskap · Rådgivning · Teknologi</p>
        <p className="text-xs text-gray-400">Nå · 🌐</p>
      </div>
      <MoreHorizontal size={20} className="text-gray-400" />
    </div>
    {/* Content */}
    <div className="px-4 pb-2">
      <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">{post.content}</p>
      {post.hashtags && post.hashtags.length > 0 && (
        <p className="text-sm text-blue-600 mt-2">{post.hashtags.map(h => `#${h}`).join(" ")}</p>
      )}
    </div>
    {/* Image */}
    {post.image_url && (
      <div className="w-full aspect-video bg-gray-100">
        <img src={post.image_url} alt="" className="w-full h-full object-cover" />
      </div>
    )}
    {/* Engagement */}
    <div className="px-4 py-2 flex items-center justify-between border-b border-gray-100">
      <div className="flex items-center gap-1">
        <span className="text-xs">👍❤️</span>
        <span className="text-xs text-gray-500">42</span>
      </div>
      <span className="text-xs text-gray-500">3 kommentarer · 5 delinger</span>
    </div>
    {/* Actions */}
    <div className="flex items-center justify-around px-4 py-2">
      {[{ icon: ThumbsUp, label: "Lik" }, { icon: MessageCircle, label: "Kommenter" }, { icon: Share2, label: "Del" }, { icon: Send, label: "Send" }].map(({ icon: Icon, label }) => (
        <button key={label} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 py-2 px-3 rounded hover:bg-gray-50 transition-colors">
          <Icon size={16} />
          <span className="text-xs font-medium">{label}</span>
        </button>
      ))}
    </div>
  </div>
);

const FacebookPreview = ({ post }: { post: Post }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 max-w-[500px] mx-auto text-left">
    <div className="flex items-center gap-3 p-4 pb-2">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center text-white font-bold">A</div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-900">Avargo</p>
        <p className="text-xs text-gray-500">Nå · 🌐</p>
      </div>
      <MoreHorizontal size={20} className="text-gray-400" />
    </div>
    <div className="px-4 pb-3">
      <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">{post.content}</p>
    </div>
    {post.image_url && (
      <div className="w-full aspect-video bg-gray-100">
        <img src={post.image_url} alt="" className="w-full h-full object-cover" />
      </div>
    )}
    <div className="px-4 py-2 flex items-center justify-between border-b border-gray-100">
      <div className="flex items-center gap-1">
        <span className="text-xs">👍❤️😮</span>
        <span className="text-xs text-gray-500">128</span>
      </div>
      <span className="text-xs text-gray-500">12 kommentarer · 8 delinger</span>
    </div>
    <div className="flex items-center justify-around px-4 py-2">
      {[{ icon: ThumbsUp, label: "Lik" }, { icon: MessageCircle, label: "Kommenter" }, { icon: Share2, label: "Del" }].map(({ icon: Icon, label }) => (
        <button key={label} className="flex items-center gap-1.5 text-gray-500 py-2 px-3 rounded hover:bg-gray-50">
          <Icon size={16} />
          <span className="text-xs font-medium">{label}</span>
        </button>
      ))}
    </div>
  </div>
);

const InstagramPreview = ({ post }: { post: Post }) => (
  <div className="bg-white rounded-lg border border-gray-200 max-w-[400px] mx-auto text-left">
    <div className="flex items-center gap-3 p-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-[2px]">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center text-white text-xs font-bold">A</div>
      </div>
      <p className="text-sm font-semibold text-gray-900 flex-1">avargo.no</p>
      <MoreHorizontal size={20} className="text-gray-900" />
    </div>
    {post.image_url ? (
      <div className="w-full aspect-square bg-gray-100">
        <img src={post.image_url} alt="" className="w-full h-full object-cover" />
      </div>
    ) : (
      <div className="w-full aspect-square bg-gradient-to-br from-teal-700 to-teal-900 flex items-center justify-center">
        <span className="text-white/30 text-lg font-bold">AVARGO</span>
      </div>
    )}
    <div className="p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Heart size={22} className="text-gray-900" />
          <MessageCircle size={22} className="text-gray-900" />
          <Send size={22} className="text-gray-900" />
        </div>
        <Bookmark size={22} className="text-gray-900" />
      </div>
      <p className="text-xs font-semibold text-gray-900">247 likerklikk</p>
      <p className="text-xs text-gray-800">
        <span className="font-semibold">avargo.no</span>{" "}
        {post.content.length > 150 ? post.content.slice(0, 150) + "..." : post.content}
      </p>
      {post.hashtags && post.hashtags.length > 0 && (
        <p className="text-xs text-blue-800">{post.hashtags.map(h => `#${h}`).join(" ")}</p>
      )}
    </div>
  </div>
);

const GoogleAdsPreview = ({ post }: { post: Post }) => {
  const lines = post.content.split("\n").filter(Boolean);
  const headline = lines[0] || post.title;
  const desc = lines.slice(1).join(" ").slice(0, 180) || post.content.slice(0, 180);
  return (
    <div className="max-w-[600px] mx-auto text-left space-y-1 p-4">
      <p className="text-xs text-gray-500">Sponset · avargo.no</p>
      <p className="text-lg text-blue-700 font-medium hover:underline cursor-pointer">{headline}</p>
      <p className="text-sm text-gray-600">{desc}</p>
      <div className="flex gap-3 mt-2">
        <Badge className="bg-blue-50 text-blue-700 text-xs">Kontakt oss</Badge>
        <Badge className="bg-blue-50 text-blue-700 text-xs">Se tjenester</Badge>
      </div>
    </div>
  );
};

const MetaAdsPreview = ({ post }: { post: Post }) => (
  <div className="bg-white rounded-lg border border-gray-200 max-w-[500px] mx-auto text-left">
    <div className="flex items-center gap-3 p-3">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center text-white font-bold">A</div>
      <div>
        <p className="text-sm font-semibold text-gray-900">Avargo</p>
        <p className="text-xs text-gray-500">Sponset · 🌐</p>
      </div>
    </div>
    <div className="px-3 pb-2">
      <p className="text-sm text-gray-800">{post.content.slice(0, 125)}</p>
    </div>
    {post.image_url ? (
      <div className="w-full aspect-video bg-gray-100">
        <img src={post.image_url} alt="" className="w-full h-full object-cover" />
      </div>
    ) : (
      <div className="w-full aspect-video bg-gradient-to-br from-teal-700 to-teal-900" />
    )}
    <div className="p-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-500 uppercase">avargo.no</p>
        <p className="text-sm font-semibold text-gray-900">{post.title}</p>
      </div>
      <button className="bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded">Lær mer</button>
    </div>
  </div>
);

const TikTokPreview = ({ post }: { post: Post }) => (
  <div className="bg-black rounded-2xl max-w-[350px] mx-auto text-left relative overflow-hidden" style={{ aspectRatio: "9/16", maxHeight: 500 }}>
    {post.image_url ? (
      <img src={post.image_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
    ) : (
      <div className="absolute inset-0 bg-gradient-to-b from-teal-900 to-black" />
    )}
    <div className="absolute bottom-0 left-0 right-12 p-4 space-y-2">
      <p className="text-white text-sm font-semibold">@avargo.no</p>
      <p className="text-white text-xs leading-relaxed">{post.content.slice(0, 150)}</p>
      {post.hashtags && (
        <p className="text-white/70 text-xs">{post.hashtags.slice(0, 5).map(h => `#${h}`).join(" ")}</p>
      )}
      <div className="flex items-center gap-2 text-white/60 text-xs">
        <span>🎵 Original lyd – Avargo</span>
      </div>
    </div>
    <div className="absolute right-3 bottom-20 flex flex-col items-center gap-5">
      {[{ icon: Heart, count: "1.2K" }, { icon: MessageCircle, count: "48" }, { icon: Share2, count: "156" }, { icon: Bookmark, count: "89" }].map(({ icon: Icon, count }) => (
        <div key={count} className="flex flex-col items-center gap-1">
          <Icon size={24} className="text-white" />
          <span className="text-white text-[10px]">{count}</span>
        </div>
      ))}
    </div>
  </div>
);

const PLATFORM_PREVIEWS: Record<string, React.FC<{ post: Post }>> = {
  linkedin: LinkedInPreview,
  facebook: FacebookPreview,
  instagram: InstagramPreview,
  google_ads: GoogleAdsPreview,
  meta_ads: MetaAdsPreview,
  tiktok: TikTokPreview,
};

const PLATFORM_NAMES: Record<string, string> = {
  linkedin: "LinkedIn",
  facebook: "Facebook",
  instagram: "Instagram",
  google_ads: "Google Ads",
  meta_ads: "Meta Ads",
  tiktok: "TikTok",
};

const PostPreviewDialog = ({ post, open, onOpenChange }: PostPreviewDialogProps) => {
  if (!post) return null;

  const PreviewComponent = PLATFORM_PREVIEWS[post.platform] || LinkedInPreview;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm">
            Forhåndsvisning – {PLATFORM_NAMES[post.platform] || post.platform}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 bg-muted/30 rounded-lg flex items-center justify-center min-h-[300px]">
          <PreviewComponent post={post} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostPreviewDialog;
