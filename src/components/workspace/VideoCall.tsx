import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Phone, PhoneOff, Video, VideoOff, Mic, MicOff,
  Maximize2, Minimize2, Sparkles,
} from "lucide-react";
import UserAvatar from "./UserAvatar";

// ─── Filter definitions ───
const VIDEO_FILTERS = [
  { id: "none", label: "Ingen", css: "" },
  { id: "blur", label: "Blur BG", css: "backdrop-blur-effect" },
  { id: "sepia", label: "Sepia", css: "sepia" },
  { id: "grayscale", label: "S/H", css: "grayscale" },
  { id: "warm", label: "Varm", css: "saturate-[1.3] hue-rotate-[-10deg]" },
  { id: "cool", label: "Kald", css: "saturate-[1.2] hue-rotate-[15deg]" },
  { id: "contrast", label: "Kontrast", css: "contrast-[1.3] brightness-[1.05]" },
  { id: "vintage", label: "Vintage", css: "sepia-[0.4] contrast-[1.1] brightness-[0.95]" },
];

interface VideoCallProps {
  conversationId: string;
  profileId: string;
  profileName: string;
  profileAvatar?: string | null;
  otherName?: string;
  otherAvatar?: string | null;
  incoming?: { from: string; withVideo: boolean } | null;
  onClose: () => void;
  // Conference mode
  isConference?: boolean;
  conferenceId?: string;
  participants?: Array<{ id: string; name: string; avatar_url?: string | null }>;
}

type CallState = "idle" | "calling" | "ringing" | "connected" | "ended";

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

// ─── Filter Picker Sub-component ───
const FilterPicker = ({ active, onSelect }: { active: string; onSelect: (id: string) => void }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-90 ${
          active !== "none" ? "bg-purple-500/30 text-purple-300" : "bg-white/15 hover:bg-white/25 text-white"
        }`}
        title="Filtre"
      >
        <Sparkles size={20} />
      </button>
      {open && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-3 flex flex-wrap gap-2 w-56 shadow-2xl animate-in fade-in zoom-in-95">
          {VIDEO_FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => { onSelect(f.id); setOpen(false); }}
              className={`px-3 py-1.5 rounded-xl text-xs transition-all ${
                active === f.id
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Main VideoCall Component ───
const VideoCall = ({
  conversationId, profileId, profileName, profileAvatar,
  otherName, otherAvatar, incoming, onClose,
  isConference, conferenceId, participants,
}: VideoCallProps) => {
  const [state, setState] = useState<CallState>(incoming ? "ringing" : "calling");
  const [videoEnabled, setVideoEnabled] = useState(incoming ? incoming.withVideo : true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [duration, setDuration] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("none");

  // Conference: multiple peer connections
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const pcsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);
  const channelRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedRef = useRef(false);

  const channelName = isConference
    ? `conf-${conferenceId}`
    : `call-${[profileId, conversationId].sort().join("-")}`;

  const cleanup = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    localStreamRef.current?.getTracks().forEach(t => t.stop());
    pcRef.current?.close();
    pcRef.current = null;
    pcsRef.current.forEach(pc => pc.close());
    pcsRef.current.clear();
    localStreamRef.current = null;
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  }, []);

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const getFilterCss = () => VIDEO_FILTERS.find(f => f.id === activeFilter)?.css || "";

  // Setup WebRTC peer connection (1-to-1 or per-peer in conference)
  const setupPC = useCallback((peerId?: string) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    if (!isConference) {
      pcRef.current = pc;
    } else if (peerId) {
      pcsRef.current.set(peerId, pc);
    }

    pc.onicecandidate = (e) => {
      if (e.candidate && channelRef.current) {
        channelRef.current.send({
          type: "broadcast",
          event: "ice-candidate",
          payload: { candidate: e.candidate.toJSON(), from: profileId, to: peerId },
        });
      }
    };

    pc.ontrack = (e) => {
      if (!isConference) {
        if (remoteVideoRef.current && e.streams[0]) {
          remoteVideoRef.current.srcObject = e.streams[0];
        }
      } else if (peerId && e.streams[0]) {
        setRemoteStreams(prev => new Map(prev).set(peerId, e.streams[0]));
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "connected") {
        setState("connected");
        if (!timerRef.current) {
          timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
        }
      }
      if (!isConference && ["disconnected", "failed", "closed"].includes(pc.connectionState)) {
        setState("ended");
        setTimeout(onClose, 2000);
      }
    };

    return pc;
  }, [profileId, onClose, isConference]);

  const getMedia = useCallback(async (withVideo: boolean) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: withVideo ? { width: 640, height: 480, facingMode: "user" } : false,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      return stream;
    } catch {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;
      return stream;
    }
  }, []);

  // ─── Signaling ───
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const ch = supabase.channel(channelName, {
      config: { broadcast: { self: false } },
    });
    channelRef.current = ch;

    if (isConference) {
      // Conference mesh signaling
      ch.on("broadcast", { event: "join" }, async ({ payload }) => {
        if (payload.from === profileId) return;
        const stream = localStreamRef.current || await getMedia(videoEnabled);
        const pc = setupPC(payload.from);
        stream.getTracks().forEach(t => pc.addTrack(t, stream));
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        ch.send({ type: "broadcast", event: "offer", payload: { sdp: offer, from: profileId, to: payload.from } });
      });

      ch.on("broadcast", { event: "offer" }, async ({ payload }) => {
        if (payload.to !== profileId) return;
        const stream = localStreamRef.current || await getMedia(videoEnabled);
        const pc = setupPC(payload.from);
        stream.getTracks().forEach(t => pc.addTrack(t, stream));
        await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        ch.send({ type: "broadcast", event: "answer", payload: { sdp: answer, from: profileId, to: payload.from } });
      });

      ch.on("broadcast", { event: "answer" }, async ({ payload }) => {
        if (payload.to !== profileId) return;
        const pc = pcsRef.current.get(payload.from);
        if (pc) await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
      });

      ch.on("broadcast", { event: "ice-candidate" }, async ({ payload }) => {
        if (payload.to !== profileId) return;
        const pc = pcsRef.current.get(payload.from);
        if (pc) try { await pc.addIceCandidate(new RTCIceCandidate(payload.candidate)); } catch {}
      });

      ch.on("broadcast", { event: "leave" }, ({ payload }) => {
        const pc = pcsRef.current.get(payload.from);
        if (pc) { pc.close(); pcsRef.current.delete(payload.from); }
        setRemoteStreams(prev => { const m = new Map(prev); m.delete(payload.from); return m; });
      });

      ch.subscribe(async (status) => {
        if (status !== "SUBSCRIBED") return;
        const stream = await getMedia(videoEnabled);
        setState("connected");
        if (!timerRef.current) timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
        ch.send({ type: "broadcast", event: "join", payload: { from: profileId } });
      });
    } else {
      // 1-to-1 signaling (existing logic)
      ch.on("broadcast", { event: "offer" }, async ({ payload }) => {
        if (payload.from === profileId) return;
        const pc = pcRef.current || setupPC();
        const stream = localStreamRef.current || await getMedia(videoEnabled);
        stream.getTracks().forEach(t => pc.addTrack(t, stream));
        await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        ch.send({ type: "broadcast", event: "answer", payload: { sdp: answer, from: profileId } });
      });

      ch.on("broadcast", { event: "answer" }, async ({ payload }) => {
        if (payload.from === profileId) return;
        await pcRef.current?.setRemoteDescription(new RTCSessionDescription(payload.sdp));
      });

      ch.on("broadcast", { event: "ice-candidate" }, async ({ payload }) => {
        if (payload.from === profileId) return;
        try { await pcRef.current?.addIceCandidate(new RTCIceCandidate(payload.candidate)); } catch {}
      });

      ch.on("broadcast", { event: "hangup" }, () => {
        setState("ended");
        cleanup();
        setTimeout(onClose, 1500);
      });

      ch.on("broadcast", { event: "accept" }, () => {});

      ch.subscribe(async (status) => {
        if (status !== "SUBSCRIBED") return;
        if (!incoming) {
          ch.send({ type: "broadcast", event: "invite", payload: { from: profileId, withVideo: videoEnabled } });
          const pc = setupPC();
          const stream = await getMedia(videoEnabled);
          stream.getTracks().forEach(t => pc.addTrack(t, stream));
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          ch.send({ type: "broadcast", event: "offer", payload: { sdp: offer, from: profileId } });
        }
      });
    }

    return () => { cleanup(); };
  }, []);

  const acceptCall = async () => {
    setState("connected");
    const pc = setupPC();
    const stream = await getMedia(incoming?.withVideo || false);
    stream.getTracks().forEach(t => pc.addTrack(t, stream));
    setVideoEnabled(incoming?.withVideo || false);
    channelRef.current?.send({ type: "broadcast", event: "accept", payload: { from: profileId } });
  };

  const hangup = () => {
    if (isConference) {
      channelRef.current?.send({ type: "broadcast", event: "leave", payload: { from: profileId } });
    } else {
      channelRef.current?.send({ type: "broadcast", event: "hangup", payload: { from: profileId } });
    }
    setState("ended");
    cleanup();
    setTimeout(onClose, 500);
  };

  const toggleVideo = async () => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const videoTracks = stream.getVideoTracks();
    if (videoTracks.length > 0) {
      videoTracks.forEach(t => { t.enabled = !t.enabled; });
      setVideoEnabled(videoTracks[0].enabled);
    } else if (!videoEnabled) {
      try {
        const vs = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480, facingMode: "user" } });
        const vt = vs.getVideoTracks()[0];
        stream.addTrack(vt);
        const senders = isConference
          ? [...pcsRef.current.values()].flatMap(pc => pc.getSenders())
          : pcRef.current?.getSenders() || [];
        senders.forEach(s => { if (!s.track || s.track.kind === "video") s.replaceTrack(vt); });
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        setVideoEnabled(true);
      } catch {}
    }
  };

  const toggleAudio = () => {
    localStreamRef.current?.getAudioTracks().forEach(t => { t.enabled = !t.enabled; });
    setAudioEnabled(a => !a);
  };

  const stateLabel: Record<CallState, string> = {
    idle: "",
    calling: "Ringer…",
    ringing: "Innkommende samtale",
    connected: formatDuration(duration),
    ended: "Samtale avsluttet",
  };

  const filterCss = getFilterCss();
  const totalParticipants = isConference ? remoteStreams.size + 1 : 2;

  // Conference grid layout
  const getGridClass = () => {
    if (totalParticipants <= 2) return "grid-cols-1 sm:grid-cols-2";
    return "grid-cols-2";
  };

  return (
    <div className={`fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center ${fullscreen ? "" : "p-4 sm:p-8"}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-black/50 pointer-events-none" />

      {/* ─── Conference grid mode ─── */}
      {isConference && state === "connected" ? (
        <div className={`absolute inset-4 bottom-24 grid ${getGridClass()} gap-3`}>
          {/* Local */}
          <div className="relative rounded-2xl overflow-hidden bg-card/20 border border-white/10">
            <video
              ref={localVideoRef}
              autoPlay playsInline muted
              className={`w-full h-full object-cover ${filterCss} ${videoEnabled ? "" : "opacity-0"}`}
            />
            {!videoEnabled && (
              <div className="absolute inset-0 flex items-center justify-center bg-card/80">
                <UserAvatar name={profileName} avatarUrl={profileAvatar} size="lg" />
              </div>
            )}
            <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-xl bg-black/50 backdrop-blur-sm text-white text-xs">
              Du
            </div>
          </div>

          {/* Remote participants */}
          {[...remoteStreams.entries()].map(([peerId, stream]) => {
            const p = participants?.find(pp => pp.id === peerId);
            return (
              <div key={peerId} className="relative rounded-2xl overflow-hidden bg-card/20 border border-white/10">
                <RemoteVideo stream={stream} filterCss={filterCss} />
                <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-xl bg-black/50 backdrop-blur-sm text-white text-xs">
                  {p?.name || "Deltaker"}
                </div>
              </div>
            );
          })}

          {/* Empty slots */}
          {participants && [...Array(Math.max(0, participants.length - remoteStreams.size - 1))].map((_, i) => (
            <div key={`empty-${i}`} className="rounded-2xl border border-white/5 bg-white/5 flex items-center justify-center">
              <p className="text-white/30 text-xs">Venter på deltaker…</p>
            </div>
          ))}
        </div>
      ) : !isConference ? (
        <>
          {/* 1-to-1: Remote video full background */}
          <video
            ref={remoteVideoRef}
            autoPlay playsInline
            className={`absolute inset-0 w-full h-full object-cover ${filterCss} ${state === "connected" ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
          />

          {/* Avatar display when not connected */}
          {state !== "connected" && (
            <div className="relative flex flex-col items-center gap-6 animate-in fade-in zoom-in-95">
              <div className="relative">
                <div className={`w-32 h-32 rounded-full overflow-hidden ring-4 ${
                  state === "ringing" ? "ring-green-400/60 animate-pulse" : "ring-primary/30"
                }`}>
                  <UserAvatar name={otherName || "?"} avatarUrl={otherAvatar} size="lg" />
                </div>
                {state === "calling" && (
                  <div className="absolute inset-0 rounded-full border-4 border-primary/40 animate-ping" />
                )}
              </div>
              <div className="text-center">
                <p className="text-white text-xl font-semibold">{otherName || "Ukjent"}</p>
                <p className="text-white/60 text-sm mt-1">{stateLabel[state]}</p>
              </div>
            </div>
          )}

          {/* Connected info bar */}
          {state === "connected" && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/50 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-white/10">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white text-sm font-medium">{otherName}</span>
              <span className="text-white/50 text-xs">{formatDuration(duration)}</span>
            </div>
          )}

          {/* Local PiP */}
          <div className={`absolute ${fullscreen ? "bottom-24 right-6" : "bottom-28 right-8"} w-36 sm:w-48 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 bg-black`}>
            <video
              ref={localVideoRef}
              autoPlay playsInline muted
              className={`w-full h-full object-cover ${filterCss} ${videoEnabled ? "opacity-100" : "opacity-0"}`}
            />
            {!videoEnabled && (
              <div className="absolute inset-0 flex items-center justify-center bg-card/80">
                <UserAvatar name={profileName} avatarUrl={profileAvatar} size="md" />
              </div>
            )}
          </div>
        </>
      ) : (
        /* Conference waiting */
        <div className="relative flex flex-col items-center gap-6 animate-in fade-in zoom-in-95">
          <div className="flex -space-x-4">
            {participants?.slice(0, 4).map(p => (
              <div key={p.id} className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-black">
                <UserAvatar name={p.name} avatarUrl={p.avatar_url} size="md" />
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-white text-xl font-semibold">Konferansesamtale</p>
            <p className="text-white/60 text-sm mt-1">{stateLabel[state]}</p>
          </div>
        </div>
      )}

      {/* Conference info bar */}
      {isConference && state === "connected" && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/50 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-white/10">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white text-sm font-medium">{totalParticipants} deltakere</span>
          <span className="text-white/50 text-xs">{formatDuration(duration)}</span>
        </div>
      )}

      {/* ─── Controls ─── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
        {state === "ringing" ? (
          <>
            <button onClick={hangup} className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-xl shadow-red-500/30 transition-all active:scale-90">
              <PhoneOff size={24} />
            </button>
            <button onClick={acceptCall} className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-xl shadow-green-500/30 transition-all active:scale-90 animate-bounce">
              <Phone size={24} />
            </button>
          </>
        ) : (
          <>
            <FilterPicker active={activeFilter} onSelect={setActiveFilter} />
            <button onClick={toggleAudio} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-90 ${
              audioEnabled ? "bg-white/15 hover:bg-white/25 text-white" : "bg-red-500/80 hover:bg-red-500 text-white"
            }`}>
              {audioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
            </button>
            <button onClick={toggleVideo} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-90 ${
              videoEnabled ? "bg-white/15 hover:bg-white/25 text-white" : "bg-white/10 text-white/60"
            }`}>
              {videoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
            </button>
            <button onClick={hangup} className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-xl shadow-red-500/30 transition-all active:scale-90">
              <PhoneOff size={24} />
            </button>
            <button onClick={() => setFullscreen(f => !f)} className="w-14 h-14 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-all active:scale-90">
              {fullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// ─── Remote Video helper ───
const RemoteVideo = ({ stream, filterCss }: { stream: MediaStream; filterCss: string }) => {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.srcObject = stream;
  }, [stream]);
  return <video ref={ref} autoPlay playsInline className={`w-full h-full object-cover ${filterCss}`} />;
};

export default VideoCall;
