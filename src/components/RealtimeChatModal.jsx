// src/components/RealtimeChatModal.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiX, 
  FiSend, 
  FiUser, 
  FiStar, 
  FiClock,
  FiMessageCircle,
  FiCheck,
  FiCheckCircle,
  FiSmile
} from "react-icons/fi";
import {
  useGetPrivateChatHistoryQuery,
  useSendPrivateChatMessageMutation,
} from "../services/backendApi";
import "./RealtimeChatModal.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://backend.kalpjyotish.com";

const RealtimeChatModal = ({ isOpen, onClose, astrologer, userId, onInsufficientBalance = null }) => {
  const [message, setMessage] = useState("");
  const [liveMessages, setLiveMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [sendFallback] = useSendPrivateChatMessageMutation();

  const astrologerId = astrologer?._id;
  const { data: history = [], isLoading: historyLoading } = useGetPrivateChatHistoryQuery(
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

  // Socket connection
  useEffect(() => {
    if (!isOpen || !userId || !astrologerId) return undefined;
    
    setConnectionStatus("connecting");
    const socket = io(API_BASE_URL, { 
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnectionStatus("connected");
      socket.emit("joinChat", { userId, astrologerId });
    });

    socket.on("disconnect", () => {
      setConnectionStatus("disconnected");
    });

    socket.on("reconnect", () => {
      setConnectionStatus("connected");
      socket.emit("joinChat", { userId, astrologerId });
    });

    socket.on("receiveMessage", (incoming) => {
      setLiveMessages((prev) => [...prev, incoming]);
    });

    socket.on("typing", (data) => {
      if (data.isTyping && data.userId === astrologerId) {
        setIsTyping(true);
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000);
      }
    });

    socket.on("chatError", (err) => {
      const msg = err?.message || "Chat send failed";
      if (/insufficient/i.test(String(msg)) && typeof onInsufficientBalance === "function") {
        onInsufficientBalance();
        onClose();
      }
    });

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      socket.disconnect();
      socketRef.current = null;
      setLiveMessages([]);
      setIsTyping(false);
    };
  }, [isOpen, userId, astrologerId, onInsufficientBalance, onClose]);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mergedMessages]);

  // Typing indicator
  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit("typing", { 
        userId, 
        astrologerId, 
        isTyping: e.target.value.length > 0 
      });
    }
  };

  const sendMessage = async () => {
    const trimmed = message.trim();
    if (!trimmed || !socketRef.current) return;

    const payload = {
      userId,
      astrologerId,
      senderId: userId,
      senderType: "user",
      message: trimmed,
      timestamp: new Date().toISOString(),
    };

    // Add optimistic message
    const optimisticMessage = {
      ...payload,
      _id: `temp_${Date.now()}`,
      pending: true,
    };
    setLiveMessages((prev) => [...prev, optimisticMessage]);
    setMessage("");

    socketRef.current.emit("sendMessage", payload);

    if (!socketRef.current.connected) {
      try {
        await sendFallback(payload).unwrap();
        // Update message as sent
        setLiveMessages((prev) => 
          prev.map((msg) => 
            msg._id === optimisticMessage._id ? { ...msg, pending: false, sent: true } : msg
          )
        );
      } catch (err) {
        // Remove failed message
        setLiveMessages((prev) => prev.filter((msg) => msg._id !== optimisticMessage._id));
        const msg = err?.data?.message || "";
        if (/insufficient/i.test(String(msg)) && typeof onInsufficientBalance === "function") {
          onInsufficientBalance();
          onClose();
        }
      }
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const addEmoji = (emoji) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  if (!isOpen || !astrologer) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="rt-chat-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className="rt-chat-modal"
            initial={{ scale: 0.9, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 50, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="rt-chat-header">
              <div className="chat-header-info">
                <div className="astrologer-avatar">
                  {astrologer.profilePhoto ? (
                    <img src={astrologer.profilePhoto} alt={astrologer.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      <FiUser />
                    </div>
                  )}
                  <div className="online-status online"></div>
                </div>
                <div className="astrologer-details">
                  <strong>{astrologer.name}</strong>
                  <div className="astrologer-meta">
                    <FiStar className="meta-icon" />
                    <span>{astrologer.averageRating || "4.9"} ★</span>
                    <FiClock className="meta-icon" />
                    <span>Online</span>
                  </div>
                </div>
              </div>
              <button className="rt-chat-close" onClick={onClose}>
                <FiX />
              </button>
            </div>

            {/* Connection Status */}
            {connectionStatus !== "connected" && (
              <div className="connection-status">
                <div className="status-indicator"></div>
                <span>{connectionStatus === "connecting" ? "Connecting..." : "Reconnecting..."}</span>
              </div>
            )}

            {/* Messages Area */}
            <div className="rt-chat-messages">
              {historyLoading && mergedMessages.length === 0 && (
                <div className="chat-loading">
                  <div className="loading-spinner"></div>
                  <span>Loading conversation...</span>
                </div>
              )}
              
              {!historyLoading && mergedMessages.length === 0 && (
                <div className="chat-welcome">
                  <FiMessageCircle className="welcome-icon" />
                  <h4>Start a conversation</h4>
                  <p>Send a message to begin your consultation with {astrologer.name}</p>
                </div>
              )}

              {mergedMessages.map((m, idx) => (
                <div 
                  key={m._id || idx} 
                  className={`chat-message ${String(m.senderId) === String(userId) ? "sent" : "received"}`}
                >
                  <div className="message-bubble">
                    <p className="message-text">{m.message}</p>
                    <div className="message-meta">
                      <span className="message-time">{formatTime(m.timestamp || m.createdAt)}</span>
                      {String(m.senderId) === String(userId) && m.pending && (
                        <FiCheck className="message-status pending" />
                      )}
                      {String(m.senderId) === String(userId) && m.sent && (
                        <FiCheckCircle className="message-status sent" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="typing-indicator">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="typing-text">Astrologer is typing...</span>
                </div>
              )}
              
              <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <div className="rt-chat-input">
              <button 
                className="emoji-btn"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <FiSmile />
              </button>
              
              <textarea
                value={message}
                onChange={handleTyping}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                rows={1}
              />
              
              <button 
                className="send-btn"
                onClick={sendMessage} 
                disabled={!message.trim()}
              >
                <FiSend />
              </button>
            </div>

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="emoji-picker">
                <div className="emoji-list">
                  {["😊", "😀", "🙏", "✨", "🔮", "⭐", "❤️", "🌟", "🌙", "☀️", "🕉️", "🪷"].map((emoji) => (
                    <button key={emoji} onClick={() => addEmoji(emoji)}>
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Note */}
            <div className="chat-footer-note">
              <FiLock size={12} />
              <span>Your conversation is secure and private</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RealtimeChatModal;