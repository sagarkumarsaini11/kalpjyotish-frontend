import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './AstroShopSection.css';
import Footer from './Footer';
import { useGetProductsQuery } from '../services/backendApi';

// --- Card Sub-Component with 3D Tilt Effect ---
const ProductCard = ({ product }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    // Disable effect on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Adjust sensitivity of the tilt
    setRotate({ x: -y / 20, y: x / 15 });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  // Animation for the card itself
  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, type: 'spring' } }
  };

  return (
    <motion.div
      className="product-card-wrapper"
      variants={cardVariants}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: 'transform 0.1s linear'
      }}
    >
      <div className="product-card">
        <div
          className="card-image-bg"
          style={{ backgroundImage: `url(${product.images[0]})` }}
        ></div>
        <div className="card-overlay-gradient"></div>

        <div className="card-content">
          <h3 className="product-name">{product.name}</h3>
        </div>

        {/* This content is revealed on hover */}
        <div className="card-hover-content">
          <p className="product-description">{product.description.substring(0, 100)}...</p>
          <div className="product-price">₹{product.price.toLocaleString('en-IN')}</div>
          <Link to={`/shop/product/${product._id}`} className="details-button">
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};


// --- Main Section Component ---
const AstroShopSection = () => {
  const { data: products = [], isLoading: loading, isError } = useGetProductsQuery();
  // console.log("Fetched products:", products); // Debugging log

  // Animation for the container to stagger children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  if (isError) {
    return <div className="astro-shop-section"><p className="error-message">Failed to load products. Please try again later.</p></div>;
  }

  return (
    <>
      <section className="astro-shop-section">
        <h2 className="astro-shop-main-title">Astro Shop</h2>
        <p className="astro-shop-subtitle">Authentic Gemstones, Yantras, and Pooja Essentials</p>

        {loading ? (
          <div className="loader-container"><div className="loader"></div></div>
        ) : (
          <motion.div
            className="product-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </motion.div>
        )}
      </section>
      <Footer />
    </>
  );
};

export default AstroShopSection;
