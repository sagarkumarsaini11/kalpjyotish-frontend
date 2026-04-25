// src/components/ConsultationTopics.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { consultationTopicsData } from '../data/consultationData';
import { FiStar, FiCompass, FiArrowRight } from 'react-icons/fi';
import './ConsultationTopics.css';

const ConsultationTopics = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, duration: 0.5 }
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
    <section className="consultation-section">
      {/* Cosmic Background */}
      <div className="consultation-bg">
        <div className="consultation-nebula"></div>
        <div className="consultation-stars">
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

      <motion.div
        className="consultation-container"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        <div className="section-header">
          <div className="header-badge">
            <FiStar />
            <span>Expert Guidance</span>
          </div>
          <h2 className="consultation-main-title">
            Consult The Right <span className="title-highlight">Astrologer</span> For You
          </h2>
          <p className="consultation-subtitle">
            Choose from a wide range of specialized topics and get personalized guidance from our expert astrologers
          </p>
        </div>

        <motion.div 
          className="consultation-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {consultationTopicsData.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8 }}
            >
              <Link to={item.link} className="consultation-item">
                <div className="card-glow"></div>
                <div className="card-shine"></div>
                
                <div className="consultation-icon-wrapper">
                  <div className="icon-ring">
                    <div className="consultation-icon">{item.icon}</div>
                  </div>
                </div>
                
                <span className="consultation-title">{item.title}</span>
                
                <div className="consultation-hover-content">
                  <FiCompass />
                  <span>Consult Now</span>
                  <FiArrowRight />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className="consultation-footer">
          <div className="footer-note">
            <FiStar />
            <span>Get personalized advice from experienced astrologers</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ConsultationTopics;