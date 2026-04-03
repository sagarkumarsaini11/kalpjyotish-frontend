import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./ChatSection.module.css";
import { io } from "socket.io-client";
import {
  useGetAstrologerChatThreadsQuery,
  useGetPrivateChatHistoryQuery,
  useSendPrivateChatMessageMutation,
} from "../../services/backendApi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://backend.kalpjyotish.com";

// console.log("API_BASE_URL in ChatSection:", API_BASE_URL);
// console.log(import.meta.env);

const ChatSection = ({ astrologerId }) => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef(null);
  const [sendMessageMutation, { isLoading: isSending }] = useSendPrivateChatMessageMutation();

  const { data: threads = [], isLoading: isThreadsLoading, refetch: refetchThreads } =
    useGetAstrologerChatThreadsQuery(astrologerId, {
      skip: !astrologerId,
    });

  const selectedThread = useMemo(
    () => threads.find((t) => t.userId === selectedUserId) || threads[0],
    [threads, selectedUserId]
  );

  useEffect(() => {
    if (!selectedUserId && threads.length > 0) {
      setSelectedUserId(threads[0].userId);
    }
  }, [threads, selectedUserId]);

  const { data: messages = [], isLoading: isMessagesLoading, refetch } =
    useGetPrivateChatHistoryQuery(
      { userId: selectedThread?.userId, astrologerId },
      {
        skip: !selectedThread?.userId || !astrologerId,
      }
    );

  useEffect(() => {
    if (!astrologerId) return undefined;
    const socket = io(API_BASE_URL, { transports: ["websocket", "polling"] });
    socketRef.current = socket;
    socket.emit("joinUserRoom", { userId: astrologerId });
    socket.on("threadUpdated", () => {
      refetchThreads();
    });
    if (selectedThread?.userId) {
      socket.emit("joinChat", { userId: selectedThread.userId, astrologerId });
    }
    socket.on("receiveMessage", () => {
      refetch();
    });
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [astrologerId, selectedThread?.userId, refetch, refetchThreads]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedThread?.userId) return;

    const payload = {
      userId: selectedThread.userId,
      astroId: astrologerId,
      senderId: astrologerId,
      senderType: "astrologer",
      message: newMessage.trim(),
    };

    if (socketRef.current?.connected) {
      socketRef.current.emit("sendMessage", {
        userId: payload.userId,
        astrologerId: astrologerId,
        senderId: astrologerId,
        senderType: "astrologer",
        message: payload.message,
      });
    } else {
      await sendMessageMutation(payload);
    }
    setNewMessage("");
    refetchThreads();
  };

  if (!astrologerId) {
    return <div className={styles.chatContainer}>Please login as astrologer.</div>;
  }

  return (
    <div className={styles.chatContainer}>
      <div className={styles.customerList}>
        <div className={styles.searchBox}>
          <input type="text" value="" readOnly placeholder="User chats" />
        </div>
        {isThreadsLoading ? <p>Loading chats...</p> : null}
        {!isThreadsLoading && threads.length === 0 ? <p>No chats found yet.</p> : null}
        {threads.map((thread) => (
          <div
            key={thread.userId}
            className={`${styles.customerItem} ${selectedThread?.userId === thread.userId ? styles.active : ""}`}
            onClick={() => setSelectedUserId(thread.userId)}
          >
            <div className={styles.customerAvatar}>
              <div className={styles.avatarCircle}>{(thread.userName || "U").charAt(0)}</div>
            </div>
            <div className={styles.customerInfo}>
              <h4>{thread.userName || "User"}</h4>
              <p>{thread.lastMessage || ""}</p>
            </div>
            <div className={styles.customerMeta}>
              <span className={styles.time}>
                {thread.lastMessageAt ? new Date(thread.lastMessageAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.chatArea}>
        <div className={styles.chatHeader}>
          <div className={styles.customerDetails}>
            <div className={styles.avatarCircle}>{(selectedThread?.userName || "U").charAt(0)}</div>
            <div>
              <h3>{selectedThread?.userName || "Select a user"}</h3>
              <p>{selectedThread?.userMobile || ""}</p>
            </div>
          </div>
        </div>

        <div className={styles.messagesContainer}>
          {isMessagesLoading ? <p>Loading messages...</p> : null}
          {!isMessagesLoading &&
            messages.map((message) => {
              const isAstro = message.senderType === "astrologer";
              return (
                <div key={message._id} className={`${styles.message} ${isAstro ? styles.sent : styles.received}`}>
                  <div className={styles.messageContent}>
                    <p>{message.message}</p>
                    <span className={styles.messageTime}>
                      {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>

        <form className={styles.messageInput} onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit" className={styles.sendBtn} disabled={isSending}>
            {isSending ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatSection;
