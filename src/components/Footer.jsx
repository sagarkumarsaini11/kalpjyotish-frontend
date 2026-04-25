// src/components/Footer.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GiSun, GiMoon, GiStarsStack, GiCompass } from 'react-icons/gi';
import { 
  FaFacebookF, 
  FaYoutube, 
  FaInstagram, 
  FaXTwitter, 
  FaWhatsapp, 
  FaPhone,
  FaApple,
  FaGooglePlay
} from 'react-icons/fa6';
import { 
  FiArrowUp, 
  FiMail, 
  FiMapPin, 
  FiClock,
  FiHeart,
  FiShield
} from 'react-icons/fi';
import { quickLinks, usefulLinks } from '../data/footerLinksData';
import ContactForm from "./ContactForm";
import './Footer.css';

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [hoveredSocial, setHoveredSocial] = useState(null);

  const phoneNumber = "+917419064919";
  const whatsappNumber = "+917419064919";

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Namaste! I'd like to learn more about KalpJyotish's astrological services. Can you guide me?");
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const handleCallClick = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const socialLinks = [
    { icon: <FaFacebookF />, link: 'https://facebook.com', name: 'Facebook', color: '#1877f2' },
    { icon: <FaYoutube />, link: 'https://youtube.com', name: 'YouTube', color: '#ff0000' },
    { icon: <FaInstagram />, link: 'https://instagram.com', name: 'Instagram', color: '#e4405f' },
    { icon: <FaXTwitter />, link: 'https://twitter.com', name: 'Twitter', color: '#1da1f2' },
  ];

  return (
    <footer className="site-footer">
      {/* Cosmic Background Effect */}
      <div className="footer-cosmic-bg">
        <div className="footer-star"></div>
        <div className="footer-star"></div>
        <div className="footer-star"></div>
        <div className="footer-star"></div>
        <div className="footer-star"></div>
        <div className="footer-star"></div>
      </div>

      <div className="footer-main">
        {/* Brand Column */}
        <div className="footer-column brand-column">
          <Link to="/" className="footer-logo">
            <div className="logo-icon">
              <GiSun />
              <GiMoon className="logo-moon" />
            </div>
            <span>Kalp<span className="logo-highlight">Jyotish</span></span>
          </Link>
          
          <div className="about-section">
            <h4 className="footer-heading with-icon">
              <GiCompass />
              <span>About KalpJyotish</span>
            </h4>
            <div className="about-divider"></div>
            <p className="about-text">
              Your trusted partner in connecting with knowledgeable and culturally-rooted astrologers. 
              We understand the significance of cosmic guidance in your life, and our mission is to make 
              these spiritual practices accessible, authentic, and hassle-free.
            </p>
          </div>

          <h4 className="footer-heading with-icon">
            <FaApple />
            <span>Coming Soon On</span>
          </h4>
          <div className="app-badges">
            <motion.a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ y: -5, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Get it on Google Play"
              />
            </motion.a>
            <motion.a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ y: -5, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                alt="Download on the App Store"
              />
            </motion.a>
          </div>

          <h4 className="footer-heading with-icon">
            <FiHeart />
            <span>Connect With Us</span>
          </h4>
          <div className="social-icons">
            {socialLinks.map((social, index) => (
              <motion.a 
                key={index} 
                href={social.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon"
                style={{ '--social-color': social.color }}
                whileHover={{ scale: 1.15, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setHoveredSocial(index)}
                onHoverEnd={() => setHoveredSocial(null)}
              >
                {social.icon}
                <span className="social-tooltip">{social.name}</span>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="footer-column">
          <h3 className="footer-title">
            <span className="title-icon">✨</span>
            Quick Links
          </h3>
          <ul className="footer-links">
            {quickLinks.map((link, index) => (
              <motion.li 
                key={link.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Link to={link.path}>
                  <span className="link-dot">✦</span>
                  {link.title}
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Useful Links Column */}
        <div className="footer-column">
          <h3 className="footer-title">
            <span className="title-icon">🔮</span>
            Useful Links
          </h3>
          <ul className="footer-links">
            {usefulLinks.map((link, index) => (
              <motion.li 
                key={link.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                {link.title === "Contact Us" ? (
                  <button
                    className="contact-link"
                    onClick={() => setIsContactOpen(true)}
                  >
                    <span className="link-dot">📞</span>
                    {link.title}
                  </button>
                ) : (
                  <Link to={link.path}>
                    <span className="link-dot">✦</span>
                    {link.title}
                  </Link>
                )}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Contact Info Column */}
        <div className="footer-column contact-column">
          <h3 className="footer-title">
            <span className="title-icon">📍</span>
            Get in Touch
          </h3>
          <div className="contact-info">
            <div className="contact-item">
              <FiMapPin className="contact-icon" />
              <div>
                <strong>Address</strong>
                <p>3rd Floor, Ashoka Apartment, THDC Colony, Rishikesh, Uttarakhand</p>
              </div>
            </div>
            <div className="contact-item">
              <FiMail className="contact-icon" />
              <div>
                <strong>Email Us</strong>
                <a href="mailto:info@kalpjyotish.com">info@kalpjyotish.com</a>
                <a href="mailto:support@kalpjyotish.com">support@kalpjyotish.com</a>
              </div>
            </div>
            <div className="contact-item">
              <FiClock className="contact-icon" />
              <div>
                <strong>Working Hours</strong>
                <p>Mon - Fri: 9:00 AM - 8:00 PM</p>
                <p>Sat - Sun: 10:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
          
          <div className="trust-badge">
            <FiShield />
            <span>100% Secure & Confidential</span>
          </div>
        </div>
      </div>

      <ContactForm
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} KalpJyotish. All rights reserved.</p>
        <div className="footer-bottom-sign">
          <a
            href="https://www.digitalinapp.in/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered By <span>Digital In App</span>
          </a>
        </div>
        <div className="footer-bottom-links">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/faq">FAQs</Link>
          <Link to="/terms">Terms & Conditions</Link>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <AnimatePresence>
        {isVisible && (
          <>
            <motion.button
              className="floating-action-btn whatsapp-float"
              onClick={handleWhatsAppClick}
              initial={{ opacity: 0, scale: 0, x: 100 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0, x: 100 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaWhatsapp />
              <span className="float-label">WhatsApp</span>
            </motion.button>

            <motion.button
              className="floating-action-btn call-float"
              onClick={handleCallClick}
              initial={{ opacity: 0, scale: 0, x: 100 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0, x: 100 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPhone />
              <span className="float-label">Call Now</span>
            </motion.button>

            <motion.button
              className="floating-action-btn back-to-top"
              onClick={scrollToTop}
              initial={{ opacity: 0, scale: 0, x: 100 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0, x: 100 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiArrowUp />
              <span className="float-label">Top</span>
            </motion.button>
          </>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;