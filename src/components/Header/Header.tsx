import React from 'react';
import styles from './Header.module.css';
import cartIcon from '../../assets/shopping-cart.png';
import homeIcon from '../../assets/house.png';
import userIcon from '../../assets/user.png';

interface HeaderProps {
  userName?: string;
  showNavigation?: boolean;
}

const Header: React.FC<HeaderProps> = ({ userName, showNavigation = false }) => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <img src={cartIcon} alt="Shopping cart" width="24" height="24" />
          </div>
          <h1 className={styles.logoText}>Spree Scribe</h1>
        </div>
        
        {showNavigation && (
          <nav className={styles.navigation}>
            <a href="#" className={styles.navLink}>
              <img src={homeIcon} alt="Home" width="20" height="20" />
              Home
            </a>
            <a href="#" className={styles.navLink}>
              <img src={userIcon} alt="Profile" width="20" height="20" />
              Profile
            </a>
          </nav>
        )}
        
        {userName && (
          <div className={styles.userGreeting}>
            <span className={styles.welcomeText}>Welcome, {userName}</span>
            <div className={styles.userIcon}>
              <img src={userIcon} alt="User profile" width="20" height="20" />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;