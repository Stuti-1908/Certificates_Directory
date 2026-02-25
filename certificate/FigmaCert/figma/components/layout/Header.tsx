import React from 'react';
import styles from './Header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.searchContainer}>
        <div className={styles.searchIcon}>🔍</div>
        <input 
          type="text" 
          placeholder="Search" 
          className={styles.searchInput}
        />
      </div>
      
      <div className={styles.headerActions}>
        <div className={styles.actionIcon}>
          <div className={styles.settingsIcon}></div>
        </div>
        <div className={styles.actionIcon}>
          <div className={styles.notificationIcon}></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
