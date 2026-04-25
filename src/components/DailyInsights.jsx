// src/components/DailyInsights.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { appointmentData, zodiacSignsData } from '../data/insightsData';
import { FiStar, FiMoon, FiSun, FiCompass, FiCalendar, FiArrowRight, FiGlobe } from 'react-icons/fi';
import './DailyInsights.css';

const DailyInsights = () => {
  const [isHindi, setIsHindi] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, duration: 0.5 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="daily-insights-section">
      {/* Cosmic Background */}
      <div className="insights-bg">
        <div className="insights-nebula"></div>
        <div className="insights-stars">
          {[...Array(40)].map((_, i) => (
            <div key={i} className="star" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}></div>
          ))}
        </div>
      </div>

      {/* Services Section - Uncomment if you want to show services */}
      {/* <motion.section
        className="appointment-section"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        <div className="section-header">
          <div className="header-badge">
            <FiStar />
            <span>Our Services</span>
          </div>
          <h2 className="section-main-title">
            What We <span className="title-highlight">Offer</span>
          </h2>
          <p className="section-subtitle">
            Explore our comprehensive range of astrological services
          </p>
        </div>

        <motion.div 
          className="appointment-list"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {appointmentData.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              onHoverStart={() => setHoveredItem(`service-${index}`)}
              onHoverEnd={() => setHoveredItem(null)}
            >
              <Link to={item.link} className="service-item">
                <div className="card-glow"></div>
                <div className="icon-container">
                  <div className="icon-ring">
                    <div className="service-icon">{item.icon}</div>
                  </div>
                </div>
                <div className="title-wrapper">
                  <span>{item.title[0]}</span>
                  <span>{item.title[1]}</span>
                </div>
                <div className="service-hover-content">
                  <span>Learn More</span>
                  <FiArrowRight />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.section> */}

      {/* Zodiac Predictions Section */}
      <motion.section
        className="prediction-section"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="section-header">
          <div className="header-badge">
            <FiCalendar />
            <span>Daily Predictions</span>
          </div>
          <h2 className="section-main-title">
            Today's <span className="title-highlight">Astrology Prediction</span>
          </h2>
          <p className="section-subtitle">
            Discover what the stars have in store for you today based on your zodiac sign
          </p>
        </div>

        <motion.div 
          className="zodiac-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {zodiacSignsData.map((sign, index) => (
            <motion.div
              key={sign.name}
              variants={itemVariants}
              onHoverStart={() => setHoveredItem(`zodiac-${index}`)}
              onHoverEnd={() => setHoveredItem(null)}
            >
              <Link to={sign.link} className="zodiac-item">
                <div className="card-glow"></div>
                <div className="icon-container">
                  <div className="icon-ring zodiac-ring">
                    <div className="zodiac-icon">{sign.icon}</div>
                  </div>
                </div>
                <span className="zodiac-name">
                  {isHindi ? sign.hindiName : sign.name}
                </span>
                <div className="zodiac-hover-content">
                  <FiCompass />
                  <span>View Prediction</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.button
          className="translate-btn"
          onClick={() => setIsHindi(!isHindi)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiGlobe className="btn-icon" />
          <span>{isHindi ? "View in English" : "हिंदी में देखें"}</span>
        </motion.button>

        <div className="prediction-footer">
          <div className="footer-note">
            <FiMoon />
            <span>Get personalized daily horoscopes delivered to your inbox</span>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default DailyInsights;