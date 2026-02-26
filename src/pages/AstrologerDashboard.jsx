import React, { useEffect, useState } from "react";
import styles from "./AstrologerDashboard.module.css";
import { io } from "socket.io-client";
import ChatSection from "../components/astrologerDashboard/ChatSection";
import WalletSection from "../components/astrologerDashboard/WalletSection";
import EarningsSection from "../components/astrologerDashboard/EarningsSection";
import ProfileSection from "../components/astrologerDashboard/ProfileSection";
import AgoraCallModal from "../components/AgoraCallModal";
import {
  useGetAstroProfileQuery,
  useGetIncomingCallsQuery,
  useUpdateCallSessionStatusMutation,
} from "../services/backendApi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://backend.kalpjyotish.com";

const AstrologerDashboard = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const [acceptedIncomingCall, setAcceptedIncomingCall] = useState(null);
  const [ringingCall, setRingingCall] = useState(null);
  const localAstro = JSON.parse(localStorage.getItem("user") || "{}");
  const astrologerId = localAstro?._id || localAstro?.id;
  const { data: profileData } = useGetAstroProfileQuery(astrologerId, { skip: !astrologerId });
  const { data: incomingCalls = [] } = useGetIncomingCallsQuery(astrologerId, {
    skip: !astrologerId,
  });
  const [updateCallStatus] = useUpdateCallSessionStatusMutation();
  const astrologerData = profileData || localAstro || {};

  useEffect(() => {
    setRingingCall(incomingCalls[0] || null);
  }, [incomingCalls]);

  useEffect(() => {
    if (!astrologerId) return undefined;
    const socket = io(API_BASE_URL, { transports: ["websocket", "polling"] });
    socket.emit("joinUserRoom", { userId: astrologerId });

    socket.on("incomingCall", (call) => {
      if (call?.status === "ringing") setRingingCall(call);
    });
    socket.on("callStatusChanged", ({ channelName, status }) => {
      if (!channelName) return;
      setRingingCall((prev) =>
        prev?.channelName === channelName && status !== "ringing" ? null : prev
      );
      setAcceptedIncomingCall((prev) =>
        prev?.channelName === channelName && status === "ended" ? null : prev
      );
    });

    return () => socket.disconnect();
  }, [astrologerId]);

  const renderContent = () => {
    switch (activeTab) {
      case "chat":
        return <ChatSection astrologerId={astrologerId} />;
      case "wallet":
        return <WalletSection />;
      case "earnings":
        return <EarningsSection />;
      case "profile":
        return <ProfileSection astrologerData={astrologerData} />;
      default:
        return <ChatSection astrologerId={astrologerId} />;
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>KalpJyotish</h2>
          <p>Astrologer Portal</p>
        </div>

        <div className={styles.astrologerInfo}>
          <div className={styles.avatarContainer}>
            <img src={astrologerData.profilePhoto || astrologerData.profileImage || "/assets/user-avatar.png"} alt="Profile" />
            <span className={styles.onlineStatus}></span>
          </div>
          <h3>{astrologerData.name || "Astrologer"}</h3>
          <p>{Array.isArray(astrologerData.skills) ? astrologerData.skills.join(", ") : astrologerData.specialization || "-"}</p>
          <div className={styles.rating}>
            <span>⭐ {astrologerData.averageRating || astrologerData.rating || 0}</span>
            <span>{astrologerData.totalReviews || astrologerData.totalConsultations || 0} consultations</span>
          </div>
        </div>

        <nav className={styles.navigation}>
          <button className={`${styles.navItem} ${activeTab === "chat" ? styles.active : ""}`} onClick={() => setActiveTab("chat")}>
            <span className={styles.icon}>💬</span>
            Chat with Customers
          </button>
          <button className={`${styles.navItem} ${activeTab === "wallet" ? styles.active : ""}`} onClick={() => setActiveTab("wallet")}>
            <span className={styles.icon}>💰</span>
            My Wallet
          </button>
          <button className={`${styles.navItem} ${activeTab === "earnings" ? styles.active : ""}`} onClick={() => setActiveTab("earnings")}>
            <span className={styles.icon}>📊</span>
            Earnings
          </button>
          <button className={`${styles.navItem} ${activeTab === "profile" ? styles.active : ""}`} onClick={() => setActiveTab("profile")}>
            <span className={styles.icon}>👤</span>
            My Profile
          </button>
        </nav>

        <div className={styles.logoutSection}>
          <button
            className={styles.logoutBtn}
            onClick={() => {
              localStorage.removeItem("user");
              localStorage.removeItem("token");
              localStorage.removeItem("authToken");
              localStorage.removeItem("isLoggedIn");
              localStorage.removeItem("authRole");
              window.location.href = "/";
            }}
          >
            <span className={styles.icon}>🚪</span>
            Logout
          </button>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
        </header>
        <div className={styles.contentArea}>{renderContent()}</div>
      </main>

      {ringingCall && !acceptedIncomingCall ? (
        <div className={styles.incomingCallPopup}>
          <div className={styles.incomingTopRow}>
            <span className={styles.ringDot} />
            <h4>Incoming {ringingCall.callType} call</h4>
          </div>
          <p className={styles.incomingCaller}>{ringingCall.callerName || "User"}</p>
          <p className={styles.incomingChannel}>Channel: {ringingCall.channelName}</p>
          <div className={styles.incomingActions}>
            <button
              className={styles.acceptCallBtn}
              onClick={() => setAcceptedIncomingCall(ringingCall)}
            >
              Accept
            </button>
            <button
              className={styles.rejectCallBtn}
              onClick={async () => {
                await updateCallStatus({
                  channelName: ringingCall.channelName,
                  status: "rejected",
                });
              }}
            >
              Reject
            </button>
          </div>
        </div>
      ) : null}

      {acceptedIncomingCall ? (
        <AgoraCallModal
          isOpen={Boolean(acceptedIncomingCall)}
          onClose={() => setAcceptedIncomingCall(null)}
          astrologer={{ _id: astrologerId }}
          userId={astrologerId}
          callType={acceptedIncomingCall.callType}
          incomingCall={acceptedIncomingCall}
          callerName={astrologerData?.name || "Astrologer"}
        />
      ) : null}
    </div>
  );
};

export default AstrologerDashboard;
