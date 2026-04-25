// src/pages/DailyHoroscope.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './DailyHoroscope.css';
import { useLazyGetHoroscopeQuery } from '../services/backendApi';
import { 
  FiStar, 
  FiMoon, 
  FiSun, 
  FiCompass, 
  FiHeart,
  FiCalendar,
  FiClock,
  FiSmile,
  FiSunrise,
  FiZap,
  FiInfo
} from 'react-icons/fi';

// --- Data & Constants ---
const zodiacSigns = [
  { name: 'aries', icon: '♈', element: 'Fire', rulingPlanet: 'Mars', symbol: 'Ram' },
  { name: 'taurus', icon: '♉', element: 'Earth', rulingPlanet: 'Venus', symbol: 'Bull' },
  { name: 'gemini', icon: '♊', element: 'Air', rulingPlanet: 'Mercury', symbol: 'Twins' },
  { name: 'cancer', icon: '♋', element: 'Water', rulingPlanet: 'Moon', symbol: 'Crab' },
  { name: 'leo', icon: '♌', element: 'Fire', rulingPlanet: 'Sun', symbol: 'Lion' },
  { name: 'virgo', icon: '♍', element: 'Earth', rulingPlanet: 'Mercury', symbol: 'Virgin' },
  { name: 'libra', icon: '♎', element: 'Air', rulingPlanet: 'Venus', symbol: 'Scales' },
  { name: 'scorpio', icon: '♏', element: 'Water', rulingPlanet: 'Pluto', symbol: 'Scorpion' },
  { name: 'sagittarius', icon: '♐', element: 'Fire', rulingPlanet: 'Jupiter', symbol: 'Archer' },
  { name: 'capricorn', icon: '♑', element: 'Earth', rulingPlanet: 'Saturn', symbol: 'Goat' },
  { name: 'aquarius', icon: '♒', element: 'Air', rulingPlanet: 'Uranus', symbol: 'Water Bearer' },
  { name: 'pisces', icon: '♓', element: 'Water', rulingPlanet: 'Neptune', symbol: 'Fish' },
];

const LOCK_DURATION = 24 * 60 * 60 * 1000;
const USERS_STORAGE_KEY = 'horoscopeUsers';

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const buttonHoverTap = {
  hover: { scale: 1.05, transition: { type: 'spring', stiffness: 300 } },
  tap: { scale: 0.95 }
};

// --- Child Components ---
const HoroscopeCard = ({ sign, data, type, language }) => {
  const zodiac = zodiacSigns.find(z => z.name === sign);
  
  return (
    <motion.div 
      className="horoscope-result-card"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.95 }}
      transition={{ type: 'spring', duration: 0.6 }}
    >
      {/* Cosmic Border Effect */}
      <div className="cosmic-border">
        <div className="border-glow"></div>
      </div>

      {/* Zodiac Header */}
      <div className="zodiac-header">
        <div className="zodiac-icon-wrapper">
          <div className="zodiac-icon-ring"></div>
          <span className="zodiac-icon">{zodiac?.icon}</span>
        </div>
        <div className="zodiac-info">
          <h3 className="zodiac-name">
            {sign.charAt(0).toUpperCase() + sign.slice(1)}
            <span className="zodiac-symbol">{zodiac?.symbol}</span>
          </h3>
          <div className="zodiac-traits">
            <span className="trait">
              <FiZap />
              {zodiac?.element}
            </span>
            <span className="trait">
              <FiStar />
              {zodiac?.rulingPlanet}
            </span>
          </div>
        </div>
        <div className="horoscope-type-badge">
          <span>{type === 'daily' ? 'Daily Reading' : 'Weekly Forecast'}</span>
        </div>
      </div>

      {/* Prediction Text */}
      <div className="prediction-text">
        <div className="quote-icon">"</div>
        <p className="horoscope-desc">
          {language === 'en' ? data?.description : data?.description_hi || 'हिंदी विवरण उपलब्ध नहीं है'}
        </p>
      </div>

      {/* Details Grid */}
      <div className="horoscope-details">
        <motion.div className="detail-box" whileHover={{ scale: 1.05, y: -5 }}>
          <div className="detail-icon">🎯</div>
          <div className="detail-info">
            <span className="detail-label">{language === 'en' ? 'Lucky Number' : 'लकी नंबर'}</span>
            <strong className="detail-value">{data?.lucky_number}</strong>
          </div>
        </motion.div>

        <motion.div className="detail-box" whileHover={{ scale: 1.05, y: -5 }}>
          <div className="detail-icon">🌈</div>
          <div className="detail-info">
            <span className="detail-label">{language === 'en' ? 'Lucky Color' : 'लकी कलर'}</span>
            <strong className="detail-value" style={{ color: data?.color?.toLowerCase() }}>{data?.color}</strong>
          </div>
        </motion.div>

        <motion.div className="detail-box" whileHover={{ scale: 1.05, y: -5 }}>
          <div className="detail-icon">😌</div>
          <div className="detail-info">
            <span className="detail-label">{language === 'en' ? 'Mood' : 'मूड'}</span>
            <strong className="detail-value">{data?.mood}</strong>
          </div>
        </motion.div>

        <motion.div className="detail-box" whileHover={{ scale: 1.05, y: -5 }}>
          <div className="detail-icon">📅</div>
          <div className="detail-info">
            <span className="detail-label">{language === 'en' ? 'Date' : 'तारीख'}</span>
            <strong className="detail-value">{data?.date}</strong>
          </div>
        </motion.div>
      </div>

      {/* Compatibility Section */}
      <div className="compatibility-section">
        <h4>
          <FiHeart />
          {language === 'en' ? 'Today\'s Compatibility' : 'आज की अनुकूलता'}
        </h4>
        <div className="compatibility-tags">
          <span className="compat-tag">🦁 Leo</span>
          <span className="compat-tag">🏹 Sagittarius</span>
          <span className="compat-tag">⚖️ Libra</span>
        </div>
      </div>
    </motion.div>
  );
};

const LockPopup = ({ onClose, language }) => (
  <motion.div 
    className="popup-overlay" 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    exit={{ opacity: 0 }}
  >
    <motion.div 
      className="popup-content" 
      initial={{ scale: 0.7, opacity: 0 }} 
      animate={{ scale: 1, opacity: 1 }} 
      exit={{ scale: 0.7, opacity: 0 }} 
      transition={{ type: 'spring' }}
    >
      <div className="popup-icon">🔒</div>
      <h4>{language === 'en' ? 'Sign Locked' : 'राशि लॉक है'}</h4>
      <p>{language === 'en' ? 'You have already selected a sign for this name. Please try a different one after 24 hours.' : 'आप इस नाम के लिए पहले ही एक राशि चुन चुके हैं। कृपया 24 घंटे के बाद दूसरी राशि चुनें।'}</p>
      <motion.button onClick={onClose} {...buttonHoverTap}>
        {language === 'en' ? 'Okay' : 'ठीक है'}
      </motion.button>
    </motion.div>
  </motion.div>
);

const WelcomeMessage = ({ language }) => (
  <motion.div
    className="welcome-message"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
  >
    <div className="welcome-orb">
      <div className="orb-glow"></div>
      <div className="welcome-icon">✨🌙✨</div>
    </div>
    <h3>{language === 'en' ? 'Ready for Your Cosmic Reading?' : 'अपने ब्रह्मांडीय भविष्य के लिए तैयार हैं?'}</h3>
    <p>{language === 'en' ? 'Enter your name and select your zodiac sign to unlock the stars\' wisdom.' : 'शुरू करने के लिए कृपया अपना नाम दर्ज करें और एक राशि चुनें।'}</p>
    <div className="welcome-steps">
      <div className="step">
        <div className="step-number">1</div>
        <span>{language === 'en' ? 'Enter Name' : 'नाम दर्ज करें'}</span>
      </div>
      <div className="step">
        <div className="step-number">2</div>
        <span>{language === 'en' ? 'Select Sign' : 'राशि चुनें'}</span>
      </div>
      <div className="step">
        <div className="step-number">3</div>
        <span>{language === 'en' ? 'Get Reading' : 'राशिफल पाएं'}</span>
      </div>
    </div>
  </motion.div>
);

// --- Main Component ---
const DailyHoroscope = () => {
  const [name, setName] = useState('');
  const [sign, setSign] = useState('');
  const [type, setType] = useState('daily');
  const [data, setData] = useState(null);
  const [language, setLanguage] = useState('en');
  const [showLockPopup, setShowLockPopup] = useState(false);
  const [showNameError, setShowNameError] = useState(false);
  const [getHoroscope, { isFetching: loading }] = useLazyGetHoroscopeQuery();

  useEffect(() => {
    const fetchHoroscope = async () => {
      if (!name || !sign) {
        setData(null);
        return;
      }

      try {
        const result = await getHoroscope({ sign, type }).unwrap();
        setData(result);
      } catch (err) {
        console.error('Failed to fetch horoscope:', err);
        setData(null);
      }
    };

    fetchHoroscope();
  }, [name, sign, type, getHoroscope]);

  useEffect(() => {
    if (!name) return;
    const normalizedName = name.trim().toLowerCase();
    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY)) || {};
    const userData = users[normalizedName];

    if (userData && new Date().getTime() - userData.timestamp < LOCK_DURATION) {
      setSign(userData.sign);
      setShowNameError(false);
    } else {
      setSign('');
    }
  }, [name]);

  const handleSignChange = (newSign) => {
    if (!name.trim()) {
      setShowNameError(true);
      setTimeout(() => setShowNameError(false), 3000);
      return;
    }

    const normalizedName = name.trim().toLowerCase();
    const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY)) || {};
    const userData = users[normalizedName];
    const now = new Date().getTime();

    if (userData && now - userData.timestamp < LOCK_DURATION && userData.sign !== newSign) {
      setShowLockPopup(true);
    } else {
      setSign(newSign);
      users[normalizedName] = { sign: newSign, timestamp: now };
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      setShowNameError(false);
    }
  };

  return (
    <div className="daily-horoscope-page">
      {/* Cosmic Background */}
      <div className="cosmic-bg">
        <div className="nebula nebula-1"></div>
        <div className="nebula nebula-2"></div>
        <div className="nebula nebula-3"></div>
        <div className="stars">
          {[...Array(100)].map((_, i) => (
            <div key={i} className="star" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}></div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showLockPopup && <LockPopup onClose={() => setShowLockPopup(false)} language={language} />}
      </AnimatePresence>

      <motion.div className="input-section" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div className="section-badge" variants={itemVariants}>
          <FiStar />
          <span>Vedic Astrology</span>
        </motion.div>

        <motion.h2 variants={itemVariants}>
          {language === 'en' ? 'Discover Your Cosmic Path' : 'अपना ब्रह्मांडीय मार्ग खोजें'}
        </motion.h2>

        <motion.p className="section-subtitle" variants={itemVariants}>
          {language === 'en' 
            ? 'Unlock the secrets of the stars with personalized daily and weekly horoscopes' 
            : 'व्यक्तिगत दैनिक और साप्ताहिक राशिफल के साथ सितारों के रहस्यों को जानें'}
        </motion.p>

        <motion.div className="name-input-wrapper" variants={itemVariants}>
          <div className="input-icon">
            <FiCompass />
          </div>
          <input
            type="text"
            placeholder={language === 'en' ? 'Enter your name to begin...' : 'शुरू करने के लिए नाम दर्ज करें...'}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={showNameError ? 'error' : ''}
          />
          <AnimatePresence>
            {showNameError && (
              <motion.div 
                className="name-error-tooltip"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <FiInfo />
                <span>{language === 'en' ? 'Please enter your name first' : 'कृपया पहले अपना नाम दर्ज करें'}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div className="selectors" variants={itemVariants}>
          <div className="sign-select-wrapper">
            <div className="select-icon">♈</div>
            <select value={sign} onChange={(e) => handleSignChange(e.target.value)}>
              <option value="" disabled>
                {language === 'en' ? '✨ Select Your Zodiac Sign ✨' : '✨ अपनी राशि चुनें ✨'}
              </option>
              {zodiacSigns.map((z) => (
                <option key={z.name} value={z.name}>
                  {z.icon} {z.name.charAt(0).toUpperCase() + z.name.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="type-toggle">
            <motion.button 
              className={type === 'daily' ? 'active' : ''} 
              onClick={() => setType('daily')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiSun />
              <span>Daily</span>
            </motion.button>
            <motion.button 
              className={type === 'weekly' ? 'active' : ''} 
              onClick={() => setType('weekly')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiCalendar />
              <span>Weekly</span>
            </motion.button>
          </div>

          <motion.button 
            className="lang-toggle"
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="lang-switch">
              <span className={language === 'en' ? 'active' : ''}>EN</span>
              <span className={language === 'hi' ? 'active' : ''}>हिं</span>
            </div>
          </motion.button>
        </motion.div>
      </motion.div>

      <div className="horoscope-results-container">
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div 
              className="spinner-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="cosmic-spinner">
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
                <p>{language === 'en' ? 'Reading the stars...' : 'सितारे पढ़ रहे हैं...'}</p>
              </div>
            </motion.div>
          )}
          
          {!loading && data && (
            <HoroscopeCard 
              key={sign + type + language} 
              sign={sign} 
              data={data} 
              type={type} 
              language={language} 
            />
          )}
          
          {!loading && !data && !loading && (
            <WelcomeMessage language={language} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DailyHoroscope;