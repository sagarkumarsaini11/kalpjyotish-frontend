// src/pages/UserProfile.jsx - COMPLETE FIXED VERSION (No FiHistory)
import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
// IMPORTANT: Only use icons that exist in react-icons/fi
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiCalendar, 
  FiClock,
  FiStar, 
  FiLogOut, 
  FiMenu, 
  FiX, 
  FiDollarSign, 
  FiTrendingUp,
  FiCheckCircle, 
  FiMessageCircle, 
  FiPhoneCall, 
  FiVideo,
  FiCreditCard, 
  FiList, 
  FiEdit2, 
  FiMap, 
  FiBarChart2,
  FiBookOpen,
  FiSettings,
  FiHelpCircle
} from 'react-icons/fi';
import styles from './UserProfile.module.css';
import {
  useGetUserCallHistoryQuery,
  useGetUserProfileQuery,
  useGetWalletSummaryQuery,
} from '../services/backendApi';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const candidateUserId =
    storedUser?._id ||
    storedUser?.id ||
    storedUser?.user?._id ||
    storedUser?.user?.id ||
    localStorage.getItem('userId') ||
    localStorage.getItem('backendUserId') ||
    '';
  const userId = /^[a-fA-F0-9]{24}$/.test(String(candidateUserId)) ? candidateUserId : '';

  const { data: profile, isLoading: profileLoading, refetch: refetchProfile } = useGetUserProfileQuery(userId, { skip: !userId });
  const { data: walletSummary, isLoading: walletLoading, refetch: refetchWallet } = useGetWalletSummaryQuery(userId, { skip: !userId });
  const { data: callHistory = [], isLoading: historyLoading, refetch: refetchHistory } = useGetUserCallHistoryQuery(userId, { skip: !userId });

  const userData = useMemo(
    () => ({
      name: profile?.name || storedUser?.name || 'User',
      email: profile?.email || storedUser?.email || '-',
      phone: profile?.mobileNo || storedUser?.mobileNo || '-',
      gender: profile?.gender || '-',
      dateOfBirth: profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : '-',
      timeOfBirth: profile?.timeOfBirth || '-',
      placeOfBirth: profile?.placeOfBirth || '-',
      address: profile?.address || '-',
      profileImage: profile?.profile || storedUser?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || storedUser?.name || 'User')}&background=ffd700&color=1a0a2e&bold=true`,
    }),
    [profile, storedUser]
  );

  const historyItems = useMemo(
    () =>
      callHistory.map((item) => {
        const createdAt = new Date(item.createdAt);
        const mins = Number(item.duration || 0) / 60000;
        const serviceType = item.callType === 'video' ? 'Video Call' : item.callType === 'voice' ? 'Audio Call' : 'Chat';
        return {
          id: item._id,
          astrologer: item?.receiverId?.name || 'Astrologer',
          astrologerImage: item?.receiverId?.profilePhoto || null,
          date: createdAt.toLocaleDateString(),
          time: createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          duration: `${Math.max(0, mins).toFixed(1)} min`,
          topic: `${serviceType} Consultation`,
          amount: Number(item.totalEarning || 0).toFixed(2),
          status: item.status,
          serviceType,
        };
      }),
    [callHistory]
  );

  const walletBalance = Number(walletSummary?.walletBalance || 0);
  const freeMinutes = Number(walletSummary?.freeMinutesRemaining || 0);
  const totalSpent = Number(walletSummary?.totalSpent || 0);

  useEffect(() => {
    if (userId) {
      refetchProfile();
      refetchWallet();
      refetchHistory();
    }
  }, [userId, refetchProfile, refetchWallet, refetchHistory]);

  if (!userId) {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.contentBody}>
          <div className={styles.loginRequired}>
            <FiUser className={styles.loginIcon} />
            <h3>Please Login First</h3>
            <p>You need to be logged in to access your profile.</p>
            <button onClick={() => navigate('/')} className={styles.loginBtn}>Go to Home</button>
          </div>
        </div>
      </div>
    );
  }

  const loading = profileLoading || walletLoading || historyLoading;

  const getStatusIcon = (status) => {
    if (status === 'completed') return <FiCheckCircle className={styles.statusCompleted} />;
    return <FiClock className={styles.statusPending} />;
  };

  const getServiceIcon = (type) => {
    if (type === 'Video Call') return <FiVideo />;
    if (type === 'Audio Call') return <FiPhoneCall />;
    return <FiMessageCircle />;
  };

  const renderProfileTab = () => (
    <motion.div 
      className={styles.profileTab}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.profileHeader}>
        <div className={styles.avatarSection}>
          <div className={styles.avatarWrapper}>
            <div className={styles.avatarRing}></div>
            <img src={userData.profileImage} alt='Profile' className={styles.profileAvatar} />
          </div>
          <button className={styles.uploadBtn}>
            <FiEdit2 /> Change Photo
          </button>
        </div>
        <button className={styles.editProfileBtn}>
          <FiEdit2 /> Edit Profile
        </button>
      </div>

      <div className={styles.profileDetails}>
        <h3>Personal Information</h3>
        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <FiUser className={styles.detailIcon} />
            <div>
              <label>Full Name</label>
              <p>{userData.name}</p>
            </div>
          </div>
          <div className={styles.detailItem}>
            <FiMail className={styles.detailIcon} />
            <div>
              <label>Email</label>
              <p>{userData.email}</p>
            </div>
          </div>
          <div className={styles.detailItem}>
            <FiPhone className={styles.detailIcon} />
            <div>
              <label>Phone Number</label>
              <p>{userData.phone}</p>
            </div>
          </div>
          <div className={styles.detailItem}>
            <FiUser className={styles.detailIcon} />
            <div>
              <label>Gender</label>
              <p>{userData.gender}</p>
            </div>
          </div>
        </div>

        <h3>Birth Details</h3>
        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <FiCalendar className={styles.detailIcon} />
            <div>
              <label>Date of Birth</label>
              <p>{userData.dateOfBirth}</p>
            </div>
          </div>
          <div className={styles.detailItem}>
            <FiClock className={styles.detailIcon} />
            <div>
              <label>Time of Birth</label>
              <p>{userData.timeOfBirth}</p>
            </div>
          </div>
          <div className={styles.detailItem}>
            <FiMap className={styles.detailIcon} />
            <div>
              <label>Place of Birth</label>
              <p>{userData.placeOfBirth}</p>
            </div>
          </div>
        </div>

        <h3>Address</h3>
        <div className={styles.detailsGrid}>
          <div className={`${styles.detailItem} ${styles.fullWidth}`}>
            <FiMapPin className={styles.detailIcon} />
            <div>
              <label>Full Address</label>
              <p>{userData.address}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderChatHistoryTab = () => (
    <motion.div 
      className={styles.chatHistoryTab}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.historyHeader}>
        <h3>Consultation History</h3>
        <p>Total: {historyItems.length} consultations</p>
      </div>
      <div className={styles.historyList}>
        {historyItems.length === 0 ? (
          <div className={styles.emptyState}>
            <FiList className={styles.emptyIcon} />
            <h4>No consultations yet</h4>
            <p>Book your first consultation with our expert astrologers</p>
            <button onClick={() => navigate('/astro-connect')} className={styles.bookBtn}>
              Book Now
            </button>
          </div>
        ) : null}
        {historyItems.map((chat) => (
          <motion.div 
            key={chat.id} 
            className={styles.historyCard}
            whileHover={{ y: -3 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className={styles.historyCardHeader}>
              <div className={styles.astrologerInfo}>
                <div className={styles.astrologerAvatar}>
                  {chat.astrologerImage ? (
                    <img src={chat.astrologerImage} alt={chat.astrologer} />
                  ) : (
                    <span>{chat.astrologer.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <h4>{chat.astrologer}</h4>
                  <p className={styles.topic}>{chat.topic}</p>
                </div>
              </div>
              <div className={styles.amount}>₹{chat.amount}</div>
            </div>
            <div className={styles.historyCardBody}>
              <div className={styles.historyDetail}>
                <FiCalendar />
                <span>{chat.date}</span>
              </div>
              <div className={styles.historyDetail}>
                <FiClock />
                <span>{chat.time}</span>
              </div>
              <div className={styles.historyDetail}>
                <FiClock />
                <span>{chat.duration}</span>
              </div>
              <div className={styles.historyDetail}>
                {getStatusIcon(chat.status)}
                <span className={chat.status === 'completed' ? styles.statusSuccess : styles.statusPending}>
                  {chat.status}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderWalletTab = () => (
    <motion.div 
      className={styles.walletTab}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.walletBalance}>
        <div className={styles.balanceCard}>
          <FiCreditCard className={styles.balanceIcon} />
          <h3>Wallet Balance</h3>
          <h1>₹{walletBalance.toFixed(2)}</h1>
          <p>Free Minutes: {freeMinutes.toFixed(2)}</p>
          <button className={styles.rechargeBtn} onClick={() => navigate('/astro-connect')}>
            Use Credits
          </button>
        </div>

        <div className={styles.walletStats}>
          <div className={styles.statBox}>
            <FiBarChart2 className={styles.statIcon} />
            <div>
              <p>Total Spent</p>
              <h4>₹{totalSpent.toFixed(2)}</h4>
            </div>
          </div>
          <div className={styles.statBox}>
            <FiStar className={styles.statIcon} />
            <div>
              <p>Consultations</p>
              <h4>{historyItems.length}</h4>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.transactionsSection}>
        <h3>Recent Transactions</h3>
        <div className={styles.transactionsList}>
          {historyItems.length === 0 ? (
            <div className={styles.emptyState}>
              <FiDollarSign className={styles.emptyIcon} />
              <h4>No transactions yet</h4>
              <p>Your transaction history will appear here</p>
            </div>
          ) : null}
          {historyItems.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className={styles.transactionItem}>
              <div className={styles.transactionIcon}>
                {getServiceIcon(transaction.serviceType)}
              </div>
              <div className={styles.transactionDetails}>
                <h4>{transaction.astrologer}</h4>
                <p>{transaction.date} • {transaction.duration}</p>
              </div>
              <div className={`${styles.transactionAmount} ${styles.debit}`}>
                -₹{transaction.amount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className={styles.profileContainer}>
      <aside className={`${styles.profileSidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
        <button className={styles.closeSidebar} onClick={() => setIsSidebarOpen(false)}>
          <FiX />
        </button>
        
        <div className={styles.userCard}>
          <div className={styles.userAvatarWrapper}>
            <img src={userData.profileImage} alt='User' className={styles.userAvatar} />
            <div className={styles.userStatus}></div>
          </div>
          <h3>{userData.name}</h3>
          <p>{userData.email}</p>
          <div className={styles.userCredits}>
            <FiCreditCard />
            <span>₹{walletBalance.toFixed(2)} Credits</span>
          </div>
        </div>

        <nav className={styles.profileNav}>
          <button 
            className={`${styles.navItem} ${activeTab === 'profile' ? styles.active : ''}`} 
            onClick={() => { setActiveTab('profile'); setIsSidebarOpen(false); }}
          >
            <FiUser className={styles.navIcon} />
            <span>My Profile</span>
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'history' ? styles.active : ''}`} 
            onClick={() => { setActiveTab('history'); setIsSidebarOpen(false); }}
          >
            <FiList className={styles.navIcon} />
            <span>History</span>
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'wallet' ? styles.active : ''}`} 
            onClick={() => { setActiveTab('wallet'); setIsSidebarOpen(false); }}
          >
            <FiCreditCard className={styles.navIcon} />
            <span>Credits</span>
          </button>
        </nav>

        <button
          className={styles.logoutBtn}
          onClick={() => {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('authToken');
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('authRole');
            localStorage.removeItem('userId');
            localStorage.removeItem('backendUserId');
            navigate('/');
          }}
        >
          <FiLogOut className={styles.navIcon} />
          <span>Logout</span>
        </button>
      </aside>

      <div className={styles.profileContent}>
        <div className={styles.contentHeader}>
          <button className={styles.hamburger} onClick={() => setIsSidebarOpen(true)}>
            <FiMenu />
          </button>
          <h1>
            {activeTab === 'profile' && 'My Profile'}
            {activeTab === 'history' && 'Consultation History'}
            {activeTab === 'wallet' && 'My Credits'}
          </h1>
        </div>

        <div className={styles.contentBody}>
          {loading ? (
            <div className={styles.loaderContainer}>
              <div className={styles.loaderRing}></div>
              <div className={styles.loaderRing}></div>
              <div className={styles.loaderRing}></div>
              <p>Loading your profile...</p>
            </div>
          ) : (
            <>
              {activeTab === 'profile' && renderProfileTab()}
              {activeTab === 'history' && renderChatHistoryTab()}
              {activeTab === 'wallet' && renderWalletTab()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;