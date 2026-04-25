// src/pages/Profile.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, Link } from 'react-router-dom';
// Alternative icons that definitely exist in react-icons/fi

import { IoClose } from "react-icons/io5";
import "./Profile.css"; 
import { useGetAstrologerByIdQuery } from "../services/backendApi";

// ====================================================================
// --- AUTH HOOK ---
// ====================================================================

const IS_LOGGED_IN = false; 

const useAuth = () => ({
  isAuthenticated: IS_LOGGED_IN,
  user: IS_LOGGED_IN 
    ? { 
        id: 'user_abc123', 
        name: 'Sample User', 
        walletBalance: 500,
        email: 'user@example.com'
      } 
    : null,
});

// ====================================================================
// --- MODAL COMPONENTS ---
// ====================================================================

const PaymentModal = ({ onClose, astrologer, user }) => {
  const cost = astrologer.charge_per_minute || 25;
  const balance = user?.walletBalance || 0;
  const hasSufficientFunds = balance >= cost;
  const remainingBalance = balance - cost;

  return (
    <motion.div 
      className="modal-content payment-modal"
      initial={{ scale: 0.9, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: 50 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
    >
      <button onClick={onClose} className="modal-close-btn">
        <IoClose />
      </button>
      
      <div className="modal-icon payment-icon">
        <FiDollarSign />
      </div>
      
      <h2 className="modal-title">Confirm Connection</h2>
      <p className="modal-subtitle">You are about to connect with</p>
      <div className="astrologer-name-modal">{astrologer.name}</div>
      
      <div className="wallet-details">
        <div className="detail-row">
          <span className="detail-label">Call Cost (per minute)</span>
          <span className="detail-value cost">₹{cost}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Your Wallet Balance</span>
          <span className="detail-value">₹{balance}</span>
        </div>
      </div>
      
      {hasSufficientFunds ? (
        <div className="balance-info sufficient">
          <FiCheckCircle />
          <p>₹{cost} will be deducted. Your new balance will be <strong>₹{remainingBalance}</strong>.</p>
        </div>
      ) : (
        <div className="balance-info insufficient">
          <FiXCircle />
          <p>Your wallet balance is too low. Please add funds to connect.</p>
        </div>
      )}
      
      <div className="modal-actions">
        {hasSufficientFunds ? (
          <button className="connect-confirm-btn">
            <FiCreditCard /> Pay from Wallet & Connect
          </button>
        ) : (
          <button className="add-funds-btn">
            <FiDollarSign /> Add Money to Wallet
          </button>
        )}
      </div>
    </motion.div>
  );
};

const SignupModal = ({ onClose }) => (
  <motion.div
    className="modal-content signup-modal"
    initial={{ scale: 0.9, opacity: 0, y: 50 }}
    animate={{ scale: 1, opacity: 1, y: 0 }}
    exit={{ scale: 0.9, opacity: 0, y: 50 }}
    transition={{ type: "spring", damping: 25, stiffness: 300 }}
  >
    <button onClick={onClose} className="modal-close-btn">
      <IoClose />
    </button>
    
    <div className="modal-icon login-icon">
      <FiUser />
    </div>
    
    <h2 className="modal-title">Login Required</h2>
    <p className="modal-subtitle">Please log in or create an account to connect with an astrologer</p>
    
    <div className="modal-actions">
      <Link to="/login" className="login-modal-btn">Login</Link>
      <Link to="/signup" className="signup-modal-btn">Create Account</Link>
    </div>
    
    <div className="modal-footer-note">
      <FiInfo />
      <span>Secure authentication powered by Firebase</span>
    </div>
  </motion.div>
);

// ====================================================================
// --- MAIN PROFILE COMPONENT ---
// ====================================================================

const Profile = () => {
  const { userId } = useParams();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("call");
  
  const { isAuthenticated, user } = useAuth();
  const {
    data: profileData,
    isLoading: loading,
    isError,
  } = useGetAstrologerByIdQuery(userId, { skip: !userId });

  const handleConnectClick = (serviceType) => {
    setSelectedService(serviceType);
    if (isAuthenticated) {
      setIsPaymentModalOpen(true);
    } else {
      setIsSignupModalOpen(true);
    }
  };
  
  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-loader">
          <div className="loader-ring"></div>
          <div className="loader-ring"></div>
          <div className="loader-ring"></div>
          <p>Loading astrologer profile...</p>
        </div>
      </div>
    );
  }
  
  if (!userId || isError || !profileData) {
    return (
      <div className="profile-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Profile Not Found</h3>
          <p>Could not load astrologer profile. Please try again later.</p>
          <Link to="/astro-connect" className="back-btn">Back to Astrologers</Link>
        </div>
      </div>
    );
  }
  
  const isLive = profileData.status === 'live';
  const reviewCount = profileData.reviews?.length || 128;
  const averageRating = profileData.averageRating || 4.8;

  return (
    <>
      <div className="profile-container">
        {/* Cosmic Background */}
        <div className="profile-cosmic-bg">
          <div className="profile-star"></div>
          <div className="profile-star"></div>
          <div className="profile-star"></div>
          <div className="profile-star"></div>
        </div>

        <div className="profile-card">
          {/* Live Badge */}
          {isLive && <div className="live-badge">● LIVE NOW</div>}
          
          {/* Header Section */}
          <div className="profile-header">
            <div className="profile-image-wrapper">
              <div className="profile-image-ring"></div>
              <img 
                src={profileData.user_profile || profileData.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name)}&background=ffd700&color=1a0a2e&bold=true`}
                alt={profileData.name}
                className="profile-image" 
              />
              {isLive && <div className="live-indicator"></div>}
            </div>
            
            <h1 className="profile-name">{profileData.name}</h1>
            
            <div className="profile-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className={`star ${i < Math.floor(averageRating) ? 'filled' : ''}`} />
                ))}
              </div>
              <span className="rating-value">{averageRating}</span>
              <span className="review-count">({reviewCount} reviews)</span>
            </div>
            
            <div className="profile-badges">
              {profileData.all_skills?.slice(0, 3).map((skill, index) => (
                <span key={index} className="skill-badge">{skill}</span>
              ))}
            </div>
          </div>
          
          {/* About Section */}
          <div className="profile-about">
            <h3>About</h3>
            <p>{profileData.about || "Expert in Vedic astrology with years of experience helping people find clarity and direction in their lives."}</p>
          </div>
          
          {/* Details Grid */}
          <div className="profile-details-grid">
            <div className="detail-card">
              <FiAward className="detail-icon" />
              <div>
                <span className="detail-label">Experience</span>
                <strong>{profileData.experience || '10+'} Years</strong>
              </div>
            </div>
            <div className="detail-card">
              <FiUsers className="detail-icon" />
              <div>
                <span className="detail-label">Clients Served</span>
                <strong>{profileData.clientsServed || '5,000+'}</strong>
              </div>
            </div>
            <div className="detail-card">
              <FiGlobe className="detail-icon" />
              <div>
                <span className="detail-label">Languages</span>
                <strong>{profileData.language?.join(', ') || 'English, Hindi'}</strong>
              </div>
            </div>
            <div className="detail-card">
              <FiClock className="detail-icon" />
              <div>
                <span className="detail-label">Response Time</span>
                <strong>&lt; 24 hrs</strong>
              </div>
            </div>
          </div>
          
          {/* Expertise Section */}
          {profileData.all_skills && profileData.all_skills.length > 3 && (
            <div className="profile-expertise">
              <h3>Areas of Expertise</h3>
              <div className="expertise-tags">
                {profileData.all_skills.map((skill, index) => (
                  <span key={index} className="expertise-tag">{skill}</span>
                ))}
              </div>
            </div>
          )}
          
          {/* Service Options */}
          <div className="service-options">
            <h3>Consultation Options</h3>
            <div className="service-buttons">
              <button 
                className={`service-btn chat ${selectedService === 'chat' ? 'active' : ''}`}
                onClick={() => handleConnectClick('chat')}
                disabled={!isLive}
              >
                <FiMessageCircle />
                <div>
                  <span className="service-name">Chat</span>
                  <span className="service-price">₹{profileData.chatFee || 15}/min</span>
                </div>
              </button>
              <button 
                className={`service-btn call ${selectedService === 'call' ? 'active' : ''}`}
                onClick={() => handleConnectClick('call')}
                disabled={!isLive}
              >
                <FiPhone />
                <div>
                  <span className="service-name">Audio Call</span>
                  <span className="service-price">₹{profileData.callFee || 20}/min</span>
                </div>
              </button>
              <button 
                className={`service-btn video ${selectedService === 'video' ? 'active' : ''}`}
                onClick={() => handleConnectClick('video')}
                disabled={!isLive}
              >
                <FiVideo />
                <div>
                  <span className="service-name">Video Call</span>
                  <span className="service-price">₹{profileData.videoFee || 25}/min</span>
                </div>
              </button>
            </div>
          </div>
          
          {/* Wallet Display (if authenticated) */}
          {isAuthenticated && (
            <div className="wallet-display">
              <FiCreditCard className="wallet-icon" />
              <div>
                <span>Wallet Balance</span>
                <strong>₹{user.walletBalance}</strong>
              </div>
              <button className="add-wallet-btn">+ Add Funds</button>
            </div>
          )}
          
          {/* Connect Button */}
          <button 
            className={`connect-btn ${isLive ? 'live' : 'offline'}`}
            onClick={() => handleConnectClick(selectedService)}
            disabled={!isLive}
          >
            {isLive ? (
              <>
                <FiArrowRight />
                <span>Connect Now</span>
              </>
            ) : (
              <>
                <FiXCircle />
                <span>Currently Offline</span>
              </>
            )}
          </button>
          
          {/* Availability Note */}
          <div className="availability-note">
            <FiCalendar />
            <span>Available for consultations: Mon - Sat, 9 AM - 8 PM IST</span>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isPaymentModalOpen && (
          <motion.div 
            className="modal-overlay" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setIsPaymentModalOpen(false)}
          >
            <PaymentModal 
              onClose={() => setIsPaymentModalOpen(false)} 
              astrologer={profileData}
              user={user} 
            />
          </motion.div>
        )}
        {isSignupModalOpen && (
          <motion.div 
            className="modal-overlay" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setIsSignupModalOpen(false)}
          >
            <SignupModal onClose={() => setIsSignupModalOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Profile;