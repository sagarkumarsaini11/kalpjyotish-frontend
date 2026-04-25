// src/components/SignupModal.jsx
import React, { useState, useRef, useEffect, useMemo, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoginUserMutation, useSendOtpMutation, useSignupUserMutation, useVerifyOtpMutation } from '../services/backendApi';

// --- LIBRARY IMPORTS ---
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

// --- ICONS ---
import { IoClose } from 'react-icons/io5';
import {
  MdEmail, MdLock, MdPerson, MdCalendarToday, MdAccessTime,
  MdLocationCity, MdPhone, MdArrowForward, MdExpandMore, MdUploadFile,
  MdVerified, MdCheckCircle, MdSecurity
} from 'react-icons/md';
import { FaVenusMars, FaStar, FaMoon, FaSun, FaShieldAlt } from "react-icons/fa";
import { FiShield, FiCheck } from 'react-icons/fi';

// --- CSS IMPORT ---
import './SignupModal.css';

// ====================================================================
// --- INTERNAL HELPER & STEP COMPONENTS ---
// ====================================================================

// --- CustomSelect Component ---
const CustomSelect = ({ icon, placeholder, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => { 
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false); 
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleSelect = (optionValue) => { onChange(optionValue); setIsOpen(false); };
  
  return (
    <div className="custom-select-container" ref={dropdownRef}>
      <button type="button" className={`custom-select-trigger ${value ? 'has-value' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        {icon} <span>{value || placeholder}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}><MdExpandMore className="expand-icon" /></motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.ul className="custom-select-options" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <li className="placeholder-option" onClick={() => handleSelect('')}>{placeholder}</li>
            {options.map((option) => ( 
              <li key={option} className={`option-item ${option === value ? 'selected' : ''}`} onClick={() => handleSelect(option)}>
                {option}
                {option === value && <FiCheck className="check-icon" />}
              </li> 
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Custom Time Picker ---
const CustomTimePicker = ({ icon, placeholder, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const listRef = useRef(null);
  const timeOptions = useMemo(() => {
    const times = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 15) {
        const hour12 = h % 12 === 0 ? 12 : h % 12;
        const minute = m.toString().padStart(2, '0');
        const ampm = h < 12 ? 'AM' : 'PM';
        times.push(`${hour12}:${minute} ${ampm}`);
      }
    }
    return times;
  }, []);
  
  useEffect(() => {
    const handleClickOutside = (event) => { 
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false); 
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  useEffect(() => {
    if (isOpen && value && listRef.current) {
      const selectedElement = listRef.current.querySelector('.selected');
      if (selectedElement) { selectedElement.scrollIntoView({ block: 'center' }); }
    }
  }, [isOpen, value]);
  
  const handleSelect = (timeValue) => { onChange(timeValue); setIsOpen(false); };
  
  return (
    <div className="custom-select-container" ref={dropdownRef}>
      <button type="button" className={`custom-select-trigger ${value ? 'has-value' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        {icon} <span>{value || placeholder}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}><MdExpandMore className="expand-icon" /></motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div className="custom-time-picker-options" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="custom-time-picker-header">
              <FaMoon className="header-icon" />
              <span>Select Time of Birth</span>
              <FaSun className="header-icon" />
            </div>
            <ul ref={listRef} className="custom-time-picker-list">
              {timeOptions.map((time) => (
                <li key={time} className={`option-item ${time === value ? 'selected' : ''}`} onClick={() => handleSelect(time)}>
                  {time}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Custom Input for DatePicker ---
const DatePickerCustomInput = forwardRef(({ value, onClick, icon, placeholder }, ref) => (
  <div className={`form-group custom-datepicker-input ${value ? 'has-value' : ''}`} onClick={onClick} ref={ref}>
    {icon}
    <input type="text" value={value} readOnly placeholder={placeholder} />
  </div>
));

// --- Step Components ---
const AuthStepOne = ({ authMode, setAuthMode, email, setEmail, password, setPassword, handleSendOtp, handleLogin, isLoading, error }) => (
  <AnimatePresence mode="wait">
    {authMode === 'signup' ? (
      <motion.div key="signup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className="step-icon">
          <FaStar />
        </div>
        <h2>Begin Your Journey</h2>
        <p>Create your account to unlock cosmic insights</p>
        <form onSubmit={handleSendOtp}>
          <div className="form-group">
            <MdEmail className="input-icon" />
            <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className="modal-btn" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Verification Code'}
            {!isLoading && <MdArrowForward />}
          </button>
        </form>
        <p className="auth-toggle">
          Already have an account? <span onClick={() => setAuthMode('login')}>Sign In</span>
        </p>
      </motion.div>
    ) : (
      <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className="step-icon">
          <FaShieldAlt />
        </div>
        <h2>Welcome Back!</h2>
        <p>Sign in to continue your cosmic journey</p>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <MdEmail className="input-icon" />
            <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <MdLock className="input-icon" />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className="modal-btn" disabled={isLoading}>
            {isLoading ? 'Logging In...' : 'Sign In'}
            {!isLoading && <MdArrowForward />}
          </button>
        </form>
        <p className="auth-toggle">
          Don't have an account? <span onClick={() => setAuthMode('signup')}>Create Account</span>
        </p>
      </motion.div>
    )}
  </AnimatePresence>
);

const AuthStepTwo = ({ email, otp, setOtp, handleVerifyOtp, changeStep, isLoading, error }) => (
  <>
    <div className="step-icon">
      <MdVerified />
    </div>
    <h2>Verify Your Email</h2>
    <p>A 6-digit code was sent to <strong>{email}</strong></p>
    <form onSubmit={handleVerifyOtp}>
      <div className="form-group otp-group">
        <MdLock className="input-icon" />
        <input 
          type="text" 
          placeholder="Enter 6-digit OTP" 
          value={otp} 
          onChange={(e) => setOtp(e.target.value)} 
          required 
          maxLength="6"
          pattern="[0-9]{6}"
        />
        <div className="otp-inputs">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`otp-digit ${otp[i] ? 'filled' : ''}`}>
              {otp[i] || '●'}
            </div>
          ))}
        </div>
      </div>
      {error && <p className="error-msg">{error}</p>}
      <button type="submit" className="modal-btn" disabled={isLoading}>
        {isLoading ? 'Verifying...' : 'Verify & Continue'}
        {!isLoading && <MdCheckCircle />}
      </button>
    </form>
    <a className="back-link" onClick={() => changeStep(1, -1)}>← Back to Email</a>
  </>
);

const AuthStepThree = ({ email, formData, setFormData, handleInputChange, handleSelectChange, handleFileChange, profilePreview, handleSignup, isLoading, error }) => (
  <>
    <div className="step-icon">
      <MdPerson />
    </div>
    <h2>Complete Your Profile</h2>
    <p>Tell us more about yourself</p>
    <form onSubmit={handleSignup} className="details-form">
      <div className="form-group">
        <MdPerson className="input-icon" />
        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} required />
      </div>
      <div className="form-group">
        <MdEmail className="input-icon" />
        <input type="email" name="email" value={email} disabled className="disabled-input" />
      </div>
      <div className="form-group">
        <MdPhone className="input-icon" />
        <input type="tel" name="mobileNo" placeholder="Mobile Number" value={formData.mobileNo} onChange={handleInputChange} required />
      </div>
      <div className="form-group">
        <MdLock className="input-icon" />
        <input type="password" name="password" placeholder="Create Password" value={formData.password} onChange={handleInputChange} required minLength={6} />
      </div>
      <div className="form-group">
        <MdLocationCity className="input-icon" />
        <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleInputChange} required />
      </div>
      <div className="form-group">
        <CustomSelect icon={<FaVenusMars className="input-icon" />} placeholder="Select Gender" options={['Male', 'Female', 'Other']} value={formData.gender} onChange={(value) => handleSelectChange('gender', value)} />
      </div>
      <div className="form-group">
        <DatePicker 
          selected={formData.dateOfBirth} 
          onChange={(date) => setFormData({ ...formData, dateOfBirth: date })} 
          customInput={<DatePickerCustomInput icon={<MdCalendarToday className="input-icon" />} placeholder="Date of Birth" />} 
          dateFormat="dd/MM/yyyy" 
          maxDate={new Date()} 
          showYearDropdown 
          scrollableYearDropdown 
          yearDropdownItemNumber={80} 
          required 
        />
      </div>
      <div className="form-group">
        <CustomTimePicker icon={<MdAccessTime className="input-icon" />} placeholder="Time of Birth" value={formData.timeOfBirth} onChange={(value) => handleSelectChange('timeOfBirth', value)} />
      </div>
      <div className="form-group file-group">
        <div className="upload-box-label">
          <MdUploadFile /> Upload Profile Picture
        </div>
        <div className="file-input-wrapper">
          <input id="profile-upload" type="file" name="profile" accept="image/*" onChange={handleFileChange} />
          <label htmlFor="profile-upload" className="file-choose-btn">Choose File</label>
          <span className="file-name-display">{formData.profile?.name || "No file chosen"}</span>
        </div>
        {profilePreview && <img src={profilePreview} alt="Preview" className="profile-preview" />}
      </div>
      {error && <p className="error-msg">{error}</p>}
      <button type="submit" className="modal-btn" disabled={isLoading}>
        <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
        {!isLoading && <MdArrowForward />}
      </button>
    </form>
  </>
);

const AuthStepFour = ({ authMode }) => (
  <div className="success-message">
    <div className="success-animation">
      <motion.div 
        className="success-circle"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <FiCheck />
      </motion.div>
    </div>
    <h2>Welcome to KalpJyotish!</h2>
    <p>{authMode === 'login' ? 'You have successfully logged in.' : 'Your account has been created successfully.'}</p>
    <p className="success-note">You can now explore our astrological services</p>
  </div>
);

// ====================================================================
// --- MAIN MODAL COMPONENT ---
// ====================================================================

const SignupModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [authMode, setAuthMode] = useState('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [formData, setFormData] = useState({ 
    name: '', gender: '', city: '', mobileNo: '', password: '', 
    profile: null, dateOfBirth: null, timeOfBirth: '' 
  });
  const [profilePreview, setProfilePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [sendOtpMutation] = useSendOtpMutation();
  const [verifyOtpMutation] = useVerifyOtpMutation();
  const [loginUserMutation] = useLoginUserMutation();
  const [signupUserMutation] = useSignupUserMutation();

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSelectChange = (name, value) => setFormData({ ...formData, [name]: value });
  const handleFileChange = (e) => { 
    const file = e.target.files[0]; 
    if (file) { 
      setFormData({ ...formData, profile: file }); 
      setProfilePreview(URL.createObjectURL(file)); 
    } 
  };
  
  const resetState = () => { 
    setStep(1); 
    setAuthMode('signup'); 
    setEmail(''); 
    setPassword(''); 
    setOtp(''); 
    setFormData({ name: '', gender: '', city: '', mobileNo: '', password: '', profile: null, dateOfBirth: null, timeOfBirth: '' }); 
    setProfilePreview(null); 
    setError(''); 
    setIsLoading(false); 
    onClose(); 
  };
  
  const changeStep = (newStep, newDirection = 1) => { 
    setDirection(newDirection); 
    setStep(newStep); 
  };
  
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await sendOtpMutation({ email }).unwrap();
      changeStep(2);
    } catch (err) {
      setError(err?.data?.message || 'Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await verifyOtpMutation({ email, otp }).unwrap();
      changeStep(3);
    } catch (err) {
      setError(err?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await loginUserMutation({ email, password }).unwrap();
      const token = res?.token;
      if (token) {
        localStorage.setItem('authToken', token);
      }
      if (res?.data) {
        localStorage.setItem('user', JSON.stringify(res.data));
      }
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('authRole', 'user');
      changeStep(4);
      setTimeout(resetState, 3000);
    } catch (err) {
      setError(err?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const submissionData = new FormData();
    const formattedData = {
      ...formData,
      dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth.toISOString().split('T')[0] : '',
    };
    submissionData.append('email', email);
    for (const key in formattedData) {
      if (key !== 'profile') submissionData.append(key, formattedData[key]);
    }
    if (formData.profile) submissionData.append('profile', formData.profile);

    try {
      const res = await signupUserMutation(submissionData).unwrap();
      const token = res?.token;
      if (token) {
        const expiryTime = new Date().getTime() + 2 * 60 * 60 * 1000;
        localStorage.setItem('authToken', token);
        localStorage.setItem('tokenExpiry', expiryTime);
      }
      if (res?.data) {
        localStorage.setItem('user', JSON.stringify(res.data));
      }
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('authRole', 'user');
      changeStep(4);
      setTimeout(resetState, 3000);
    } catch (err) {
      setError(err?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderStep = () => { 
    switch (step) { 
      case 1: return <AuthStepOne {...{ authMode, setAuthMode, email, setEmail, password, setPassword, handleSendOtp, handleLogin, isLoading, error }} />; 
      case 2: return <AuthStepTwo {...{ email, otp, setOtp, handleVerifyOtp, changeStep, isLoading, error }} />; 
      case 3: return <AuthStepThree {...{ email, formData, setFormData, handleInputChange, handleSelectChange, handleFileChange, profilePreview, handleSignup, isLoading, error }} />; 
      case 4: return <AuthStepFour {...{ authMode }} />; 
      default: return null; 
    } 
  };
  
  const modalVariants = { 
    hidden: { opacity: 0, scale: 0.95 }, 
    visible: { opacity: 1, scale: 1, transition: { type: "spring", damping: 25, stiffness: 180 } }, 
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }, 
  };
  
  const stepVariants = { 
    enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }), 
    center: { x: 0, opacity: 1, transition: { type: "tween", ease: "circOut", duration: 0.5 } }, 
    exit: (direction) => ({ x: direction < 0 ? 300 : -300, opacity: 0, transition: { type: "tween", ease: "circIn", duration: 0.3 } }), 
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="signup-modal-backdrop" onClick={resetState}>
          <motion.div className="signup-modal-content" variants={modalVariants} initial="hidden" animate="visible" exit="exit" onClick={(e) => e.stopPropagation()}>
            
            {/* Cosmic Background Effect */}
            <div className="modal-cosmic-bg">
              <div className="modal-star"></div>
              <div className="modal-star"></div>
              <div className="modal-star"></div>
              <div className="modal-star"></div>
            </div>
            
            <button className="modal-close-btn" onClick={resetState}>
              <IoClose />
            </button>
            
            <div className="signup-modal-body">
              {/* Progress Indicator */}
              {step < 4 && (
                <div className="modal-progress">
                  <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                    <span>1</span>
                    <label>Email</label>
                  </div>
                  <div className={`progress-line ${step >= 2 ? 'active' : ''}`}></div>
                  <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                    <span>2</span>
                    <label>Verify</label>
                  </div>
                  <div className={`progress-line ${step >= 3 ? 'active' : ''}`}></div>
                  <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
                    <span>3</span>
                    <label>Profile</label>
                  </div>
                </div>
              )}
              
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div key={step} custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit">
                  {renderStep()}
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Security Note */}
            {step < 4 && (
              <div className="modal-footer-note">
                <FiShield />
                <span>Your information is secure and protected</span>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SignupModal;