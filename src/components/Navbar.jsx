// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Icons
import { GiSun, GiMoon } from "react-icons/gi";
import { FaHome, FaShoppingCart, FaUserCircle, FaUserAstronaut } from "react-icons/fa";
import { BsStars, BsChatDots } from "react-icons/bs";
import { IoClose, IoLogOutOutline, IoPersonOutline } from "react-icons/io5";
import { FiHeart, FiStar } from "react-icons/fi";
import AuthModal from "./AuthModal";
import "./Navbar.css";
import logo from '../assets/logo.jpeg';

const Navbar = ({ onSignupClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setAuthModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMobileMenu = () => setIsMenuOpen(false);
  const openAuthModal = () => setAuthModal(true);
  const closeAuthModal = () => setAuthModal(false);

  // Check login status on component mount
  useEffect(() => {
    const checkLoginStatus = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedLoginStatus = localStorage.getItem('isLoggedIn');

        if (storedUser && storedLoginStatus === 'true') {
          setUser(JSON.parse(storedUser));
          setIsLoggedIn(true);
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        setUser(null);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
    const interval = setInterval(checkLoginStatus, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('authRole');
      localStorage.removeItem('userId');
      localStorage.removeItem('backendUserId');
      setUser(null);
      setIsLoggedIn(false);
      setShowUserMenu(false);
      navigate('/');
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleProfileNavigate = () => {
    const role = localStorage.getItem("authRole");
    setShowUserMenu(false);
    if (role === "astrologer") {
      navigate("/astrologer-dashboard");
      return;
    }
    navigate("/user-profile");
  };

  const handleAuthClick = () => {
    if (!isLoggedIn) {
      openAuthModal();
      return;
    }
    setShowUserMenu((prev) => !prev);
  };

  const navItems = [
    { to: "/", icon: <FaHome />, text: "Home" },
    { to: "/horoscope", icon: <BsStars />, text: "Horoscope" },
    { to: "/pooja", icon: <FiStar />, text: "Pooja" },
    { to: "/astro-connect", icon: <BsChatDots />, text: "Connect" },
    { to: "/contact-us", icon: <FiHeart />, text: "Contact" },
    { to: "/shop", icon: <FaShoppingCart />, text: "Shop" },
  ];

  const sideMenuVariants = {
    closed: { x: "100%" },
    open: { x: "0%", transition: { type: "spring", stiffness: 120, damping: 20 } },
  };

  return (
    <>
      <motion.nav
        className={`navbar ${scrolled ? 'scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Logo */}
        <div className="navbar-logo">
          <NavLink to="/" onClick={isMenuOpen ? closeMobileMenu : undefined}>
            <div className="logo-wrapper">
              <img src={logo} alt="KalpJyotish" onError={(e) => {
                e.target.src = "https://via.placeholder.com/45?text=KJ";
              }} />
              <div className="logo-glow"></div>
            </div>
            <div className="logo-text">
              <span className="logo-kalp">Kalp</span>
              <span className="logo-jyotish">Jyotish</span>
            </div>
          </NavLink>
        </div>

        {/* Desktop Navigation */}
        <ul className="navbar-links desktop-links">
          {navItems.map((item) => (
            <motion.li 
              key={item.to}
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <NavLink to={item.to}>
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.text}</span>
                <span className="nav-hover-line"></span>
              </NavLink>
            </motion.li>
          ))}

          {/* User Menu - Desktop */}
          <li className="user-menu-container">
            {isLoggedIn ? (
              <div className="user-menu" ref={userMenuRef}>
                <motion.button
                  className="user-menu-trigger"
                  onClick={handleAuthClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {user?.profilePhoto ? (
                    <img src={user.profilePhoto} alt={user.name} className="user-avatar" />
                  ) : (
                    <div className="user-avatar-placeholder">
                      <FaUserAstronaut />
                    </div>
                  )}
                  <span className="user-name">{user?.name?.split(' ')[0] || "User"}</span>
                  <span className="dropdown-arrow">▼</span>
                </motion.button>
                
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      className="user-dropdown"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="dropdown-header">
                        <div className="dropdown-user-info">
                          {user?.profilePhoto ? (
                            <img src={user.profilePhoto} alt={user.name} />
                          ) : (
                            <FaUserAstronaut />
                          )}
                          <div>
                            <strong>{user?.name || "User"}</strong>
                            <span>{user?.email || "user@example.com"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="dropdown-divider"></div>
                      <button className="dropdown-item" onClick={handleProfileNavigate}>
                        <IoPersonOutline />
                        <span>My Profile</span>
                      </button>
                      <button className="dropdown-item logout" onClick={handleLogout}>
                        <IoLogOutOutline />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                className="login-btn"
                onClick={handleAuthClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaUserCircle />
                <span>Login</span>
              </motion.button>
            )}
          </li>
        </ul>

        {/* Mobile Icons */}
        <div className="mobile-icons">
          {isLoggedIn ? (
            <div className="user-menu mobile" ref={userMenuRef}>
              <button
                className="mobile-user-btn"
                onClick={handleAuthClick}
              >
                {user?.profilePhoto ? (
                  <img src={user.profilePhoto} alt={user.name} className="mobile-avatar" />
                ) : (
                  <FaUserAstronaut size={24} />
                )}
              </button>
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    className="user-dropdown mobile-dropdown"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <button className="dropdown-item" onClick={handleProfileNavigate}>
                      <IoPersonOutline />
                      <span>Profile</span>
                    </button>
                    <button className="dropdown-item logout" onClick={handleLogout}>
                      <IoLogOutOutline />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button className="mobile-login-btn" onClick={handleAuthClick}>
              <FaUserCircle size={24} />
            </button>
          )}

          <motion.button 
            className={`hamburger-button ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            whileTap={{ scale: 0.9 }}
          >
            <span></span>
            <span></span>
            <span></span>
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              className="backdrop"
              onClick={closeMobileMenu}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.aside
              className="mobile-menu"
              variants={sideMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="mobile-menu-header">
                <div className="mobile-logo">
                  <GiSun />
                  <span>KalpJyotish</span>
                </div>
                <motion.button 
                  onClick={closeMobileMenu}
                  whileTap={{ scale: 0.9 }}
                  className="close-menu-btn"
                >
                  <IoClose size={28} />
                </motion.button>
              </div>

              <div className="mobile-menu-content">
                <ul className="mobile-nav-items">
                  {navItems.map((item, index) => (
                    <motion.li
                      key={item.to}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <NavLink to={item.to} onClick={closeMobileMenu}>
                        <span className="mobile-nav-icon">{item.icon}</span>
                        <span className="mobile-nav-text">{item.text}</span>
                      </NavLink>
                    </motion.li>
                  ))}
                </ul>

                <div className="mobile-menu-footer">
                  <div className="footer-cosmic-text">
                    <GiMoon />
                    <span>वसुधैव कुटुम्बकम्</span>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <AuthModal
            onClose={closeAuthModal}
            isLoggedIn={isLoggedIn}
            user={user}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;