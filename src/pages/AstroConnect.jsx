import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { FaCommentDots, FaPhoneAlt, FaVideo, FaStar } from 'react-icons/fa'; // Corrected Icon import
import './AstroConnect.css';

const API_URL = 'https://kalpjyotish.com/api/api/astrologer/all';
const FALLBACK_IMAGE = 'https://i.imgur.com/G4G987O.png';

// ====================================================================
// --- Astrologer Card Component ---
// ====================================================================
const AstrologerCard = ({ astrologer }) => {
  // Data Normalization
  const profileImg = astrologer.user_profile || astrologer.profilePhoto || FALLBACK_IMAGE;
  const skills = astrologer.all_skills || astrologer.skills || [];
  const experience = parseInt(astrologer.experience) || 0;
  const charge = astrologer.charge_per_minute || 0;
  const isLive = astrologer.status === 'live';
  
  const modeDetails = {
    chat: { icon: <FaCommentDots />, text: 'Chat Now' },
  };

  return (
    <div className="astrologer-card">
      <div className="card-content">
        <div className="card-header">
          <div className="profile-picture-container">
            <img 
              src={profileImg} 
              alt={astrologer.name} 
              className="profile-picture" 
              onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }} 
            />
            <div className={`status-dot ${isLive ? 'live' : 'offline'}`} title={isLive ? 'Live' : 'Offline'}></div>
          </div>
        </div>
        <div className="card-body">
          <h3 className="astrologer-name">{astrologer.name || 'Astrologer'}</h3>
          <div className="astrologer-skills">
            {skills.slice(0, 3).map((skill, index) => <span key={index} className="skill-tag">{skill}</span>)}
          </div>
          <div className="astrologer-meta">
            <span>Exp: {experience} years</span>
            <span><FaStar /> 4.9</span>
          </div>
          <div className="astrologer-charges">₹{charge}<span>/min</span></div>
        </div>
        <div className="card-footer">
          <button className={`action-button ${isLive ? 'enabled' : 'disabled'}`} disabled={!isLive}>
            {modeDetails.chat.icon}
            <span>{isLive ? modeDetails.chat.text : 'Offline'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ====================================================================
// --- Main AstroConnect Component ---
// ====================================================================
const AstroConnect = () => {
  const [astrologers, setAstrologers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('status');

  useEffect(() => {
    const fetchAstrologers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_URL);
        
        // The astrologers are inside the 'data' property of the response
        const astrologerData = response?.data?.data;

        if (Array.isArray(astrologerData)) {
          // --- NO FILTERING: Display all astrologers from the API ---
          setAstrologers(astrologerData);
        } else {
          setError('API did not return a valid list of astrologers.');
        }
      } catch (err) {
        console.error("Error fetching astrologers:", err);
        setError('Failed to fetch astrologers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchAstrologers();
  }, []);

  // Sorting logic
  const sortedAstrologers = useMemo(() => {
    const sortableArray = [...astrologers];
    switch (sortBy) {
      case 'exp':
        return sortableArray.sort((a, b) => (parseInt(b.experience) || 0) - (parseInt(a.experience) || 0));
      case 'price_htl':
        return sortableArray.sort((a, b) => (b.charge_per_minute || 0) - (a.charge_per_minute || 0));
      case 'price_lth':
        return sortableArray.sort((a, b) => (a.charge_per_minute || 0) - (b.charge_per_minute || 0));
      case 'status':
      default:
        return sortableArray.sort((a, b) => (b.status === 'live' ? 1 : 0) - (a.status === 'live' ? 1 : 0));
    }
  }, [astrologers, sortBy]);
  
  const sortOptions = [
    { key: 'status', label: 'Availability' },
    { key: 'exp', label: 'Experience' },
    { key: 'price_htl', label: 'Price: High to Low' },
    { key: 'price_lth', label: 'Price: Low to High' },
  ];

  const renderContent = () => {
    if (loading) {
      return <div className="full-width info-message">Loading Astrologers...</div>;
    }
    if (error) {
      return <div className="full-width error-message">{error}</div>;
    }
    if (sortedAstrologers.length > 0) {
      return sortedAstrologers.map((astrologer) => (
        <AstrologerCard key={astrologer._id} astrologer={astrologer} />
      ));
    }
    return <div className="full-width info-message">No astrologers are available at this time.</div>;
  };

  return (
    <div className="astro-connect-container">
      <div className="controls-and-list">
        <div className="sort-controls">
            <span> Sort By:</span>
            {sortOptions.map(opt => (
                <button 
                  key={opt.key} 
                  className={`sort-btn ${sortBy === opt.key ? 'active' : ''}`} 
                  onClick={() => setSortBy(opt.key)}
                >
                  {opt.label}
                </button>
            ))}
        </div>
        <div className="astrologer-grid">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AstroConnect;