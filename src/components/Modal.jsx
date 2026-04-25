// src/components/Modal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import './Modal.css';

const Modal = ({ service, onClose, language = 'en' }) => {
  if (!service) return null;

  // Helper function to get description text
  const getDescriptionText = () => {
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

  // Helper function to get title
  const getTitle = () => {
    if (typeof service.title === 'object') {
      return service.title[language] || service.title.en || "Service";
    }
    return service.title;
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="modal-content"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="modal-close" onClick={onClose}>
            <FiX />
          </button>
          
          <div className="modal-icon">
            {service.icon}
          </div>
          
          <h2 className="modal-title">{getTitle()}</h2>
          
          <div className="modal-description">
            <p>{getDescriptionText()}</p>
          </div>
          
          {service.link && (
            <a href={service.link} className="modal-action-btn">
              Learn More
            </a>
          )}
          
          <button className="modal-close-btn" onClick={onClose}>
            Close
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Modal;