import type { NextPage } from 'next';
import { useCallback } from 'react';
import { MdSearch, MdNotifications } from 'react-icons/md';
import { DashboardIcon, CalendarIcon, TrophyIcon, GroupIcon, BookIcon, AdminIcon, LogoutIcon, TranslateIcon } from '../icons/SidebarIcons';
import styles from './EmptyStateDashboard.module.css';

// Fresh assets from Figma MCP (expires in 7 days)
const imgSportsKeyzWhite1 = "/SportsKeyz White 1.png";

interface EmptyStateDashboardProps {
  onCreateClick?: () => void;
  onRenewClick?: () => void;
  onNavigate?: () => void;
}

const EmptyStateDashboard: NextPage<EmptyStateDashboardProps> = ({
  onCreateClick,
  onRenewClick,
  onNavigate
}) => {
  const handleNavigate = useCallback(() => {
    onNavigate?.();
  }, [onNavigate]);

  const handleCreate = useCallback(() => {
    onCreateClick?.();
  }, [onCreateClick]);

  const handleRenew = useCallback(() => {
    onRenewClick?.();
  }, [onRenewClick]);

  return (
    <div className={styles.dashboard}>
      {/* Sidebar Section */}
      <div className={styles.sidebarContainer}>
        <img src={imgSportsKeyzWhite1} alt="SportsKeyz" className={styles.logo} />
        <div className={styles.sidebarBackground}>
          <div className={styles.sidebarIcons}>
            <DashboardIcon className={styles.sidebarIconActive} title="Dashboard" />
            <CalendarIcon className={styles.sidebarIconGray} onClick={handleNavigate} title="Calendar" />
            <TrophyIcon className={styles.sidebarIconGray} onClick={handleNavigate} title="Events" />
            <GroupIcon className={styles.sidebarIconGray} onClick={handleNavigate} title="Users" />
            <BookIcon className={styles.sidebarIconGray} onClick={handleNavigate} title="Library" />
            <AdminIcon className={styles.sidebarIconGray} title="Settings" />
          </div>
          <div className={styles.sidebarDivider} />
          <div className={styles.sidebarBottomIcons}>
            <div className={styles.sidebarIconWrapper}>
              <LogoutIcon className={styles.sidebarIconLogout} title="Logout" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className={styles.mainContent}>
        {/* Top Header */}
        <div className={styles.topHeader}>
          <div className={styles.searchBar}>
            <MdSearch className={styles.searchIcon} />
            <input type="text" placeholder="Search" className={styles.searchInput} />
          </div>
          <div className={styles.languageSelector}>
            <TranslateIcon className={styles.translationIcon} />
          </div>
          <div className={styles.settingsButton}>
            <MdNotifications className={styles.settingsIcon} />
          </div>
        </div>

        {/* Title */}
        <h1 className={styles.pageTitle}>Create Certificates</h1>

        {/* Dashboard Panels Grid */}
        <div className={styles.panelsGrid}>
          {/* Left Column (Events) */}
          <div className={styles.leftColumn}>
            {/* No Past Events Section */}
            <div className={styles.pastEventsSection}>
              <div className={styles.sectionBackground} />
              <div className={styles.emptySectionContent}>
                <h3 className={styles.emptySectionTitle}>No Past Events</h3>
                <p className={styles.emptySectionDescription}>Once an event gets over, it will reflect here</p>
              </div>
            </div>

            {/* No Ongoing Events Section */}
            <div className={styles.ongoingEventsSection}>
              <div className={styles.sectionBackgroundTop} />
              <div className={styles.emptySectionContent}>
                <h3 className={styles.emptySectionTitle}>No Ongoing Events</h3>
                <p className={styles.emptySectionDescription}>Once any event becomes live, it will reflect here</p>
              </div>
            </div>
          </div>

          {/* Right Panel - Stats and Actions Section */}
          <div className={styles.statsSection}>
            <div className={styles.statsSectionBackground} />

            {/* Stats Cards */}
            <div className={styles.statsCards}>
              <div className={styles.statCardCreated}>
                <div className={styles.statCardBackground} />
                <div className={styles.statCardHeaderBlue} />
                <span className={styles.statLabel}>Certificates Created</span>
                <span className={styles.statNumber}>0</span>
              </div>
              <div className={styles.statCardLeft}>
                <div className={styles.statCardBackground} />
                <div className={styles.statCardHeaderPurple} />
                <span className={styles.statLabel}>Certificates left</span>
                <span className={styles.statNumber}>20,000</span>
              </div>
            </div>

            {/* Generate Certificate Section */}
            <div className={styles.generateSectionOverlay} />
            <div className={styles.generateSection}>
              <h3 className={styles.generateTitle}>Generate New Certificate</h3>
              <p className={styles.generateDescription}>Click here to generate certificates for your upcoming tournament.</p>
              <button className={styles.createButton} onClick={handleCreate}>
                + Create
              </button>
            </div>

            {/* Renew Pack Section */}
            <div className={styles.renewPackSection}>
              <h3 className={styles.renewPackTitle}>Renew Pack</h3>
              <p className={styles.renewPackDescription}>Renew your pack to create more certificates.</p>
              <button className={styles.renewButton} onClick={handleRenew}>Renew</button>
            </div>

            {/* Artwork */}
            <img src="/artwork.png" alt="renew pack artwork" className={styles.artwork} />
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>© 2026 SportsKeyz. Powered by SporTech Innovation. All rights reserved.</div>
      </div>
    </div>
  );
};

export default EmptyStateDashboard;
