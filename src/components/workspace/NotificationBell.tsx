import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Bell, Check, MessageCircle, Newspaper, Users, Heart, UserPlus, X } from "lucide-react";
import UserAvatar from "./UserAvatar";
import type { WsNotification } from "@/hooks/useWorkspaceNotifications";
import { timeAgo } from "./helpers";
import type { View } from "./types";

interface Props {
  notifications: WsNotification[];
  unreadCount: number;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onNavigate: (view: View, refId?: string) => void;
}

const typeIcon = (type: string) => {
  switch (type) {
    case "feed_post": return <Newspaper size={12} className="text-primary" />;
    case "feed_comment": return <MessageCircle size={12} className="text-accent" />;
    case "feed_reaction": return <Heart size={12} className="text-destructive" />;
    case "group_message": return <Users size={12} className="text-secondary" />;
    case "dm_message": return <MessageCircle size={12} className="text-primary" />;
    case "chat_message": return <MessageCircle size={12} className="text-secondary" />;
    case "friend_request": return <UserPlus size={12} className="text-accent" />;
    default: return <Bell size={12} className="text-muted-foreground" />;
  }
};

const typeLabel = (type: string) => {
  switch (type) {
    case "feed_post": return "Nytt innlegg";
    case "feed_comment": return "Ny kommentar";
    case "feed_reaction": return "Reagerte";
    case "group_message": return "Gruppemelding";
    case "dm_message": return "Direktemelding";
    case "chat_message": return "Chatmelding";
    case "friend_request": return "Venneforespørsel";
    default: return "Varsling";
  }
};

const NotificationBell = ({ notifications, unreadCount, onMarkRead, onMarkAllRead, onNavigate }: Props) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleClick = (n: WsNotification) => {
    // For DMs, don't mark read here - only when chat is opened
    if (n.type !== "dm_message") {
      onMarkRead(n.id);
    }

    // Navigate to the right place
    if (n.type === "feed_post" || n.type === "feed_comment" || n.type === "feed_reaction") {
      onNavigate("feed", n.reference_id || undefined);
    } else if (n.type === "group_message") {
      onNavigate("groups", n.reference_id || undefined);
    } else if (n.type === "dm_message") {
      onMarkRead(n.id);
      onNavigate("dms", n.reference_id || undefined);
    } else if (n.type === "friend_request") {
      onMarkRead(n.id);
      onNavigate("friends");
    }
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 px-1.5 py-0.5 rounded-full bg-destructive text-white text-[9px] font-bold min-w-[16px] text-center animate-in zoom-in-50 duration-200">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Mobile: full-screen overlay via portal */}
          {createPortal(
            <div className="sm:hidden fixed inset-0 z-[9999] bg-background flex flex-col animate-in fade-in slide-in-from-top-3 duration-150">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/15 bg-card/80 backdrop-blur-xl">
                <h3 className="text-base font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>Varsler</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button onClick={onMarkAllRead} className="text-[11px] text-primary hover:underline flex items-center gap-1">
                      <Check size={12} /> Merk alle lest
                    </button>
                  )}
                  <button onClick={() => setOpen(false)} className="p-2 -mr-2 rounded-xl text-muted-foreground hover:text-foreground transition-all">
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="text-center py-20">
                    <Bell size={32} className="text-muted-foreground/20 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Ingen varsler</p>
                  </div>
                ) : (
                  notifications.slice(0, 50).map(n => (
                    <button
                      key={n.id}
                      onClick={() => handleClick(n)}
                      className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-all active:bg-muted/40 ${!n.read ? "bg-primary/5" : ""}`}
                    >
                      <div className="relative shrink-0 mt-0.5">
                        <UserAvatar name={n.actor?.name || "?"} avatarUrl={n.actor?.avatar_url} size="md" />
                        <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-card flex items-center justify-center border border-border/20">
                          {typeIcon(n.type)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold truncate">{n.actor?.name || "Ukjent"}</span>
                          <span className="text-[11px] text-muted-foreground">{typeLabel(n.type)}</span>
                        </div>
                        {n.title && <p className="text-xs font-medium text-foreground/80 truncate mt-0.5">{n.title}</p>}
                        {n.body && <p className="text-[11px] text-muted-foreground truncate mt-0.5">{n.body}</p>}
                        <p className="text-[10px] text-muted-foreground/60 mt-1">{timeAgo(n.created_at)}</p>
                      </div>
                      {n.image_url && (
                        <img src={n.image_url} alt="" className="w-11 h-11 rounded-xl object-cover shrink-0" />
                      )}
                      {!n.read && <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-2" />}
                    </button>
                  ))
                )}
              </div>
            </div>,
            document.body
          )}

          {/* Desktop: dropdown popover */}
          <div className="hidden sm:flex absolute right-0 top-11 w-[380px] bg-card border border-border/30 rounded-2xl shadow-2xl z-50 max-h-[500px] flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border/10">
              <h3 className="text-sm font-semibold" style={{ fontFamily: "Outfit, sans-serif" }}>Varsler</h3>
              {unreadCount > 0 && (
                <button onClick={onMarkAllRead} className="text-[10px] text-primary hover:underline flex items-center gap-1">
                  <Check size={10} /> Merk alle som lest
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell size={28} className="text-muted-foreground/20 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Ingen varsler</p>
                </div>
              ) : (
                notifications.slice(0, 30).map(n => (
                  <button
                    key={n.id}
                    onClick={() => handleClick(n)}
                    className={`w-full flex items-start gap-3 px-5 py-3 text-left transition-all hover:bg-muted/30 ${!n.read ? "bg-primary/5" : ""}`}
                  >
                    <div className="relative shrink-0 mt-0.5">
                      <UserAvatar name={n.actor?.name || "?"} avatarUrl={n.actor?.avatar_url} size="sm" />
                      <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-card flex items-center justify-center border border-border/20">
                        {typeIcon(n.type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold truncate">{n.actor?.name || "Ukjent"}</span>
                        <span className="text-[10px] text-muted-foreground">{typeLabel(n.type)}</span>
                      </div>
                      {n.title && <p className="text-[11px] font-medium text-foreground/80 truncate mt-0.5">{n.title}</p>}
                      {n.body && <p className="text-[10px] text-muted-foreground truncate mt-0.5">{n.body}</p>}
                      <p className="text-[9px] text-muted-foreground/60 mt-1">{timeAgo(n.created_at)}</p>
                    </div>
                    {n.image_url && (
                      <img src={n.image_url} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                    )}
                    {!n.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />}
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
