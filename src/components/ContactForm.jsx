// src/components/ContactForm.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiX, 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiMessageSquare,
  FiSend,
  FiStar,
  FiMoon,
  FiSun,
  FiCompass
} from "react-icons/fi";
import "./ContactForm.css";
import { useSendContactQueryMutation } from "../services/backendApi";

const ContactForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    city: "",
    purpose: "General Consultation",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");
  const [responseType, setResponseType] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [sendContactQuery] = useSendContactQueryMutation();

  const purposeOptions = [
    "General Consultation",
    "Career Guidance",
    "Love & Relationship",
    "Finance & Wealth",
    "Health & Wellness",
    "Spiritual Growth",
    "Marriage Compatibility",
    "Business Astrology"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg("");
    setResponseType("");

    try {
      await sendContactQuery({
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        gender: formData.purpose || "Other",
        dob_time: "N/A",
        place_of_birth: formData.city,
        query: formData.message,
      }).unwrap();
      setResponseMsg("✨ Message sent successfully! Our astrologer will contact you soon.");
      setResponseType("success");
      setFormData({
        name: "",
        email: "",
        mobile: "",
        city: "",
        purpose: "General Consultation",
        message: "",
      });
      
      // Auto close after 3 seconds on success
      setTimeout(() => {
        if (onClose) onClose();
      }, 3000);
    } catch (error) {
      setResponseMsg(error?.data?.message || "⚠️ Unable to send message. Please try again later.");
      setResponseType("error");
    } finally {
      setLoading(false);
    }
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="contact-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="contact-modal-content"
            initial={{ scale: 0.85, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 50 }}
            transition={{ 
              type: "spring", 
              damping: 20, 
              stiffness: 300,
              duration: 0.4
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative Elements */}
            <div className="modal-cosmic-bg">
              <div className="cosmic-ring cosmic-ring-1"></div>
              <div className="cosmic-ring cosmic-ring-2"></div>
              <div className="cosmic-ring cosmic-ring-3"></div>
              <div className="floating-star star-1">✦</div>
              <div className="floating-star star-2">✧</div>
              <div className="floating-star star-3">✦</div>
              <div className="floating-star star-4">✧</div>
            </div>

            {/* Header */}
            <div className="contact-modal-header">
              <div className="header-icon-wrapper">
                <FiCompass className="header-icon" />
              </div>
              <div className="header-text">
                <h2>Connect With The Stars</h2>
                <p>Share your queries with our celestial guides</p>
              </div>
              <button className="close-button" onClick={onClose}>
                <FiX />
              </button>
            </div>

            {/* Body */}
            <div className="contact-modal-body">
              <form onSubmit={handleSubmit}>
                {/* Name Field */}
                <div className={`input-group ${focusedField === 'name' ? 'focused' : ''}`}>
                  <div className="input-icon">
                    <FiUser />
                  </div>
                  <input
                    type="text"
                    name="name"
                    placeholder=" "
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    required
                  />
                  <label className="floating-label">Your Full Name</label>
                  <div className="input-border"></div>
                </div>

                {/* Email Field */}
                <div className={`input-group ${focusedField === 'email' ? 'focused' : ''}`}>
                  <div className="input-icon">
                    <FiMail />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder=" "
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required
                  />
                  <label className="floating-label">Email Address</label>
                  <div className="input-border"></div>
                </div>

                {/* Mobile Field */}
                <div className={`input-group ${focusedField === 'mobile' ? 'focused' : ''}`}>
                  <div className="input-icon">
                    <FiPhone />
                  </div>
                  <input
                    type="tel"
                    name="mobile"
                    placeholder=" "
                    value={formData.mobile}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('mobile')}
                    onBlur={() => setFocusedField(null)}
                    required
                  />
                  <label className="floating-label">Mobile Number</label>
                  <div className="input-border"></div>
                </div>

                {/* City Field */}
                <div className={`input-group ${focusedField === 'city' ? 'focused' : ''}`}>
                  <div className="input-icon">
                    <FiMapPin />
                  </div>
                  <input
                    type="text"
                    name="city"
                    placeholder=" "
                    value={formData.city}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('city')}
                    onBlur={() => setFocusedField(null)}
                    required
                  />
                  <label className="floating-label">Your City</label>
                  <div className="input-border"></div>
                </div>

                {/* Purpose Dropdown */}
                <div className="select-group">
                  <div className="input-icon">
                    <FiStar />
                  </div>
                  <select
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    className="cosmic-select"
                  >
                    {purposeOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <label className="select-label">Purpose of Consultation</label>
                  <div className="select-border"></div>
                </div>

                {/* Message Field */}
                <div className={`input-group textarea-group ${focusedField === 'message' ? 'focused' : ''}`}>
                  <div className="input-icon">
                    <FiMessageSquare />
                  </div>
                  <textarea
                    name="message"
                    placeholder=" "
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    required
                  ></textarea>
                  <label className="floating-label">Your Message</label>
                  <div className="input-border"></div>
                </div>

                {/* Response Message */}
                <AnimatePresence>
                  {responseMsg && (
                    <motion.div 
                      className={`response-message ${responseType}`}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {responseMsg}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.button 
                  type="submit" 
                  className="submit-button"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <div className="button-loader">
                      <div className="loader-spinner"></div>
                      <span>Sending Message...</span>
                    </div>
                  ) : (
                    <>
                      <FiSend className="button-icon" />
                      <span>Send Message</span>
                      <div className="button-glow"></div>
                    </>
                  )}
                </motion.button>
              </form>

              {/* Footer Note */}
              <div className="modal-footer-note">
                <FiMoon />
                <span>Our astrologers will respond within 24 hours</span>
                <FiSun />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContactForm;