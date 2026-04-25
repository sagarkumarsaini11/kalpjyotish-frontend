import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/autoplay';

// Import Components and Pages
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import DailyHoroscope from './components/DailyHoroscope';
import AstroShopSection from './components/AstroShopSection';
import PoojaSection from './components/PoojaSection';
import PoojaDetails from "./pages/PoojaDetails";
import ZodiacSigns from './components/ZodiacExplorer';
import SignupModal from './components/SignupModal';
import AstrologerList from './pages/AstrologerList';
import Profile from './pages/Profile';
import Contact from './components/Contact';
import Kundali from './pages/Kundali';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AstrologerLogin from "./pages/AstrologerLogin";
import AstrologerDashboard from './pages/AstrologerDashboard';
import UserProfile from './pages/UserProfile';
import CompleteUserProfile from './components/CompleteUserProfile';
import LandingPage from './pages/LandingPage';

function App() {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const openSignupModal = () => setIsSignupModalOpen(true);
  const closeSignupModal = () => setIsSignupModalOpen(false);

  return (
    <Router>
      <SignupModal isOpen={isSignupModalOpen} onClose={closeSignupModal} />

      <Navbar onSignupClick={openSignupModal} />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/astrologer-login" element={<AstrologerLogin />} />
          <Route path="/astrologer-dashboard" element={<AstrologerDashboard />} />
          <Route path="/horoscope" element={<DailyHoroscope />} />
          <Route path="/shop" element={<AstroShopSection />} />
          <Route path="/pooja" element={<PoojaSection />} /> 
          <Route path="/pooja/:id" element={<PoojaDetails />} />
          <Route path="/zodiac-signs" element={<ZodiacSigns />} />
          <Route path="/astro-connect" element={<AstrologerList />} />
          <Route path="/Contact-us" element={<LandingPage/>} />
           <Route path="/Landing" element={<LandingPage/>} />
          <Route path="/remedies" element={<Kundali/>} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path ="/complete-UserProfile" element={<CompleteUserProfile/>} />

        </Routes>
      </main>
    </Router>
  );
}

export default App;










