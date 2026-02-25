import React from 'react';
import styles from './Sidebar.module.css';

const Sidebar: React.FC = () => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <div className={styles.logoText}>SPORTS</div>
          <div className={styles.logoSubtext}>KEYZ</div>
        </div>
      </div>
      
      <nav className={styles.navigation}>
        <div className={styles.navItem}>
          <div className={styles.navIcon}>
            <div className={styles.gridIcon}></div>
          </div>
        </div>
        
        <div className={styles.navItem}>
          <div className={styles.navIcon}>
            <div className={styles.calendarIcon}></div>
          </div>
        </div>
        
        <div className={styles.navItem}>
          <div className={styles.navIcon}>
            <div className={styles.trophyIcon}></div>
          </div>
        </div>
        
        <div className={styles.navItem}>
          <div className={styles.navIcon}>
            <div className={styles.peopleIcon}></div>
          </div>
        </div>
        
        <div className={styles.navItem}>
          <div className={styles.navIcon}>
            <div className={styles.bookIcon}></div>
          </div>
        </div>
        
        <div className={styles.navItem}>
          <div className={styles.navIcon}>
            <div className={styles.settingsIcon}></div>
          </div>
        </div>
      </nav>
      
      <div className={styles.backButton}>
        <div className={styles.backIcon}>←</div>
      </div>
    </div>
  );
};

export default Sidebar;
