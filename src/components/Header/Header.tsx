import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';
import shoppingCartIcon from '../../assets/shopping-cart.png';
import houseIcon from '../../assets/house.png';
import profileIcon from '../../assets/profile.png';
import userIcon from '../../assets/user.png';

interface HeaderProps {
  userName?: string;
  showNavigation?: boolean;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ userName, showNavigation = false, onLogout }) => {
  const location = useLocation();
  
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <img src={shoppingCartIcon} alt="Spree Scribe" style={{ width: '24px', height: '24px' }} />
          </div>
          <h1 className={styles.logoText}>Spree Scribe</h1>
        </div>
        
        {showNavigation && (
          <nav className={styles.navigation}>
            <Link 
              to="/home" 
              className={`${styles.navLink} ${location.pathname === '/home' ? styles.active : ''}`}
            >
              <img src={houseIcon} alt="Home" style={{ width: '20px', height: '20px' }} />
              Home
            </Link>
            <Link 
              to="/profile" 
              className={`${styles.navLink} ${location.pathname === '/profile' ? styles.active : ''}`}
            >
              <img src={profileIcon} alt="Profile" style={{ width: '20px', height: '20px' }} />
              Profile
            </Link>
          </nav>
        )}
        
        {userName && (
          <div className={styles.userGreeting}>
            <span className={styles.welcomeText}>Welcome, {userName}</span>
            <div className={styles.userIcon}>
              <img src={userIcon} alt="User" style={{ width: '20px', height: '20px' }} />
            </div>
            {onLogout && (
              <button 
                className={styles.logoutButton}
                onClick={onLogout}
                title="Sign Out"
              >
                Sign Out
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;