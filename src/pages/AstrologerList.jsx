import React, { useEffect, useState } from "react";
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

const buildCallChannelName = (callType, astrologerId, userId) => {
  const safeType = String(callType || "voice").replace(/[^a-zA-Z0-9_]/g, "").slice(0, 8);
  const safeAstro = String(astrologerId || "").replace(/[^a-zA-Z0-9]/g, "").slice(-8);
  const safeUser = String(userId || "").replace(/[^a-zA-Z0-9]/g, "").slice(-8);
  const ts = Date.now().toString(36).slice(-8);
  return `${safeType}_${safeAstro}_${safeUser}_${ts}`.slice(0, 64);
};

/* =====================================================
   PAYMENT MODAL
===================================================== */
const PaymentGatewayModal = ({ onClose, amount }) => {
  const [paymentState, setPaymentState] = useState("idle");

  const handlePayment = () => {
    setPaymentState("processing");

    setTimeout(() => {
      setPaymentState("success");
      setTimeout(onClose, 1500);
    }, 1500);
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}>
          ✖
        </button>

        {paymentState === "idle" && (
          <>
            <h2 className="modal-title">Secure Payment</h2>
            <p className="payment-amount-display">₹{amount}</p>
            <button className="connect-button" onClick={handlePayment}>
              Pay Now
            </button>
          </>
        )}

        {paymentState === "processing" && <p>Processing...</p>}
        {paymentState === "success" && <p>Payment Successful ✅</p>}
      </motion.div>
    </motion.div>
  );
};

const BuyCreditsModal = ({ isOpen, onClose, walletSummary, onRecharge, loading }) => {
  const [selectedAmount, setSelectedAmount] = useState(199);
  const options = [99, 199, 499, 999];

  if (!isOpen) return null;

  return (
    <motion.div className="rt-chat-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="rt-chat-modal" initial={{ scale: 0.92 }} animate={{ scale: 1 }} exit={{ scale: 0.92 }} onClick={(e) => e.stopPropagation()}>
        <div className="rt-chat-header">
          <div>
            <strong>Buy Credits</strong>
            <p>Recharge wallet to continue</p>
          </div>
          <button className="rt-chat-close" onClick={onClose}>X</button>
        </div>
        <div style={{ padding: 14, color: "#f8fafc" }}>
          <p style={{ margin: "0 0 8px" }}>Wallet: ₹{Number(walletSummary?.walletBalance || 0).toFixed(2)}</p>
          <p style={{ margin: "0 0 10px" }}>Free minutes: {Number(walletSummary?.freeMinutesRemaining || 0).toFixed(2)}</p>
          <div style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr 1fr" }}>
            {options.map((amount) => (
              <button
                key={amount}
                className="call-btn"
                style={selectedAmount === amount ? { background: "#facc15", color: "#1e1b4b" } : undefined}
                onClick={() => setSelectedAmount(amount)}
              >
                ₹{amount}
              </button>
            ))}
          </div>
          <button className="chat-btn" style={{ width: "100%", marginTop: 12 }} disabled={loading} onClick={() => onRecharge(selectedAmount)}>
            {loading ? "Processing..." : `Pay ₹${selectedAmount}`}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* =====================================================
   CHAT POPUP  (FIXED VERSION)
===================================================== */

const ChatPopup = ({ astro, onClose }) => {
  const [messages, setMessages] = useState([
    { from: "astro", text: "Namaste 🙏 How can I help you today?" },
  ]);

  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { from: "user", text: input }]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "astro", text: "Sure, I will guide you 😊" },
      ]);
    }, 700);
  };

  return (
    <motion.div
      className="chat-popup"
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 80 }}
      transition={{ duration: 0.25 }}
    >
      <div className="chat-header">
        <span>{astro?.name}</span>
        <button onClick={onClose}>✖</button>
      </div>

      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.from}`}>
            {m.text}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </motion.div>
  );
};

/* =====================================================
   ASTROLOGER PROFILE MODAL
===================================================== */
const AstrologerProfileModal = ({ astro, onClose }) => {
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
        {/* Decorative Elements */}
        <div className="modal-glow-orb modal-glow-1"></div>
        <div className="modal-glow-orb modal-glow-2"></div>
        <div className="modal-stars">✦</div>
        <div className="modal-stars modal-star-2">✧</div>
        <div className="modal-stars modal-star-3">✦</div>

        {/* Close Button */}
        <button className="astro-modal-close-btn" onClick={onClose}>
          <span>✕</span>
        </button>

        {/* Header with Profile */}
        <div className="profile-header">
          <div className="profile-img-container">
            <div className="profile-ring"></div>
            <div className="profile-ring profile-ring-2"></div>
            <img
              className="profile-img"
              src={
                astro.profilePhoto ||
                astro.user_profile ||
                "https://ui-avatars.com/api/?name=" + astro.name
              }
              alt={astro.name}
            />
            <div className="online-indicator"></div>
          </div>

          <h2 className="profile-name">{astro.name}</h2>
          <p className="profile-experience">
            <span className="exp-icon">🏆</span>
            {astro.experience || "10+ Years Experience"}
          </p>

          <div className="profile-rating">
            <span className="stars">⭐⭐⭐⭐⭐</span>
            <span className="rating-text">{astro.averageRating || "4.9"} ({astro.totalReviews || "850"} reviews)</span>
          </div>

          <span className={`status-badge ${astro.availabilityStatus || 'online'}`}>
            <span className="status-dot"></span>
            {/* {astro.availabilityStatus === "online"} */}
            {<p>
  {astro.availabilityStatus === "online"
    ? "🟢 Online"
    : "🔴 Offline"}
</p>}
          </span>
        </div>

        {/* Content Grid */}
        <div className="profile-content">
          {/* Skills Section */}
          <div className="profile-section">
            <div className="section-header">
              <span className="section-icon">🔮</span>
              <h4>Expertise</h4>
            </div>
            <div className="tag-list">
              {(astro.skills || ["Vedic Astrology", "Tarot Reading", "Numerology", "Palmistry", "Vastu"])?.map((s, i) => (
                <span key={i} className="skill-tag">
                  <span className="tag-shine"></span>
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Languages Section */}
          <div className="profile-section">
            <div className="section-header">
              <span className="section-icon">🗣️</span>
              <h4>Languages</h4>
            </div>
            <div className="languages-grid">
              {(astro.languages || astro.language || ["English", "Hindi", "Sanskrit"])?.map((lang, i) => (
                <div key={i} className="language-item">
                  <span className="lang-bullet">●</span>
                  {lang}
                </div>
              ))}
            </div>
          </div>

          {/* Availability Section */}
          <div className="profile-section">
            <div className="section-header">
              <span className="section-icon">📅</span>
              <h4>Services Available</h4>
            </div>
            <div className="availability-grid">
              <div className={`availability-item ${astro.availability?.chat !== false ? 'available' : 'unavailable'}`}>
                <span className="avail-icon">💬</span>
                <div>
                  <div className="avail-title">Chat</div>
                  <div className="avail-price">₹{astro.chatFee || "15"}/min</div>
                </div>
                <span className="avail-status">{astro.availability?.chat !== false ? '✓' : '✕'}</span>
              </div>

              <div className={`availability-item ${astro.availability?.call !== false ? 'available' : 'unavailable'}`}>
                <span className="avail-icon">📞</span>
                <div>
                  <div className="avail-title">Call</div>
                  <div className="avail-price">₹{astro.callFee || "20"}/min</div>
                </div>
                <span className="avail-status">{astro.availability?.call !== false ? '✓' : '✕'}</span>
              </div>

              <div className={`availability-item ${astro.availability?.videoCall !== false ? 'available' : 'unavailable'}`}>
                <span className="avail-icon">📹</span>
                <div>
                  <div className="avail-title">Video Call</div>
                  <div className="avail-price">₹{astro.videoFee || "25"}/min</div>
                </div>
                <span className="avail-status">{astro.availability?.videoCall !== false ? '✓' : '✕'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="profile-footer">
          <button className="modal-chat-btn">
            <span className="btn-glow"></span>
            <span className="btn-icon">💬</span>
            <span>Start Chat</span>
          </button>
          <button className="modal-call-btn">
            <span className="btn-glow"></span>
            <span className="btn-icon">📞</span>
            <span>Call Now</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};


/* =====================================================
   MAIN PAGE
===================================================== */
const AstrologerList = () => {
  const ensureObjectId = (value) => /^[a-fA-F0-9]{24}$/.test(String(value || ""));
  const generatePseudoObjectId = () => {
    const hex = "abcdef0123456789";
    let out = "";
    for (let i = 0; i < 24; i += 1) {
      out += hex[Math.floor(Math.random() * hex.length)];
    }
    return out;
  };

  const [selectedAstro, setSelectedAstro] = useState(null);

  const [showBuyCreditsModal, setShowBuyCreditsModal] = useState(false);

  /* ✅ FIXED — THIS WAS MISSING */
  const [chatAstro, setChatAstro] = useState(null);
  const [callConfig, setCallConfig] = useState({ astrologer: null, type: "voice", channelName: "" });

  const { data: astrologers = [], isLoading: loading } = useGetAstrologersQuery();

  // console.log(response);

  const [createRechargeOrder, { isLoading: isCreatingOrder }] = useCreateRechargeOrderMutation();
  const [verifyRechargePayment, { isLoading: isVerifyingPayment }] = useVerifyRechargePaymentMutation();
  // const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  let storedUser = {};
try {
  const data = localStorage.getItem("user");
  storedUser = data && data !== "undefined" ? JSON.parse(data) : {};
} catch {
  storedUser = {};
}
  
  const callerName = storedUser?.name || "Guest User";
  const candidateUserId =
    storedUser?._id ||
    storedUser?.id ||
    storedUser?.user?._id ||
    storedUser?.user?.id ||
    localStorage.getItem("userId") ||
    localStorage.getItem("backendUserId") ||
    "";
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

  const openRechargePopup = () => {
    if (!dbUserId) {
      alert("Please login first to use chat or call.");
      return;
    }
    setShowBuyCreditsModal(true);
  };

  const hasAccessForType = (astro, type) => {
    if (!dbUserId) return false;
    const freeMinutes = Number(walletSummary?.freeMinutesRemaining || 0);
    if (freeMinutes > 0) return true;
    const wallet = Number(walletSummary?.walletBalance || 0);
    const price =
      type === "video"
        ? Number(astro?.videoFee || astro?.perMinuteRate || 20)
        : type === "voice"
        ? Number(astro?.callFee || astro?.perMinuteRate || 15)
        : Number(astro?.chatFee || astro?.perMinuteRate || 10);
    return wallet >= price;
  };

  const handleRecharge = async (amount) => {
    if (!dbUserId) return;
    const sdkLoaded = await loadRazorpay();
    if (!sdkLoaded) {
      alert("Unable to load Razorpay SDK. Please try again.");
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
          alert("Recharge successful");
        },
      });
      rz.open();
    } catch (err) {
      alert(err?.data?.message || "Payment initialization failed");
    }
  };
  const currentUserId = dbUserId;


  if (loading) return <div className="loading-text">Loading...</div>;

  return (
    <>
      <div className="astrologer-list-container">
        <h1 className="astro-heading">Our Astrologers</h1>
        <div className="astro-grid">
          {astrologers.map((astro) => (
            <div key={astro._id} className="astro-card" onClick={() => setSelectedAstro(astro)} >
              <div className="card-glow"></div>
              <div className="card-shine"></div>

              {/* Top accent line */}
              <div className="card-accent"></div>

              {/* Profile Section */}
              <div className="astro-header">
                <div className="img-wrapper">
                  <div className="img-ring"></div>
                  <img
                    className="astro-img"
                    src={
                      astro.user_profile ||
                      astro.profilePhoto ||
                      "https://ui-avatars.com/api/?name=" + astro.name
                    }
                    alt={astro.name}
                    onError={(e) => {
                      e.target.src =
                        "https://ui-avatars.com/api/?name=" + astro.name;
                    }}
                  />

                </div>
                <h3 className="astro-name">{astro.name}</h3>
                <p className="astro-speciality">Vedic Astrology • Tarot</p>
              </div>

              {/* Info Grid */}
              <div className="astro-info-grid">
                <div className="info-item">
                  <span className="info-icon">⭐</span>
                  <div>
                    <div className="info-value">{astro.averageRating || "4.8"}</div>
                    <div className="info-label">Rating</div>
                  </div>
                </div>
                <div className="info-item">
                  <span className="info-icon">💬</span>
                  <div>
                    <div className="info-value">{astro.totalReviews || "850"}</div>
                    <div className="info-label">Reviews</div>
                  </div>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="astro-footer">
                <div className="price-tag">
                  <span className="currency">₹</span>
                  <span className="amount">{astro.chatFee || "15"}</span>
                  <span className="per-min">/min</span>
                </div>

                <div className="astro-actions">
                  <button
                    className="chat-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!hasAccessForType(astro, "chat")) {
                        openRechargePopup();
                        return;
                      }
                      setChatAstro(astro);
                    }}
                  >
                    <span className="btn-icon">💬</span>
                    CHAT
                  </button>
                  <button
                    className="call-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!hasAccessForType(astro, "voice")) {
                        openRechargePopup();
                        return;
                      }
                      setCallConfig({
                        astrologer: astro,
                        type: "voice",
                        channelName: buildCallChannelName("voice", astro?._id, currentUserId),
                      });
                    }}
                  >
                    <span className="btn-icon">📞</span>
                    CALL
                  </button>
                  <button
                    className="call-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!hasAccessForType(astro, "video")) {
                        openRechargePopup();
                        return;
                      }
                      setCallConfig({
                        astrologer: astro,
                        type: "video",
                        channelName: buildCallChannelName("video", astro?._id, currentUserId),
                      });
                    }}
                  >
                    <span className="btn-icon">📹</span>
                    VIDEO
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODALS */}
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



      {/* CHAT POPUP */}
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
      <Footer />

      {/* profile popup */}
      <AnimatePresence>
        {selectedAstro && (
          <AstrologerProfileModal
            astro={selectedAstro}
            onClose={() => setSelectedAstro(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default AstrologerList;



