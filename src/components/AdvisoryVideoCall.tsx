import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Video, VideoOff, Mic, MicOff, PhoneOff, Clock,
} from "lucide-react";

interface AdvisoryVideoCallProps {
  sessionId: string;
  categoryName: string;
  pricePerMinute: number;
  onEnd: () => void;
}

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

const AdvisoryVideoCall = ({ sessionId, categoryName, pricePerMinute, onEnd }: AdvisoryVideoCallProps) => {
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [duration, setDuration] = useState(0);
  const [connected, setConnected] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const channelRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedRef = useRef(false);

  const channelName = `advisory-call-${sessionId}`;

  const cleanup = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
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

  const getMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: { width: 640, height: 480, facingMode: "user" },
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      return stream;
    } catch {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;
      setVideoEnabled(false);
      return stream;
    }
  }, []);

  const setupPC = useCallback(() => {
    const pc = new RTCPeerConnection(ICE_SERVERS);
    pcRef.current = pc;

    pc.onicecandidate = (e) => {
      if (e.candidate && channelRef.current) {
        channelRef.current.send({
          type: "broadcast",
          event: "ice-candidate",
          payload: { candidate: e.candidate.toJSON(), from: "customer" },
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
        setConnected(true);
        if (!timerRef.current) {
          timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
        }
      }
      if (["disconnected", "failed", "closed"].includes(pc.connectionState)) {
        cleanup();
        onEnd();
      }
    };

    return pc;
  }, [cleanup, onEnd]);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const ch = supabase.channel(channelName, {
      config: { broadcast: { self: false } },
    });
    channelRef.current = ch;

    ch.on("broadcast", { event: "offer" }, async ({ payload }) => {
      if (payload.from === "customer") return;
      const pc = pcRef.current || setupPC();
      const stream = localStreamRef.current || (await getMedia());
      stream.getTracks().forEach((t) => pc.addTrack(t, stream));
      await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      ch.send({ type: "broadcast", event: "answer", payload: { sdp: answer, from: "customer" } });
    });

    ch.on("broadcast", { event: "answer" }, async ({ payload }) => {
      if (payload.from === "customer") return;
      await pcRef.current?.setRemoteDescription(new RTCSessionDescription(payload.sdp));
    });

    ch.on("broadcast", { event: "ice-candidate" }, async ({ payload }) => {
      if (payload.from === "customer") return;
      try {
        await pcRef.current?.addIceCandidate(new RTCIceCandidate(payload.candidate));
      } catch {}
    });

    ch.on("broadcast", { event: "hangup" }, () => {
      cleanup();
      onEnd();
    });

    ch.subscribe(async (status) => {
      if (status !== "SUBSCRIBED") return;
      // Customer initiates the call
      const pc = setupPC();
      const stream = await getMedia();
      stream.getTracks().forEach((t) => pc.addTrack(t, stream));
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      ch.send({ type: "broadcast", event: "offer", payload: { sdp: offer, from: "customer" } });
    });

    return () => cleanup();
  }, []);

  const hangup = () => {
    channelRef.current?.send({ type: "broadcast", event: "hangup", payload: { from: "customer" } });
    cleanup();
    onEnd();
  };

  const toggleVideo = async () => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const videoTracks = stream.getVideoTracks();
    if (videoTracks.length > 0) {
      videoTracks.forEach((t) => { t.enabled = !t.enabled; });
      setVideoEnabled(videoTracks[0].enabled);
    } else {
      try {
        const vs = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480, facingMode: "user" } });
        const vt = vs.getVideoTracks()[0];
        stream.addTrack(vt);
        pcRef.current?.getSenders().forEach((s) => {
          if (!s.track || s.track.kind === "video") s.replaceTrack(vt);
        });
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        setVideoEnabled(true);
      } catch {}
    }
  };

  const toggleAudio = () => {
    localStreamRef.current?.getAudioTracks().forEach((t) => { t.enabled = !t.enabled; });
    setAudioEnabled((a) => !a);
  };

  const estimatedCost = (duration / 60) * pricePerMinute;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-black/50 pointer-events-none" />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-4 sm:px-8 py-4">
        <div className="flex items-center gap-3 bg-black/50 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10">
          {connected && <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />}
          <span className="text-white/80 text-sm">{categoryName}</span>
          <span className="text-white/40 text-xs">·</span>
          <span className="text-white font-medium text-sm flex items-center gap-1.5">
            <Clock size={12} /> {formatDuration(duration)}
          </span>
        </div>
        <div className="bg-black/50 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10">
          <span className="text-white/50 text-xs">{pricePerMinute} kr/min</span>
          {duration > 0 && (
            <span className="text-white text-xs ml-2">≈ {Math.ceil(estimatedCost)} kr</span>
          )}
        </div>
      </div>

      {/* Video area */}
      <div className="flex-1 relative">
        {/* Remote video (advisor) - full screen */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${connected ? "opacity-100" : "opacity-0"}`}
        />

        {/* Waiting state */}
        {!connected && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
              <Video size={32} className="text-primary animate-pulse" />
            </div>
            <p className="text-white/80 text-lg font-medium">Kobler til rådgiver...</p>
            <p className="text-white/40 text-sm">Samtalen starter snart</p>
          </div>
        )}

        {/* Local video (customer) - PiP */}
        <div className="absolute bottom-28 right-4 sm:right-8 w-36 sm:w-48 aspect-[4/3] rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-black/60">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${videoEnabled ? "" : "opacity-0"}`}
          />
          {!videoEnabled && (
            <div className="absolute inset-0 flex items-center justify-center bg-card/80">
              <VideoOff size={20} className="text-white/50" />
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="relative z-10 flex items-center justify-center gap-4 py-6 px-4">
        <button
          onClick={toggleVideo}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-90 ${
            videoEnabled ? "bg-white/15 hover:bg-white/25 text-white" : "bg-red-500/30 text-red-300"
          }`}
          title={videoEnabled ? "Slå av kamera" : "Slå på kamera"}
        >
          {videoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
        </button>

        <button
          onClick={toggleAudio}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-90 ${
            audioEnabled ? "bg-white/15 hover:bg-white/25 text-white" : "bg-red-500/30 text-red-300"
          }`}
          title={audioEnabled ? "Demp mikrofon" : "Slå på mikrofon"}
        >
          {audioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
        </button>

        <button
          onClick={hangup}
          className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition-all active:scale-90 shadow-lg shadow-red-600/30"
          title="Avslutt samtale"
        >
          <PhoneOff size={22} />
        </button>
      </div>
    </div>
  );
};

export default AdvisoryVideoCall;
