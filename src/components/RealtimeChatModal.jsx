import React, { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import {
  useGetPrivateChatHistoryQuery,
  useSendPrivateChatMessageMutation,
} from "../services/backendApi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://backend.kalpjyotish.com";

const RealtimeChatModal = ({ isOpen, onClose, astrologer, userId, onInsufficientBalance = null }) => {
  const [message, setMessage] = useState("");
  const [liveMessages, setLiveMessages] = useState([]);
  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const [sendFallback] = useSendPrivateChatMessageMutation();

  const astrologerId = astrologer?._id;
  const { data: history = [] } = useGetPrivateChatHistoryQuery(
    { userId, astrologerId },
    { skip: !isOpen || !userId || !astrologerId }
  );

  const mergedMessages = useMemo(() => {
    const base = Array.isArray(history) ? history : [];
    if (!liveMessages.length) return base;
    const seen = new Set(base.map((m) => String(m._id)));
    const extra = liveMessages.filter((m) => !m._id || !seen.has(String(m._id)));
    return [...base, ...extra];
  }, [history, liveMessages]);

  useEffect(() => {
    if (!isOpen || !userId || !astrologerId) return undefined;
    const socket = io(API_BASE_URL, { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.emit("joinChat", { userId, astrologerId });
    socket.on("receiveMessage", (incoming) => {
      setLiveMessages((prev) => [...prev, incoming]);
    });
    socket.on("chatError", (err) => {
      const msg = err?.message || "Chat send failed";
      if (/insufficient/i.test(String(msg)) && typeof onInsufficientBalance === "function") {
        onInsufficientBalance();
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setLiveMessages([]);
    };
  }, [isOpen, userId, astrologerId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mergedMessages]);

  if (!isOpen || !astrologer) return null;

  const sendMessage = async () => {
    const trimmed = message.trim();
    if (!trimmed || !socketRef.current) return;

    const payload = {
      userId,
      astrologerId,
      senderId: userId,
      senderType: "user",
      message: trimmed,
    };

    socketRef.current.emit("sendMessage", payload);
    setMessage("");

    if (!socketRef.current.connected) {
      try {
        await sendFallback(payload).unwrap();
      } catch (err) {
        const msg = err?.data?.message || "";
        if (/insufficient/i.test(String(msg)) && typeof onInsufficientBalance === "function") {
          onInsufficientBalance();
        }
      }
    }
  };

  return (
    <div className="rt-chat-overlay" onClick={onClose}>
      <div className="rt-chat-modal" onClick={(e) => e.stopPropagation()}>
        <div className="rt-chat-header">
          <div>
            <strong>{astrologer.name}</strong>
            <p>Live chat</p>
          </div>
          <button className="rt-chat-close" onClick={onClose}>
            X
          </button>
        </div>
        <div className="rt-chat-messages">
          {mergedMessages.map((m, idx) => (
            <div key={m._id || idx} className={`rt-msg ${String(m.senderId) === String(userId) ? "user" : "astro"}`}>
              {m.message}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="rt-chat-input">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type message..."
          />
          <button onClick={sendMessage} disabled={!message.trim()}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default RealtimeChatModal;
