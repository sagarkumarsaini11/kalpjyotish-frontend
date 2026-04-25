// src/components/BlogSection.jsx
import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { blogPostsData } from '../data/blogData';
import BlogPostCard from './BlogPostCard';
import { FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi';
import './BlogSection.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

const BlogSection = () => {
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 20);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  return (
    <section className="blog-section">
      {/* Cosmic Background */}
      <div className="blog-cosmic-bg">
        <div className="blog-nebula"></div>
        <div className="blog-stars">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="star" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}></div>
          ))}
        </div>
      </div>

      <div className="blog-container">
        <div className="blog-header">
          <div className="header-badge">
            <FiStar />
            <span>Cosmic Insights</span>
          </div>
          <h2 className="blog-section-title">
            From Our <span className="title-highlight">Cosmic Journal</span>
          </h2>
          <p className="blog-subtitle">
            Explore ancient wisdom, astrological insights, and spiritual guidance
          </p>
        </div>

        {/* Scroll Navigation Arrows (Desktop only) */}
        {!isMobile && (
          <>
            {showLeftArrow && (
              <button className="scroll-arrow left" onClick={() => scroll('left')}>
                <FiChevronLeft />
              </button>
            )}
            {showRightArrow && (
              <button className="scroll-arrow right" onClick={() => scroll('right')}>
                <FiChevronRight />
              </button>
            )}
          </>
        )}

        <motion.div
          className="blog-grid"
          ref={scrollContainerRef}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          onScroll={handleScroll}
        >
          {blogPostsData.map((post, index) => (
            <BlogPostCard key={post.id} post={post} index={index} />
          ))}
        </motion.div>

        {/* Scroll Indicators for Mobile */}
        {isMobile && (
          <div className="scroll-indicators">
            <div className="scroll-hint">
              <span>Swipe to explore more →</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;