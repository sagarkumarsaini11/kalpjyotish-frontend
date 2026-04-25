// src/pages/AstrologerList.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./AstrologerList.css";
import Footer from '../components/Footer';
import {
  useCreateRechargeOrderMutation,
  useGetAstrologersQuery,
  useGetWalletSummaryQuery,
  useVerifyRechargePaymentMutation,
} from "../services/backendApi";
import RealtimeChatModal from "../components/RealtimeChatModal";
import AgoraCallModal from "../components/AgoraCallModal";

// Professional Icon Components
const Icons = {
  Star: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FFD700" stroke="#FFD700" strokeWidth="1.5"/>
    </svg>
  ),
  Chat: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="currentColor"/>
    </svg>
  ),
  Call: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.68 14.91 16.08 14.82 16.43 14.94C17.55 15.31 18.76 15.51 20 15.51C20.55 15.51 21 15.96 21 16.51V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" fill="currentColor"/>
    </svg>
  ),
  Video: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 10.5V7C17 6.45 16.55 6 16 6H4C3.45 6 3 6.45 3 7V17C3 17.55 3.45 18 4 18H16C16.55 18 17 17.55 17 17V13.5L21 17.5V6.5L17 10.5Z" fill="currentColor"/>
    </svg>
  ),
  Rating: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" fill="#FFD700"/>
    </svg>
  ),
  Review: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="currentColor"/>
    </svg>
  ),
  Experience: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM15 13H8V11H15V13Z" fill="currentColor"/>
    </svg>
  ),
  Language: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.87 15.07L10.33 12.56L10.36 12.53C12.1 10.59 13.34 8.36 14.07 6H17V4H10V2H8V4H1V6H12.17C11.5 7.92 10.44 9.75 9 11.35C8.07 10.32 7.3 9.19 6.69 8H4.69C5.42 9.63 6.42 11.17 7.64 12.5L4 16.17L5.41 17.58L9 14L12.11 17.11L12.87 15.07Z" fill="currentColor"/>
    </svg>
  ),
  Close: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
    </svg>
  ),
  Check: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="#00ff88"/>
    </svg>
  ),
  CloseX: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Wallet: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 18V19C21 20.1 20.1 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.89 3 5 3H19C20.1 3 21 3.9 21 5V6H12C10.89 6 10 6.9 10 8V16C10 17.1 10.89 18 12 18H21ZM12 16H22V8H12V16ZM16 13.5C15.17 13.5 14.5 12.83 14.5 12C14.5 11.17 15.17 10.5 16 10.5C16.83 10.5 17.5 11.17 17.5 12C17.5 12.83 16.83 13.5 16 13.5Z" fill="currentColor"/>
    </svg>
  ),
  Free: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM13 7H11V9H13V7ZM13 11H11V17H13V11Z" fill="currentColor"/>
    </svg>
  ),
};

const buildCallChannelName = (callType, astrologerId, userId) => {
  const safeType = String(callType || "voice").replace(/[^a-zA-Z0-9_]/g, "").slice(0, 8);
  const safeAstro = String(astrologerId || "").replace(/[^a-zA-Z0-9]/g, "").slice(-8);
  const safeUser = String(userId || "").replace(/[^a-zA-Z0-9]/g, "").slice(-8);
  const ts = Date.now().toString(36).slice(-8);
  return `${safeType}_${safeAstro}_${safeUser}_${ts}`.slice(0, 64);
};

/* =====================================================
   BUY CREDITS MODAL
===================================================== */
const BuyCreditsModal = ({ isOpen, onClose, walletSummary, onRecharge, loading }) => {
  const [selectedAmount, setSelectedAmount] = useState(199);
  const options = [99, 199, 499, 999, 1999];

  if (!isOpen) return null;

  return (
    <motion.div 
      className="rt-chat-overlay" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      onClick={onClose}
    >
      <motion.div 
        className="rt-chat-modal credits-modal" 
        initial={{ scale: 0.92, y: 30 }} 
        animate={{ scale: 1, y: 0 }} 
        exit={{ scale: 0.92, y: 30 }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rt-chat-header">
          <div className="header-icon">
            <Icons.Wallet />
          </div>
          <div>
            <strong>Buy Credits</strong>
            <p>Recharge wallet to connect with astrologers</p>
          </div>
          <button className="rt-chat-close" onClick={onClose}>
            <Icons.CloseX />
          </button>
        </div>
        
        <div className="credits-content">
          <div className="wallet-info">
            <div className="wallet-balance">
              <span className="label">Wallet Balance</span>
              <span className="amount">₹{Number(walletSummary?.walletBalance || 0).toFixed(2)}</span>
            </div>
            <div className="free-minutes">
              <Icons.Free />
              <span>Free Minutes: {Number(walletSummary?.freeMinutesRemaining || 0).toFixed(2)}</span>
            </div>
          </div>

          <div className="amount-options">
            <h4>Select Amount</h4>
            <div className="options-grid">
              {options.map((amount) => (
                <button
                  key={amount}
                  className={`amount-option ${selectedAmount === amount ? 'active' : ''}`}
                  onClick={() => setSelectedAmount(amount)}
                >
                  <span className="currency">₹</span>
                  {amount}
                </button>
              ))}
            </div>
          </div>

          <button 
            className="recharge-button" 
            disabled={loading} 
            onClick={() => onRecharge(selectedAmount)}
          >
            {loading ? (
              <div className="loading-spinner"></div>
            ) : (
              <>Recharge ₹{selectedAmount}</>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* =====================================================
   ASTROLOGER PROFILE MODAL
===================================================== */
const AstrologerProfileModal = ({ astro, onClose, onChat, onCall, onVideoCall }) => {
  if (!astro) return null;

  return (
    <motion.div
      className="astro-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="astro-profile-modal"
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-glow-orb modal-glow-1"></div>
        <div className="modal-glow-orb modal-glow-2"></div>
        <div className="modal-stars">✦</div>
        <div className="modal-stars modal-star-2">✧</div>
        <div className="modal-stars modal-star-3">✦</div>

        <button className="astro-modal-close-btn" onClick={onClose}>
          <Icons.CloseX />
        </button>

        <div className="profile-header">
          <div className="profile-img-container">
            <div className="profile-ring"></div>
            <div className="profile-ring profile-ring-2"></div>
            <img
              className="profile-img"
              src={
                astro.profilePhoto ||
                astro.user_profile ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(astro.name)}&background=6b21e5&color=ffd700&bold=true`
              }
              alt={astro.name}
            />
            <div className="online-indicator"></div>
          </div>

          <h2 className="profile-name">{astro.name}</h2>
          <p className="profile-experience">
            <Icons.Experience />
            {astro.experience || "10+"} Years Experience
          </p>

          <div className="profile-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <Icons.Rating key={i} />
              ))}
            </div>
            <span className="rating-text">{astro.averageRating || "4.9"} ({astro.totalReviews || "850"} reviews)</span>
          </div>

          <span className={`status-badge ${astro.availabilityStatus === 'online' ? 'online' : 'offline'}`}>
            <span className="status-dot"></span>
            {astro.availabilityStatus === "online" ? "Online Now" : "Offline"}
          </span>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <div className="section-header">
              <span className="section-icon">🔮</span>
              <h4>Areas of Expertise</h4>
            </div>
            <div className="tag-list">
              {(astro.skills || ["Vedic Astrology", "Tarot Reading", "Numerology", "Palmistry", "Vastu Shastra"]).map((s, i) => (
                <span key={i} className="skill-tag">
                  <span className="tag-shine"></span>
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="profile-section">
            <div className="section-header">
              <Icons.Language />
              <h4>Languages Known</h4>
            </div>
            <div className="languages-grid">
              {(astro.languages || astro.language || ["English", "Hindi", "Sanskrit", "Telugu", "Tamil"]).map((lang, i) => (
                <div key={i} className="language-item">
                  <span className="lang-bullet">●</span>
                  {lang}
                </div>
              ))}
            </div>
          </div>

          <div className="profile-section">
            <div className="section-header">
              <span className="section-icon">📅</span>
              <h4>Services & Pricing</h4>
            </div>
            <div className="availability-grid">
              <div className="availability-item">
                <span className="avail-icon">💬</span>
                <div>
                  <div className="avail-title">Chat Consultation</div>
                  <div className="avail-price">₹{astro.chatFee || "15"}/min</div>
                </div>
                <Icons.Check />
              </div>

              <div className="availability-item">
                <span className="avail-icon">📞</span>
                <div>
                  <div className="avail-title">Audio Call</div>
                  <div className="avail-price">₹{astro.callFee || "20"}/min</div>
                </div>
                <Icons.Check />
              </div>

              <div className="availability-item">
                <span className="avail-icon">📹</span>
                <div>
                  <div className="avail-title">Video Consultation</div>
                  <div className="avail-price">₹{astro.videoFee || "25"}/min</div>
                </div>
                <Icons.Check />
              </div>
            </div>
          </div>
        </div>

        <div className="profile-footer">
          <button 
            className="modal-chat-btn" 
            onClick={() => { onChat(astro); onClose(); }}
          >
            <span className="btn-glow"></span>
            <Icons.Chat />
            <span>Start Chat</span>
          </button>
          <button 
            className="modal-call-btn" 
            onClick={() => { onCall(astro); onClose(); }}
          >
            <span className="btn-glow"></span>
            <Icons.Call />
            <span>Call Now</span>
          </button>
          <button 
            className="modal-video-btn" 
            onClick={() => { onVideoCall(astro); onClose(); }}
          >
            <span className="btn-glow"></span>
            <Icons.Video />
            <span>Video Call</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* =====================================================
   MAIN PAGE COMPONENT
===================================================== */
const AstrologerList = () => {
  const ensureObjectId = (value) => /^[a-fA-F0-9]{24}$/.test(String(value || ""));
  
  const [selectedAstro, setSelectedAstro] = useState(null);
  const [showBuyCreditsModal, setShowBuyCreditsModal] = useState(false);
  const [chatAstro, setChatAstro] = useState(null);
  const [callConfig, setCallConfig] = useState({ astrologer: null, type: "voice", channelName: "" });

  const { data: astrologers = [], isLoading: loading } = useGetAstrologersQuery();
  const [createRechargeOrder, { isLoading: isCreatingOrder }] = useCreateRechargeOrderMutation();
  const [verifyRechargePayment, { isLoading: isVerifyingPayment }] = useVerifyRechargePaymentMutation();

  let storedUser = {};
  try {
    const data = localStorage.getItem("user");
    storedUser = data && data !== "undefined" ? JSON.parse(data) : {};
  } catch {
    storedUser = {};
  }

  const callerName = storedUser?.name || "Guest User";
  const candidateUserId = storedUser?._id || storedUser?.id || storedUser?.user?._id || storedUser?.user?.id || localStorage.getItem("userId") || localStorage.getItem("backendUserId") || "";
  const dbUserId = ensureObjectId(candidateUserId) ? candidateUserId : "";
  
  const { data: walletSummary, refetch: refetchWallet } = useGetWalletSummaryQuery(dbUserId, {
    skip: !dbUserId,
  });

  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  useEffect(() => {
    loadRazorpay();
  }, []);

  const hasAccessForType = useCallback((astro, type) => {
    if (!dbUserId) return false;
    const freeMinutes = Number(walletSummary?.freeMinutesRemaining || 0);
    if (freeMinutes > 0) return true;
    const wallet = Number(walletSummary?.walletBalance || 0);
    const price = type === "video"
      ? Number(astro?.videoFee || astro?.perMinuteRate || 25)
      : type === "voice"
      ? Number(astro?.callFee || astro?.perMinuteRate || 20)
      : Number(astro?.chatFee || astro?.perMinuteRate || 15);
    return wallet >= price;
  }, [dbUserId, walletSummary]);

  const handleRecharge = async (amount) => {
    if (!dbUserId) return;
    const sdkLoaded = await loadRazorpay();
    if (!sdkLoaded) {
      alert("Unable to load payment gateway. Please try again.");
      return;
    }

    try {
      const orderResp = await createRechargeOrder({ userId: dbUserId, amount }).unwrap();
      const order = orderResp?.data;
      const rz = new window.Razorpay({
        key: order?.keyId,
        amount: Math.round(Number(amount) * 100),
        currency: order?.currency || "INR",
        name: "KalpJyotish",
        description: "Wallet Recharge",
        order_id: order?.orderId,
        prefill: {
          name: order?.user?.name || callerName,
          email: order?.user?.email || "",
          contact: order?.user?.contact || "",
        },
        handler: async (response) => {
          await verifyRechargePayment({
            userId: dbUserId,
            amount,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }).unwrap();
          await refetchWallet();
          setShowBuyCreditsModal(false);
          alert("Recharge successful! Your wallet has been updated.");
        },
      });
      rz.open();
    } catch (err) {
      alert(err?.data?.message || "Payment initialization failed");
    }
  };

  const handleChat = (astro) => {
    if (!hasAccessForType(astro, "chat")) {
      setShowBuyCreditsModal(true);
      return;
    }
    setChatAstro(astro);
  };

  const handleCall = (astro, type = "voice") => {
    if (!hasAccessForType(astro, type)) {
      setShowBuyCreditsModal(true);
      return;
    }
    setCallConfig({
      astrologer: astro,
      type: type,
      channelName: buildCallChannelName(type, astro?._id, dbUserId),
    });
  };

  const currentUserId = dbUserId;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="cosmic-loader">
          <div className="loader-ring"></div>
          <div className="loader-ring"></div>
          <div className="loader-ring"></div>
          <p>Summoning the stars...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="astrologer-list-container">
        <div className="hero-banner">
          <h1 className="astro-heading">
            <span className="heading-icon">🔮</span>
            Our Celestial Guides
            <span className="heading-icon">✨</span>
          </h1>
          <p className="heading-subtitle">
            Connect with India's most trusted astrologers for personalized guidance
          </p>
        </div>

        <div className="astro-grid">
          {astrologers.map((astro) => (
            <motion.div 
              key={astro._id} 
              className="astro-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -8 }}
              onClick={() => setSelectedAstro(astro)}
            >
              <div className="card-glow"></div>
              <div className="card-shine"></div>
              <div className="card-accent"></div>

              <div className="astro-header">
                <div className="img-wrapper">
                  <div className="img-ring"></div>
                  <img
                    className="astro-img"
                    src={
                      astro.user_profile ||
                      astro.profilePhoto ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(astro.name)}&background=6b21e5&color=ffd700&bold=true`
                    }
                    alt={astro.name}
                  />
                  {astro.availabilityStatus === 'online' && <div className="online-badge"></div>}
                </div>
                <h3 className="astro-name">{astro.name}</h3>
                <p className="astro-speciality">
                  <Icons.Experience />
                  {astro.experience || "10+"} Years • Vedic Expert
                </p>
              </div>

              <div className="astro-info-grid">
                <div className="info-item">
                  <Icons.Star />
                  <div>
                    <div className="info-value">{astro.averageRating || "4.8"}</div>
                    <div className="info-label">Rating</div>
                  </div>
                </div>
                <div className="info-item">
                  <Icons.Review />
                  <div>
                    <div className="info-value">{astro.totalReviews || "850"}</div>
                    <div className="info-label">Reviews</div>
                  </div>
                </div>
              </div>

              <div className="astro-footer">
                <div className="price-tag">
                  <span className="currency">₹</span>
                  <span className="amount">{astro.chatFee || "15"}</span>
                  <span className="per-min">/min</span>
                </div>

                <div className="astro-actions">
                  <button
                    className="action-btn chat-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChat(astro);
                    }}
                  >
                    <Icons.Chat />
                    <span>Chat</span>
                  </button>
                  <button
                    className="action-btn call-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCall(astro, "voice");
                    }}
                  >
                    <Icons.Call />
                    <span>Call</span>
                  </button>
                  <button
                    className="action-btn video-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCall(astro, "video");
                    }}
                  >
                    <Icons.Video />
                    <span>Video</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showBuyCreditsModal && (
          <BuyCreditsModal
            isOpen={showBuyCreditsModal}
            onClose={() => setShowBuyCreditsModal(false)}
            walletSummary={walletSummary}
            onRecharge={handleRecharge}
            loading={isCreatingOrder || isVerifyingPayment}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {chatAstro && (
          <RealtimeChatModal
            isOpen={Boolean(chatAstro)}
            onClose={() => setChatAstro(null)}
            astrologer={chatAstro}
            userId={currentUserId}
            onInsufficientBalance={() => setShowBuyCreditsModal(true)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {callConfig.astrologer && (
          <AgoraCallModal
            isOpen={Boolean(callConfig.astrologer)}
            onClose={() => setCallConfig({ astrologer: null, type: "voice", channelName: "" })}
            astrologer={callConfig.astrologer}
            userId={currentUserId}
            callerName={callerName}
            callType={callConfig.type}
            presetChannelName={callConfig.channelName}
            onInsufficientBalance={() => setShowBuyCreditsModal(true)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedAstro && (
          <AstrologerProfileModal
            astro={selectedAstro}
            onClose={() => setSelectedAstro(null)}
            onChat={handleChat}
            onCall={(astro) => handleCall(astro, "voice")}
            onVideoCall={(astro) => handleCall(astro, "video")}
          />
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
};

export default AstrologerList;