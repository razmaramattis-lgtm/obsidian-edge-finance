import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Phone, PhoneOff, Video, VideoOff, Mic, MicOff, X,
  Maximize2, Minimize2,
} from "lucide-react";
import UserAvatar from "./UserAvatar";

interface VideoCallProps {
  conversationId: string;
  profileId: string;
  profileName: string;
  profileAvatar?: string | null;
  otherName?: string;
  otherAvatar?: string | null;
  incoming?: { from: string; withVideo: boolean } | null;
  onClose: () => void;
}

type CallState = "idle" | "calling" | "ringing" | "connected" | "ended";

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

const VideoCall = ({
  conversationId, profileId, profileName, profileAvatar,
  otherName, otherAvatar, incoming, onClose,
}: VideoCallProps) => {
  const [state, setState] = useState<CallState>(incoming ? "ringing" : "calling");
  const [videoEnabled, setVideoEnabled] = useState(incoming ? incoming.withVideo : true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [duration, setDuration] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const channelRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedRef = useRef(false);

  const channelName = `call-${[profileId, conversationId].sort().join("-")}`;

  const cleanup = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    localStreamRef.current?.getTracks().forEach(t => t.stop());
    pcRef.current?.close();
    pcRef.current = null;
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

  // Setup WebRTC peer connection
  const setupPC = useCallback(() => {
    const pc = new RTCPeerConnection(ICE_SERVERS);
    pcRef.current = pc;

    pc.onicecandidate = (e) => {
      if (e.candidate && channelRef.current) {
        channelRef.current.send({
          type: "broadcast",
          event: "ice-candidate",
          payload: { candidate: e.candidate.toJSON(), from: profileId },
        });
      }
    };

    pc.ontrack = (e) => {
      if (remoteVideoRef.current && e.streams[0]) {
        remoteVideoRef.current.srcObject = e.streams[0];
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "connected") {
        setState("connected");
        timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
      }
      if (["disconnected", "failed", "closed"].includes(pc.connectionState)) {
        setState("ended");
        setTimeout(onClose, 2000);
      }
    };

    return pc;
  }, [profileId, onClose]);

  // Start local media
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
      // Fallback to audio only
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;
      return stream;
    }
  }, []);

  // Initialize signaling channel
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const ch = supabase.channel(channelName, {
      config: { broadcast: { self: false } },
    });

    channelRef.current = ch;

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
      try {
        await pcRef.current?.addIceCandidate(new RTCIceCandidate(payload.candidate));
      } catch { }
    });

    ch.on("broadcast", { event: "hangup" }, () => {
      setState("ended");
      cleanup();
      setTimeout(onClose, 1500);
    });

    ch.on("broadcast", { event: "accept" }, () => {
      // Other side accepted, we wait for offer/answer exchange
    });

    ch.subscribe(async (status) => {
      if (status !== "SUBSCRIBED") return;

      if (!incoming) {
        // Caller: send invite and create offer
        ch.send({ type: "broadcast", event: "invite", payload: { from: profileId, withVideo: videoEnabled } });

        const pc = setupPC();
        const stream = await getMedia(videoEnabled);
        stream.getTracks().forEach(t => pc.addTrack(t, stream));
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        ch.send({ type: "broadcast", event: "offer", payload: { sdp: offer, from: profileId } });
      }
    });

    return () => {
      cleanup();
    };
  }, []);

  // Accept incoming call
  const acceptCall = async () => {
    setState("connected");
    const pc = setupPC();
    const stream = await getMedia(incoming?.withVideo || false);
    stream.getTracks().forEach(t => pc.addTrack(t, stream));
    setVideoEnabled(incoming?.withVideo || false);
    channelRef.current?.send({ type: "broadcast", event: "accept", payload: { from: profileId } });
  };

  // Hangup
  const hangup = () => {
    channelRef.current?.send({ type: "broadcast", event: "hangup", payload: { from: profileId } });
    setState("ended");
    cleanup();
    setTimeout(onClose, 500);
  };

  // Toggle video
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
        pcRef.current?.getSenders().forEach(s => {
          if (!s.track || s.track.kind === "video") s.replaceTrack(vt);
        });
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        setVideoEnabled(true);
      } catch { }
    }
  };

  // Toggle audio
  const toggleAudio = () => {
    localStreamRef.current?.getAudioTracks().forEach(t => { t.enabled = !t.enabled; });
    setAudioEnabled(a => !a);
  };

  const stateLabel = {
    idle: "",
    calling: "Ringer…",
    ringing: "Innkommende samtale",
    connected: formatDuration(duration),
    ended: "Samtale avsluttet",
  };

  return (
    <div className={`fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center ${fullscreen ? "" : "p-4 sm:p-8"}`}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-black/50 pointer-events-none" />

      {/* Remote video (full background) */}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className={`absolute inset-0 w-full h-full object-cover ${state === "connected" ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
      />

      {/* Avatar display when no video */}
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

      {/* Connected overlay info */}
      {state === "connected" && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/50 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-white/10">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white text-sm font-medium">{otherName}</span>
          <span className="text-white/50 text-xs">{formatDuration(duration)}</span>
        </div>
      )}

      {/* Local video (PiP) */}
      <div className={`absolute ${fullscreen ? "bottom-24 right-6" : "bottom-28 right-8"} w-36 sm:w-48 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 bg-black`}>
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${videoEnabled ? "opacity-100" : "opacity-0"}`}
        />
        {!videoEnabled && (
          <div className="absolute inset-0 flex items-center justify-center bg-card/80">
            <UserAvatar name={profileName} avatarUrl={profileAvatar} size="md" />
          </div>
        )}
      </div>

      {/* Controls */}
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

export default VideoCall;
