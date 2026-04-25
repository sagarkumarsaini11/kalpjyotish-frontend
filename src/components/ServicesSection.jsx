// src/components/ServicesSection.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { premiumServicesData, complimentaryServicesData } from '../data/servicesData';
import Modal from './Modal';
import './ServicesSection.css';
import { FiStar, FiHeart, FiCompass, FiMoon, FiSun, FiZap } from 'react-icons/fi';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, duration: 0.5 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, type: "spring", stiffness: 100 }
  }
};

// Helper function to get description text (handles both string and object)
const getDescriptionText = (service, language = 'en') => {
  if (!service.description) return "Learn more about this service";
  
  // If description is a string, return it directly
  if (typeof service.description === 'string') {
    return service.description;
  }
  
  // If description is an object with en/hi properties
  if (typeof service.description === 'object') {
    return service.description[language] || service.description.en || "Service description available soon";
  }
  
  return "Learn more about this service";
};

const ServicesSection = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [language, setLanguage] = useState('en'); // Add language state if needed

  const openModal = (service) => setSelectedService(service);
  const closeModal = () => setSelectedService(null);

  return (
    <section className="services-section">
      {/* Cosmic Background */}
      <div className="services-bg">
        <div className="services-nebula"></div>
        <div className="services-stars">
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

      <div className="services-wrapper">
        {/* Premium Services Section */}
        <motion.div
          className="service-container premium-container"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="section-header">
            <div className="header-badge">
              <FiStar />
              <span>Premium Services</span>
            </div>
            <h2 className="service-container-title">
              Our Premium <span className="title-highlight">Services</span>
            </h2>
            <p className="service-subtitle">
              Personalized astrological consultations with our expert panel
            </p>
          </div>

          <motion.div className="services-grid premium-grid">
            {premiumServicesData.map((service, index) => (
              <motion.a
                href={service.link}
                className="service-card premium-card"
                key={`premium-${index}`}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                onHoverStart={() => setHoveredCard(`premium-${index}`)}
                onHoverEnd={() => setHoveredCard(null)}
              >
                <div className="card-glow"></div>
                <div className="card-shine"></div>
                
                <div className="icon-container">
                  <div className="icon-ring">
                    <div className="icon-wrapper">
                      <div className="service-icon">{service.icon}</div>
                    </div>
                  </div>
                </div>
                
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">
                  {getDescriptionText(service, language)}
                </p>
                
                <div className="service-footer">
                  <span className="learn-more">Learn More</span>
                  <FiCompass className="arrow-icon" />
                </div>
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* Complimentary Services Section */}
        <motion.div
          className="service-container complimentary-container"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="section-header">
            <div className="header-badge">
              <FiHeart />
              <span>Free Resources</span>
            </div>
            <h2 className="service-container-title">
              Complimentary <span className="title-highlight">Astrology Services</span>
            </h2>
            <p className="service-subtitle">
              Free tools and resources to explore the cosmic wisdom
            </p>
          </div>

          <motion.div className="services-grid complimentary-grid">
            {complimentaryServicesData.map((service, index) => (
              <motion.div
                className="service-card complimentary-card"
                key={`complimentary-${index}`}
                variants={itemVariants}
                onClick={() => openModal(service)}
                style={{ cursor: 'pointer' }}
                whileHover={{ y: -8 }}
                onHoverStart={() => setHoveredCard(`comp-${index}`)}
                onHoverEnd={() => setHoveredCard(null)}
              >
                <div className="card-glow"></div>
                <div className="card-shine"></div>
                
                <div className="icon-container">
                  <div className="icon-ring complimentary-ring">
                    <div className="icon-wrapper">
                      <div className="service-icon complimentary-icon">
                        {service.icon}
                      </div>
                    </div>
                  </div>
                </div>
                
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">
                  {getDescriptionText(service, language)}
                </p>
                
                <div className="service-footer">
                  <span className="learn-more">Explore Now</span>
                  <FiZap className="arrow-icon" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {selectedService && <Modal service={selectedService} onClose={closeModal} language={language} />}
    </section>
  );
};

export default ServicesSection;