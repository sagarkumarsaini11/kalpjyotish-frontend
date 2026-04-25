// src/components/BlogPostCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FiArrowRight, FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './BlogSection.css';

const BlogPostCard = ({ post, index }) => {
  const [imageErrors, setImageErrors] = useState({});

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.6, delay: index * 0.1 }
    }
  };

  // Fallback images in case the provided images fail to load
  const fallbackImages = [
    'https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&h=500&fit=crop'
  ];

  // Ensure images array exists and has valid URLs
  const getValidImages = () => {
    if (!post.images || !Array.isArray(post.images) || post.images.length === 0) {
      return fallbackImages;
    }
    
    return post.images.map(img => {
      // Check if image is a valid URL string
      if (typeof img === 'string' && (img.startsWith('http') || img.startsWith('/'))) {
        return img;
      }
      return fallbackImages[0];
    });
  };

  const images = getValidImages();

  // Handle image load error
  const handleImageError = (slideIndex) => {
    setImageErrors(prev => ({
      ...prev,
      [slideIndex]: true
    }));
  };

  // Calculate read time (approx 200 words per minute)
  const calculateReadTime = () => {
    const wordCount = post.excerpt?.split(/\s+/).length || 200;
    return Math.max(2, Math.ceil(wordCount / 200));
  };

  const readTime = post.readTime || calculateReadTime();

  return (
    <motion.article
      className="blog-card"
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      {/* Image Slider */}
      <div className="blog-card-slider">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ type: 'progressbar' }}
          loop={images.length > 1}
          autoplay={images.length > 1 ? { delay: 4000, disableOnInteraction: false } : false}
          className="blog-swiper"
        >
          {images.map((image, idx) => (
            <SwiperSlide key={idx}>
              <div 
                className="blog-slide"
                style={{ 
                  backgroundImage: imageErrors[idx] 
                    ? `url(${fallbackImages[idx % fallbackImages.length]})`
                    : `url(${image})`
                }}
              >
                <img 
                  src={imageErrors[idx] ? fallbackImages[idx % fallbackImages.length] : image}
                  alt={`${post.title} - image ${idx + 1}`}
                  onError={() => handleImageError(idx)}
                  style={{ display: 'none' }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        
        {/* Category Badge */}
        <span className="blog-card-category">{post.category || "Astrology"}</span>
      </div>

      {/* Content */}
      <div className="blog-card-content">
        <h3 className="blog-card-title">
          <Link to={post.link}>
            {post.title}
          </Link>
        </h3>

        {/* Meta Information */}
        <div className="blog-card-meta">
          <div className="meta-author">
            <FiUser />
            <span>{post.author || "Astrology Expert"}</span>
          </div>
          <div className="meta-date">
            <FiCalendar />
            <span>{post.date || new Date().toLocaleDateString()}</span>
          </div>
          <div className="meta-read-time">
            <FiClock />
            <span>{readTime} min read</span>
          </div>
        </div>

        {/* Excerpt */}
        <p className="blog-card-excerpt">
          {post.excerpt?.length > 150 
            ? `${post.excerpt.substring(0, 150)}...` 
            : post.excerpt}
        </p>

        {/* Read More Button */}
        <Link to={post.link} className="read-more-btn">
          <span>Read Full Article</span>
          <FiArrowRight />
        </Link>
      </div>

      {/* Decorative Elements */}
      <div className="blog-card-glow"></div>
    </motion.article>
  );
};

export default BlogPostCard;