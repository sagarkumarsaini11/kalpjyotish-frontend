// src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Import your images
import heroImage1 from '../assets/hero-1.png';
import heroImage2 from '../assets/new.png';
import heroImage3 from '../assets/hero-3.png';

// Import icons
import { 
  FiArrowRight, 
  FiStar, 
  FiMoon, 
  FiSun, 
  FiCompass,
  FiZap,
  FiHeart,
  FiAnchor,
  FiWind,
  FiDroplet
} from 'react-icons/fi';

// Import components
import ServicesSection from '../components/ServicesSection';
import DailyInsights from '../components/DailyInsights';
import ConsultationTopics from '../components/ConsultationTopics';
import NakshatrasSection from '../components/NakshatrasSection';
import Testimonials from '../components/Testimonials';
import BlogSection from '../components/BlogSection';
import Footer from '../components/Footer';

// Import CSS
import './HomePage.css';

// Floating Particles Component
const CosmicParticles = () => {
  const particleCount = 80;
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.4 + 0.1
  }));

  return (
    <div className="cosmic-particles">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
            opacity: particle.opacity
          }}
        />
      ))}
    </div>
  );
};

// Floating Zodiac Icons
const FloatingZodiacIcons = () => {
  const zodiacIcons = [
    { icon: "♈", delay: 0, duration: 25 },
    { icon: "♉", delay: 2, duration: 30 },
    { icon: "♊", delay: 4, duration: 28 },
    { icon: "♋", delay: 1, duration: 32 },
    { icon: "♌", delay: 3, duration: 26 },
    { icon: "♍", delay: 5, duration: 29 },
    { icon: "♎", delay: 2.5, duration: 31 },
    { icon: "♏", delay: 4.5, duration: 27 },
    { icon: "♐", delay: 1.5, duration: 33 },
    { icon: "♑", delay: 3.5, duration: 24 },
    { icon: "♒", delay: 0.5, duration: 30 },
    { icon: "♓", delay: 5.5, duration: 28 }
  ];

  return (
    <div className="floating-zodiacs">
      {zodiacIcons.map((zodiac, index) => (
        <div
          key={index}
          className="zodiac-icon"
          style={{
            animationDelay: `${zodiac.delay}s`,
            animationDuration: `${zodiac.duration}s`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
        >
          {zodiac.icon}
        </div>
      ))}
    </div>
  );
};

// Main HomePage Component
const HomePage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setIsVisible(window.scrollY < 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Hero Section - No Slider, Just Peaceful Animation */}
      <section className="hero-section">
        {/* Cosmic Background Effects */}
        <div className="cosmic-background">
          <div className="nebula nebula-1"></div>
          <div className="nebula nebula-2"></div>
          <div className="nebula nebula-3"></div>
          <div className="nebula nebula-4"></div>
        </div>

        {/* Floating Elements */}
        <CosmicParticles />
        <FloatingZodiacIcons />

        {/* Gradient Overlays */}
        <div className="hero-gradient-overlay"></div>
        <div className="hero-vignette"></div>

        {/* Main Hero Content */}
        <div className="hero-container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            {/* Cosmic Badge */}
            <motion.div 
              className="hero-badge"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <FiStar className="badge-icon" />
              <span>Vedic Astrology Center</span>
              <FiStar className="badge-icon" />
            </motion.div>

          
           {/* Main Title with Animation */}
<motion.h1 
  className="hero-title"
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.5, duration: 0.8 }}
>
  <span className="title-line">Discover Your</span>
  <span className="title-gradient"> Cosmic Path</span>
</motion.h1>

            {/* Animated underline */}
            <motion.div 
              className="title-underline"
              initial={{ width: 0 }}
              animate={{ width: 120 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            ></motion.div>

            {/* Subtitle */}
            <motion.p 
              className="hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              Unlock the ancient wisdom of Vedic astrology with personalized guidance 
              from India's most trusted celestial experts
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="hero-cta-group"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <Link to="/talk" className="cta-btn primary">
                <span>Begin Your Journey</span>
                <FiArrowRight />
              </Link>
              <Link to="/about" className="cta-btn secondary">
                <FiCompass />
                <span>Discover More</span>
              </Link>
            </motion.div>

            {/* Stats Section */}
            <motion.div 
              className="hero-stats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.8 }}
            >
              <div className="stat-item">
                <div className="stat-icon">
                  <FiStar />
                </div>
                <div className="stat-info">
                  <span className="stat-number">50K+</span>
                  <span className="stat-label">Happy Clients</span>
                </div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-icon">
                  <FiZap />
                </div>
                <div className="stat-info">
                  <span className="stat-number">100+</span>
                  <span className="stat-label">Expert Astrologers</span>
                </div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-icon">
                  <FiMoon />
                </div>
                <div className="stat-info">
                  <span className="stat-number">24/7</span>
                  <span className="stat-label">Cosmic Support</span>
                </div>
              </div>
            </motion.div>

            {/* Trust Badges */}
            <motion.div 
              className="trust-badges"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.8 }}
            >
              <span className="trust-text">Trusted by</span>
              <div className="badges">
                <span>⭐ 4.9 Rating</span>
                <span>🔒 Secure</span>
                <span>💎 10+ Years</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Peaceful Scroll Indicator */}
        <motion.div 
          className="scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <div className="scroll-mouse">
            <div className="scroll-wheel"></div>
          </div>
          <div className="scroll-text">
            <span>Scroll to explore</span>
            <div className="scroll-arrow">↓</div>
          </div>
        </motion.div>
      </section>

      {/* Rest of the Page Content */}
      <ServicesSection />
      <DailyInsights />
      <ConsultationTopics />
      <NakshatrasSection />
      <Testimonials />
      <BlogSection />
      <Footer />
    </>
  );
};

export default HomePage;