// src/components/NakshatrasSection.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { nakshatrasData } from '../data/nakshatrasFlippingData.jsx';
import { FiStar, FiMoon, FiSun, FiCompass, FiInfo } from 'react-icons/fi';
import './NakshatrasSection.css';

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { duration: 0.8, staggerChildren: 0.05 } 
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0, scale: 0.9 },
  visible: { 
    y: 0, 
    opacity: 1, 
    scale: 1,
    transition: { type: 'spring', stiffness: 120, damping: 15 } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    transition: { duration: 0.2 } 
  },
};

const NakshatrasSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const sectionRef = useRef(null);

  const initialItemCount = isDesktop ? 12 : 6;

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const displayedItems = isExpanded
    ? nakshatrasData
    : nakshatrasData.slice(0, initialItemCount);

  const shouldShowButton = nakshatrasData.length > initialItemCount;

  return (
    <motion.section
      className="nakshatras-section"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      ref={sectionRef}
    >
      {/* Cosmic Background */}
      <div className="nakshatras-bg">
        <div className="nakshatras-nebula"></div>
        <div className="nakshatras-stars">
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

      <div className="nakshatras-container">
        <div className="nakshatras-header">
          <div className="header-badge">
            <FiStar />
            <span>Vedic Astrology</span>
          </div>
          <h2 className="nakshatras-title">
            The 27 <span className="title-highlight">Nakshatras</span>
          </h2>
          <p className="nakshatras-subtitle">
            Vedic Astrology is deeply rooted in the wisdom of Nakshatras. 
            Our ancient sages have written detailed treatises on these lunar mansions 
            that hold the keys to your cosmic destiny.
          </p>
        </div>

        <motion.div layout className="nakshatras-grid">
          <AnimatePresence mode="popLayout">
            {displayedItems.map((nakshatra, index) => (
              <motion.div
                key={nakshatra.name}
                className="nakshatra-item-wrapper"
                variants={itemVariants}
                exit="exit"
                layout
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
              >
                <Link to={nakshatra.link} className="nakshatra-card">
                  <div className="card-glow"></div>
                  
                  <div className="nakshatra-icon-wrapper">
                    <div className="icon-ring">
                      <div className="nakshatra-icon">
                        {nakshatra.icon || <FiMoon />}
                      </div>
                    </div>
                  </div>
                  
                  <div className="nakshatra-info">
                    <h3 className="nakshatra-name">{nakshatra.name}</h3>
                    {nakshatra.sanskritName && (
                      <p className="nakshatra-sanskrit">{nakshatra.sanskritName}</p>
                    )}
                    <div className="nakshatra-meta">
                      <span className="meta-ruler">
                        <FiCompass />
                        {nakshatra.rulingPlanet || "Unknown"}
                      </span>
                    </div>
                  </div>

                  <div className="card-hover-content">
                    <FiInfo />
                    <span>Learn More</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {shouldShowButton && (
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="view-more-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>{isExpanded ? 'Show Less' : (isDesktop ? 'View All Nakshatras' : 'View More')}</span>
            <motion.span
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="btn-arrow"
            >
              ↓
            </motion.span>
          </motion.button>
        )}

        {/* Info Footer */}
        <div className="nakshatras-footer">
          <div className="footer-note">
            <FiMoon />
            <span>Each Nakshatra represents a specific constellation and carries unique energies that influence your life path</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default NakshatrasSection;