// src/pages/LandingPage.jsx
import React, { useState, useEffect } from "react";
import { 
  FiArrowRight, 
  FiLoader, 
  FiCheckCircle, 
  FiXCircle,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiMessageSquare,
  FiSend,
  FiStar,
  FiMoon,
  FiSun,
  FiCompass,
  FiHeart,
  FiBriefcase,
  FiHome
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import Footer from '../components/Footer';
import "./LandingPage.css";
import { useSendContactQueryMutation } from "../services/backendApi";

// Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      className={`toast-notification ${type === "success" ? "toast-success" : "toast-error"}`}
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ duration: 0.3, type: "spring", damping: 20 }}
    >
      {type === "success" ? <FiCheckCircle className="toast-icon" /> : <FiXCircle className="toast-icon" />}
      <span className="toast-message">{message}</span>
      <button onClick={onClose} className="toast-close-btn">×</button>
    </motion.div>
  );
};

// Hero Section Component
const HeroSection = () => {
  return (
    <section className="landing-hero">
      <div className="hero-cosmic-bg">
        <div className="hero-nebula hero-nebula-1"></div>
        <div className="hero-nebula hero-nebula-2"></div>
        <div className="hero-nebula hero-nebula-3"></div>
        <div className="hero-stars">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="hero-star" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}></div>
          ))}
        </div>
      </div>
      
      <div className="hero-container">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="hero-badge">
            <FiStar className="badge-icon" />
            <span>Vedic Astrology Experts</span>
          </div>
          
          <h1 className="hero-title">
            Discover Your 
            <span className="title-gradient"> Cosmic Destiny</span>
          </h1>
          
          <p className="hero-subtitle">
            Unlock the secrets of the stars with India's most trusted astrologers. 
            Get personalized guidance for love, career, health, and spiritual growth.
          </p>
          
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Happy Clients</div>
            </div>
            <div className="hero-stat">
              <div className="stat-number">100+</div>
              <div className="stat-label">Expert Astrologers</div>
            </div>
            <div className="hero-stat">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support Available</div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <div className="hero-scroll-indicator">
        <div className="scroll-mouse"></div>
        <div className="scroll-arrow">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </section>
  );
};

// Floating Particles Component
const FloatingParticles = () => {
  const particles = [...Array(20)].map((_, i) => ({
    id: i,
    icon: [FiStar, FiMoon, FiSun, FiCompass, FiHeart][Math.floor(Math.random() * 5)],
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 10,
    left: Math.random() * 100,
    top: Math.random() * 100
  }));

  return (
    <div className="floating-particles">
      {particles.map(particle => {
        const Icon = particle.icon;
        return (
          <motion.div
            key={particle.id}
            className="floating-particle"
            style={{ left: `${particle.left}%`, top: `${particle.top}%` }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              rotate: [0, 360],
              opacity: [0.2, 0.6, 0.2]
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Icon />
          </motion.div>
        );
      })}
    </div>
  );
};

// Main Landing Page Component
const LandingPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    gender: "",
    dob: "",
    tob: "",
    pob: "",
    query: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const [sendContactQuery] = useSendContactQueryMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setToast(null);

    try {
      const data = await sendContactQuery({
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        gender: formData.gender,
        dob_time: `${formData.dob} ${formData.tob}`,
        place_of_birth: formData.pob,
        query: formData.query,
      }).unwrap();

      if (data?.success) {
        setToast({ message: "✨ Thank you! Your query has been submitted successfully. Our astrologer will contact you soon.", type: "success" });
        setFormData({
          name: "",
          email: "",
          mobile: "",
          gender: "",
          dob: "",
          tob: "",
          pob: "",
          query: "",
        });
      } else {
        throw new Error(data.message || "Failed to submit form");
      }
    } catch (error) {
      setToast({ message: "⚠️ Oops! Something went wrong. Please try again.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const inputFields = [
    { name: "name", label: "Full Name", type: "text", icon: FiUser, placeholder: "Enter your full name", required: true },
    { name: "email", label: "Email Address", type: "email", icon: FiMail, placeholder: "your@email.com", required: true },
    { name: "mobile", label: "Mobile Number", type: "tel", icon: FiPhone, placeholder: "+91 1234567890", required: true },
  ];

  return (
    <div className="landing-page">
      <AnimatePresence>
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </AnimatePresence>

      <HeroSection />
      <FloatingParticles />

      {/* Contact Form Section */}
      <section className="contact-section" id="contact">
        <div className="section-container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="section-badge">
              <FiCompass />
              <span>Begin Your Journey</span>
            </div>
            <h2 className="section-title">
              Connect With Our 
              <span className="title-highlight"> Celestial Guides</span>
            </h2>
            <p className="section-subtitle">
              Fill in your details and our expert astrologers will reach out to you with cosmic insights
            </p>
          </motion.div>

          <div className="contact-grid">
            {/* Contact Form */}
            <motion.div 
              className="contact-form-wrapper"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="form-card">
                <div className="form-header">
                  <div className="form-header-icon">
                    <FiSend />
                  </div>
                  <h3>Request a Consultation</h3>
                  <p>Fill the form below to get started</p>
                </div>

                <form onSubmit={handleSubmit} className="cosmic-form">
                  {/* Name Field */}
                  <div className={`form-group ${focusedField === 'name' ? 'focused' : ''}`}>
                    <div className="input-icon">
                      <FiUser />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      placeholder=" "
                      required
                    />
                    <label>Full Name</label>
                    <div className="input-border"></div>
                  </div>

                  {/* Email Field */}
                  <div className={`form-group ${focusedField === 'email' ? 'focused' : ''}`}>
                    <div className="input-icon">
                      <FiMail />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      placeholder=" "
                      required
                    />
                    <label>Email Address</label>
                    <div className="input-border"></div>
                  </div>

                  {/* Mobile Field */}
                  <div className={`form-group ${focusedField === 'mobile' ? 'focused' : ''}`}>
                    <div className="input-icon">
                      <FiPhone />
                    </div>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('mobile')}
                      onBlur={() => setFocusedField(null)}
                      placeholder=" "
                      required
                    />
                    <label>Mobile Number</label>
                    <div className="input-border"></div>
                  </div>

                  {/* Gender Select */}
                  <div className="form-group select-group">
                    <div className="input-icon">
                      <FiUser />
                    </div>
                    <select name="gender" value={formData.gender} onChange={handleChange} required>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <label>Gender</label>
                    <div className="input-border"></div>
                  </div>

                  {/* DOB & TOB Row */}
                  <div className="form-row">
                    <div className={`form-group ${focusedField === 'dob' ? 'focused' : ''}`}>
                      <div className="input-icon">
                        <FiCalendar />
                      </div>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('dob')}
                        onBlur={() => setFocusedField(null)}
                        required
                      />
                      <label>Date of Birth</label>
                      <div className="input-border"></div>
                    </div>

                    <div className={`form-group ${focusedField === 'tob' ? 'focused' : ''}`}>
                      <div className="input-icon">
                        <FiClock />
                      </div>
                      <input
                        type="time"
                        name="tob"
                        value={formData.tob}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('tob')}
                        onBlur={() => setFocusedField(null)}
                        required
                      />
                      <label>Time of Birth</label>
                      <div className="input-border"></div>
                    </div>
                  </div>

                  {/* Place of Birth */}
                  <div className={`form-group ${focusedField === 'pob' ? 'focused' : ''}`}>
                    <div className="input-icon">
                      <FiMapPin />
                    </div>
                    <input
                      type="text"
                      name="pob"
                      value={formData.pob}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('pob')}
                      onBlur={() => setFocusedField(null)}
                      placeholder=" "
                      required
                    />
                    <label>Place of Birth</label>
                    <div className="input-border"></div>
                  </div>

                  {/* Query */}
                  <div className={`form-group textarea-group ${focusedField === 'query' ? 'focused' : ''}`}>
                    <div className="input-icon">
                      <FiMessageSquare />
                    </div>
                    <textarea
                      name="query"
                      value={formData.query}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('query')}
                      onBlur={() => setFocusedField(null)}
                      rows="4"
                      placeholder=" "
                      required
                    ></textarea>
                    <label>Your Question</label>
                    <div className="input-border"></div>
                  </div>

                  <motion.button
                    type="submit"
                    className="submit-btn"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <>
                        <FiLoader className="spinner" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <FiSend />
                        <span>Submit Query</span>
                        <div className="btn-glow"></div>
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div 
              className="contact-info-wrapper"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="info-card">
                <div className="info-header">
                  <FiStar className="info-header-icon" />
                  <h3>Get in Touch</h3>
                  <p>We're here to guide you on your cosmic journey</p>
                </div>

                <div className="info-items">
                  <div className="info-item">
                    <div className="info-icon-wrapper">
                      <FiMail />
                    </div>
                    <div className="info-content">
                      <h4>Email Us</h4>
                      <p>info@kalpjyotish.com</p>
                      <p>support@kalpjyotish.com</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon-wrapper">
                      <FiPhone />
                    </div>
                    <div className="info-content">
                      <h4>Call Us</h4>
                      <p>+91 7419064919</p>
                      <p>+91 7456804919</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon-wrapper">
                      <FiClock />
                    </div>
                    <div className="info-content">
                      <h4>Working Hours</h4>
                      <p>Monday - Friday: 9:00 AM - 8:00 PM</p>
                      <p>Saturday - Sunday: 10:00 AM - 6:00 PM</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <div className="info-icon-wrapper">
                      <FiMapPin />
                    </div>
                    <div className="info-content">
                      <h4>Our Location</h4>
                      <p>3rd Floor, Ashoka Apartment,</p>
                      <p>THDC Colony, Rishikesh, Uttarakhand</p>
                    </div>
                  </div>
                </div>

                <div className="info-social">
                  <h4>Follow Us</h4>
                  <div className="social-links">
                    <a href="#" className="social-link">📘</a>
                    <a href="#" className="social-link">📷</a>
                    <a href="#" className="social-link">🐦</a>
                    <a href="#" className="social-link">📺</a>
                  </div>
                </div>
              </div>

              {/* Quick Response Badge */}
              <div className="response-badge">
                <div className="response-icon">
                  <FiCheckCircle />
                </div>
                <div className="response-text">
                  <strong>Quick Response</strong>
                  <span>We reply within 24 hours</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;