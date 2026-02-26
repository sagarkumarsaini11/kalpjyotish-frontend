import React, { useEffect, useRef, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { io } from "socket.io-client";
import {
  useGenerateAgoraTokenMutation,
  useStartCallSessionMutation,
  useUpdateCallSessionStatusMutation,
} from "../services/backendApi";
import "./AgoraCallModal.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://backend.kalpjyotish.com";

const buildAgoraChannelName = (callType, astrologerId, userId) => {
  const safeType = String(callType || "voice").replace(/[^a-zA-Z0-9_]/g, "").slice(0, 8);
  const safeAstro = String(astrologerId || "").replace(/[^a-zA-Z0-9]/g, "").slice(-8);
  const safeUser = String(userId || "").replace(/[^a-zA-Z0-9]/g, "").slice(-8);
  const ts = Date.now().toString(36).slice(-8);
  return `${safeType}_${safeAstro}_${safeUser}_${ts}`.slice(0, 64);
};

const AgoraCallModal = ({
  isOpen,
  onClose,
  astrologer,
  userId,
  callType = "voice",
  callerName,
  incomingCall = null,
  onInsufficientBalance = null,
  presetChannelName = "",
}) => {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [remoteJoined, setRemoteJoined] = useState(false);
  const clientRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const tracksRef = useRef({ audioTrack: null, videoTrack: null });
  const channelRef = useRef("");
  const socketRef = useRef(null);
  const didCleanupRef = useRef(false);
  const startAttemptRef = useRef(0);
  const sessionInitializedRef = useRef(false);
  const connectedRef = useRef(false);

  const [generateToken] = useGenerateAgoraTokenMutation();
  const [startCallSession] = useStartCallSessionMutation();
  const [updateCallSessionStatus] = useUpdateCallSessionStatusMutation();

  const effectiveType = incomingCall?.callType || callType;
  const isVideo = effectiveType === "video";
  const peerName = incomingCall?.callerName || astrologer?.name || "Participant";

  const cleanup = async (statusValue = "ended", shouldUpdateStatus = false) => {
    if (didCleanupRef.current) return;
    didCleanupRef.current = true;
    startAttemptRef.current += 1;

    const channelName = channelRef.current;
    try {
      if (channelName && shouldUpdateStatus && (sessionInitializedRef.current || connectedRef.current)) {
        await updateCallSessionStatus({ channelName, status: statusValue }).unwrap();
      }
    } catch {}
    try {
      if (tracksRef.current.audioTrack) {
        tracksRef.current.audioTrack.stop();
        tracksRef.current.audioTrack.close();
      }
      if (tracksRef.current.videoTrack) {
        tracksRef.current.videoTrack.stop();
        tracksRef.current.videoTrack.close();
      }
      tracksRef.current = { audioTrack: null, videoTrack: null };
      if (clientRef.current) await clientRef.current.leave();
    } catch {}
    clientRef.current = null;
    channelRef.current = "";
    setRemoteJoined(false);
    connectedRef.current = false;
    sessionInitializedRef.current = false;
  };

  const startCall = async () => {
    if (!astrologer?._id || !userId) return;
    const attemptId = ++startAttemptRef.current;
    setError("");
    setStatus("joining");

    const uid = Math.floor(Math.random() * 1000000) + 1;
    const channelName = incomingCall?.channelName || presetChannelName || buildAgoraChannelName(effectiveType, astrologer._id, userId);
    channelRef.current = channelName;

    try {
      const tokenData = await generateToken({ channelName, role: "publisher", uid }).unwrap();
      if (attemptId !== startAttemptRef.current) return;

      if (!incomingCall) {
        await startCallSession({
          callerId: userId,
          receiverId: astrologer._id,
          callType: effectiveType,
          channelName,
          callerName: callerName || "User",
          profilePic: "",
        }).unwrap();
        sessionInitializedRef.current = true;
      } else {
        await updateCallSessionStatus({ channelName, status: "accepted" }).unwrap();
        sessionInitializedRef.current = true;
      }
      if (attemptId !== startAttemptRef.current) return;

      const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      clientRef.current = client;

      client.on("user-published", async (remoteUser, mediaType) => {
        await client.subscribe(remoteUser, mediaType);
        setRemoteJoined(true);
        if (mediaType === "audio") remoteUser.audioTrack?.play();
        if (mediaType === "video" && remoteVideoRef.current) {
          remoteUser.videoTrack?.play(remoteVideoRef.current);
        }
      });
      client.on("user-unpublished", () => {
        setRemoteJoined(false);
      });
      client.on("user-left", () => {
        setStatus("ended");
        setTimeout(() => onClose(), 900);
      });

      await client.join(tokenData.appId, channelName, tokenData.token, uid);
      if (attemptId !== startAttemptRef.current) return;

      if (isVideo) {
        const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        tracksRef.current = { audioTrack, videoTrack };
        if (localVideoRef.current) videoTrack.play(localVideoRef.current);
        await client.publish([audioTrack, videoTrack]);
      } else {
        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        tracksRef.current = { audioTrack, videoTrack: null };
        await client.publish([audioTrack]);
      }

      setStatus("connected");
      connectedRef.current = true;
    } catch (err) {
      const message = err?.data?.message || err?.data?.error || err?.message || "Failed to join call";
      if (attemptId !== startAttemptRef.current) return;
      if (/OPERATION_ABORTED|cancel token canceled/i.test(String(message))) {
        return;
      }
      setError(message);
      if (/insufficient/i.test(String(message)) && typeof onInsufficientBalance === "function") {
        onInsufficientBalance();
        onClose();
        return;
      }
      setStatus("error");
      await cleanup("missed", false);
    }
  };

  useEffect(() => {
    if (!isOpen) return undefined;
    didCleanupRef.current = false;
    connectedRef.current = false;
    sessionInitializedRef.current = false;
    startCall();
    return () => {
      cleanup("ended", false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !userId) return undefined;
    const socket = io(API_BASE_URL, { transports: ["websocket", "polling"] });
    socketRef.current = socket;
    socket.emit("joinUserRoom", { userId });
    socket.on("callStatusChanged", async ({ channelName, status: callStatus }) => {
      if (!channelRef.current || channelName !== channelRef.current) return;
      if (callStatus === "rejected") {
        setStatus("ended");
        setError("Call rejected");
        await cleanup("rejected", false);
        onClose();
      }
      if (callStatus === "ended" || callStatus === "missed") {
        setStatus("ended");
        await cleanup("ended", false);
        onClose();
      }
    });
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isOpen, userId, onClose]);

  if (!isOpen || !astrologer) return null;

  return (
    <div
      className="agora-overlay"
        onClick={async () => {
        await cleanup("ended", true);
        onClose();
      }}
    >
      <div className="agora-modal" onClick={(e) => e.stopPropagation()}>
        <div className="agora-top">
          <h2>{isVideo ? "Video Call" : "Audio Call"}</h2>
          <button
            className="agora-close"
            onClick={async () => {
              await cleanup("ended", true);
              onClose();
            }}
          >
            X
          </button>
        </div>

        <div className="agora-peer">{peerName}</div>
        <div className="agora-status">
          {status === "connected"
            ? remoteJoined
              ? "Connected"
              : "Connected. Waiting for participant media..."
            : status === "joining"
            ? "Joining call..."
            : status === "ended"
            ? error || "Call ended"
            : "Connecting..."}
        </div>
        {error ? <p className="agora-error">{error}</p> : null}

        {isVideo ? (
          <div className="agora-video-grid">
            <div className="agora-video-box">
              <label>You</label>
              <div ref={localVideoRef} className="agora-video-frame" />
            </div>
            <div className="agora-video-box">
              <label>Remote</label>
              <div ref={remoteVideoRef} className="agora-video-frame">
                {!remoteJoined ? <span className="agora-placeholder">Waiting for remote user...</span> : null}
              </div>
            </div>
          </div>
        ) : (
          <div className="agora-audio-state">
            <span className={remoteJoined ? "dot-live" : "dot-wait"} />
            {remoteJoined ? "Audio stream active" : "Waiting for remote participant..."}
          </div>
        )}

        <div className="agora-actions">
          <button
            className="agora-end"
            onClick={async () => {
              await cleanup("ended", true);
              onClose();
            }}
          >
            End Call
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgoraCallModal;
