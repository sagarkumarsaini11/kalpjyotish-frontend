import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const { data: profile, isLoading: profileLoading } = useGetUserProfileQuery(userId, { skip: !userId });
  const { data: walletSummary, isLoading: walletLoading } = useGetWalletSummaryQuery(userId, { skip: !userId });
  const { data: callHistory = [], isLoading: historyLoading } = useGetUserCallHistoryQuery(userId, { skip: !userId });

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
      profileImage: profile?.profile || storedUser?.profileImage || '/assets/user-avatar.png',
    }),
    [profile, storedUser]
  );

  const historyItems = useMemo(
    () =>
      callHistory.map((item) => {
        const createdAt = new Date(item.createdAt);
        const mins = Number(item.duration || 0) / 60000;
        return {
          id: item._id,
          astrologer: item?.receiverId?.name || 'Astrologer',
          date: createdAt.toLocaleDateString(),
          time: createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          duration: `${Math.max(0, mins).toFixed(1)} min`,
          topic: `${item.callType || 'session'} consultation`,
          amount: Number(item.totalEarning || 0).toFixed(2),
          status: item.status,
        };
      }),
    [callHistory]
  );

  const walletBalance = Number(walletSummary?.walletBalance || 0);
  const freeMinutes = Number(walletSummary?.freeMinutesRemaining || 0);

  if (!userId) {
    return (
      <div className={styles.profileContainer}>
        <div className={styles.profileContent}>
          <div className={styles.contentBody}>Please login first.</div>
        </div>
      </div>
    );
  }

  const loading = profileLoading || walletLoading || historyLoading;

  const renderProfileTab = () => (
    <div className={styles.profileTab}>
      <div className={styles.profileHeader}>
        <div className={styles.avatarSection}>
          <img src={userData.profileImage} alt='Profile' className={styles.profileAvatar} />
        </div>
      </div>

      <div className={styles.profileDetails}>
        <h3>Personal Information</h3>
        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}><label>Full Name</label><p>{userData.name}</p></div>
          <div className={styles.detailItem}><label>Email</label><p>{userData.email}</p></div>
          <div className={styles.detailItem}><label>Phone Number</label><p>{userData.phone}</p></div>
          <div className={styles.detailItem}><label>Gender</label><p>{userData.gender}</p></div>
        </div>

        <h3>Birth Details</h3>
        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}><label>Date of Birth</label><p>{userData.dateOfBirth}</p></div>
          <div className={styles.detailItem}><label>Time of Birth</label><p>{userData.timeOfBirth}</p></div>
          <div className={styles.detailItem}><label>Place of Birth</label><p>{userData.placeOfBirth}</p></div>
        </div>

        <h3>Address</h3>
        <div className={styles.detailsGrid}>
          <div className={`${styles.detailItem} ${styles.fullWidth}`}><label>Full Address</label><p>{userData.address}</p></div>
        </div>
      </div>
    </div>
  );

  const renderChatHistoryTab = () => (
    <div className={styles.chatHistoryTab}>
      <div className={styles.historyHeader}><p>Total Consultations: {historyItems.length}</p></div>
      <div className={styles.historyList}>
        {historyItems.length === 0 ? <div className={styles.historyCard}>No consultation history found.</div> : null}
        {historyItems.map((chat) => (
          <div key={chat.id} className={styles.historyCard}>
            <div className={styles.historyCardHeader}>
              <div className={styles.astrologerInfo}>
                <div className={styles.astrologerAvatar}>{chat.astrologer.charAt(0)}</div>
                <div>
                  <h4>{chat.astrologer}</h4>
                  <p className={styles.topic}>{chat.topic}</p>
                </div>
              </div>
              <div className={styles.amount}>?{chat.amount}</div>
            </div>
            <div className={styles.historyCardBody}>
              <div className={styles.historyDetail}><span className={styles.icon}></span><span>{chat.date}</span></div>
              <div className={styles.historyDetail}><span className={styles.icon}></span><span>{chat.time}</span></div>
              <div className={styles.historyDetail}><span className={styles.icon}></span><span>{chat.duration}</span></div>
              <div className={styles.historyDetail}><span className={styles.icon}></span><span>{chat.status}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderWalletTab = () => (
    <div className={styles.walletTab}>
      <div className={styles.walletBalance}>
        <div className={styles.balanceCard}>
          <h3>Wallet Balance</h3>
          <h1>₹{walletBalance.toFixed(2)}</h1>
          <p>Free Minutes: {freeMinutes.toFixed(2)}</p>
          <button className={styles.rechargeBtn} onClick={() => navigate('/astro-connect')}>Use Credits</button>
        </div>

        <div className={styles.walletStats}>
          <div className={styles.statBox}><span className={styles.statIcon}></span><div><p>Credits</p><h4>{walletBalance.toFixed(2)}</h4></div></div>
          <div className={styles.statBox}><span className={styles.statIcon}></span><div><p>Free Minutes</p><h4>{freeMinutes.toFixed(2)}</h4></div></div>
        </div>
      </div>

      <div className={styles.transactionsSection}>
        <h3>Usage History</h3>
        <div className={styles.transactionsList}>
          {historyItems.length === 0 ? <div className={styles.transactionItem}>No usage history available.</div> : null}
          {historyItems.map((transaction) => (
            <div key={transaction.id} className={styles.transactionItem}>
              <div className={styles.transactionIcon}></div>
              <div className={styles.transactionDetails}>
                <h4>{transaction.astrologer}</h4>
                <p>{transaction.date} at {transaction.time}</p>
              </div>
              <div className={`${styles.transactionAmount} ${styles.debit}`}>-{transaction.amount}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.profileContainer}>
      <div className={`${styles.profileSidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
        <button
          className={styles.closeSidebar}
          onClick={() => setIsSidebarOpen(false)}
        >
          ✕
        </button>
        <div className={styles.userCard}>
          <img src={userData.profileImage} alt='User' className={styles.userAvatar} />
          <h3>{userData.name}</h3>
          <p>{userData.email}</p>
          <p>Credits: {walletBalance.toFixed(2)}</p>
        </div>

        <nav className={styles.profileNav}>
          <button className={`${styles.navItem} ${activeTab === 'profile' ? styles.active : ''}`} onClick={() => setActiveTab('profile')}>
            <span className={styles.navIcon}></span>
            My Profile
          </button>
          <button className={`${styles.navItem} ${activeTab === 'history' ? styles.active : ''}`} onClick={() => setActiveTab('history')}>
            <span className={styles.navIcon}></span>
            History
          </button>
          <button className={`${styles.navItem} ${activeTab === 'wallet' ? styles.active : ''}`} onClick={() => setActiveTab('wallet')}>
            <span className={styles.navIcon}></span>
            Credits
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
          {/* <span className={styles.navIcon}>??</span> */}
          Logout
        </button>
      </div>

      <div className={styles.profileContent}>
        <div className={styles.contentHeader}>
          <button
            className={styles.hamburger}
            onClick={() => setIsSidebarOpen(prev => !prev)}  // ← toggle
          >
            ☰
          </button>
          <h1>
            {activeTab === 'profile' && 'My Profile'}
            {activeTab === 'history' && 'Consultation History'}
            {activeTab === 'wallet' && 'My Credits'}
          </h1>
        </div>

        <div className={styles.contentBody}>
          {loading ? <div>Loading...</div> : null}
          {!loading && activeTab === 'profile' && renderProfileTab()}
          {!loading && activeTab === 'history' && renderChatHistoryTab()}
          {!loading && activeTab === 'wallet' && renderWalletTab()}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
