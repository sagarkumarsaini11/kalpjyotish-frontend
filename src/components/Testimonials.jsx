// src/components/Testimonials.jsx
import React, { useState } from 'react';
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Testimonials.css';

// Sample testimonial data - replace with your actual data
const testimonialsData = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai, India",
    rating: 5,
    testimonial: "The astrological guidance I received was incredibly accurate. It helped me make important life decisions with confidence.",
    image: "https://randomuser.me/api/portraits/women/1.jpg"
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    location: "Delhi, India",
    rating: 5,
    testimonial: "Excellent service! The astrologer was very knowledgeable and patient. Highly recommended.",
    image: "https://randomuser.me/api/portraits/men/2.jpg"
  },
  {
    id: 3,
    name: "Sneha Patel",
    location: "Bangalore, India",
    rating: 4,
    testimonial: "Very professional and insightful. The predictions were spot on and the remedies suggested were very helpful.",
    image: "https://randomuser.me/api/portraits/women/3.jpg"
  }
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeTestimonial = testimonialsData[activeIndex];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar 
        key={i} 
        style={{ color: i < rating ? '#ffd700' : '#4a4a4a' }}
      />
    ));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonialsData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonialsData.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <div className="testimonials-header">
          <h2 className="testimonials-title">What Our Devotees Say</h2>
          <p className="testimonials-subtitle">Real stories from people who found guidance through our services</p>
        </div>

        <div className="testimonial-wrapper">
          <button className="testimonial-nav prev" onClick={handlePrev}>
            <FaChevronLeft />
          </button>

          <div className="testimonial-card">
            <div className="testimonial-profile">
              <img 
                src={activeTestimonial.image} 
                alt={activeTestimonial.name}
                className="testimonial-avatar"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(activeTestimonial.name)}&background=ffd700&color=1a0a2e&bold=true`;
                }}
              />
            </div>
            
            <div className="testimonial-rating">
              {renderStars(activeTestimonial.rating)}
            </div>
            
            <p className="testimonial-text">
              <FaQuoteLeft className="quote-icon" />
              {activeTestimonial.testimonial}
            </p>
            
            <h3 className="testimonial-name">{activeTestimonial.name}</h3>
            <p className="testimonial-location">{activeTestimonial.location}</p>
          </div>

          <button className="testimonial-nav next" onClick={handleNext}>
            <FaChevronRight />
          </button>
        </div>

        <div className="testimonial-dots">
          {testimonialsData.map((_, idx) => (
            <button
              key={idx}
              className={`dot ${idx === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;  // ← THIS IS CRUCIAL!