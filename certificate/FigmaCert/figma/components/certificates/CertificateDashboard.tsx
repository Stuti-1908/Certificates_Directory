import type { NextPage } from 'next';
import { useCallback } from 'react';
import { MdSearch, MdKeyboardArrowDown, MdNotifications } from 'react-icons/md';
import { DashboardIcon, CalendarIcon, TrophyIcon, GroupIcon, BookIcon, AdminIcon, LogoutIcon, TranslateIcon } from '../icons/SidebarIcons';
import styles from './CertificateDashboard.module.css';

// Fresh assets from Figma MCP (expires in 7 days) - Logo and event avatars
const imgSportsKeyzWhite1 = "/SportsKeyz White 1.png";
const imgRectangle687 = "https://www.figma.com/api/mcp/asset/8d517839-eddd-4605-8496-aeeb6647497c";
const imgRectangle688 = "https://www.figma.com/api/mcp/asset/93bc24fd-442f-4f17-a1e7-cd4a2e55f047";
const imgRectangle689 = "https://www.figma.com/api/mcp/asset/eec558e8-4985-4fd6-8f48-14c2a551a75b";
const imgRectangle690 = "https://www.figma.com/api/mcp/asset/94424c0c-6891-4181-a096-a5025dea6fcf";
const imgRectangle691 = "https://www.figma.com/api/mcp/asset/8c27b6a5-5db2-47d6-a1eb-c3c0b432eb7e";
const imgRectangle692 = "https://www.figma.com/api/mcp/asset/68cf52b9-12d6-47c4-a540-9f8ccf5ecd19";

const eventAvatars = [imgRectangle687, imgRectangle688, imgRectangle689, imgRectangle690, imgRectangle691, imgRectangle692];

interface CertificateDashboardProps {
  onNavigate?: () => void;
  onCreateClick?: () => void;
}

const CertificateDashboard: NextPage<CertificateDashboardProps> = ({
  onNavigate,
  onCreateClick
}) => {
  const handleNavigation = useCallback(() => {
    onNavigate?.();
  }, [onNavigate]);

  const handleCreateClick = useCallback(() => {
    onCreateClick?.();
  }, [onCreateClick]);

  return (
    <div className={styles.dashboard}>
      {/* Sidebar Section */}
      <div className={styles.sidebarContainer}>
        <img src={imgSportsKeyzWhite1} alt="SportsKeyz" className={styles.logo} />
        <div className={styles.sidebarBackground}>
          <div className={styles.sidebarIcons}>
            <DashboardIcon className={styles.sidebarIconActive} title="Dashboard" />
            <CalendarIcon className={styles.sidebarIconGray} onClick={handleNavigation} title="Calendar" />
            <TrophyIcon className={styles.sidebarIconGray} onClick={handleNavigation} title="Events" />
            <GroupIcon className={styles.sidebarIconGray} onClick={handleNavigation} title="Users" />
            <BookIcon className={styles.sidebarIconGray} onClick={handleNavigation} title="Library" />
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
            <TranslateIcon className={styles.translationIcon} color="#fff" />
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

            {/* Past Certificates Section */}
            <div className={styles.pastCertificatesSection}>
              <div className={styles.sectionBackground} />
              <div className={styles.sectionHeader}>
                <span className={styles.sectionTitle}>Past Certificates Created</span>
                <div className={styles.viewAllLink} onClick={handleNavigation}>
                  <span className={styles.viewAllText}>View All</span>
                  <MdKeyboardArrowDown className={styles.arrowIconRotated} />
                </div>
              </div>
              <div className={styles.certificateList}>
                {eventAvatars.map((avatar, idx) => (
                  <div key={idx} className={idx % 2 === 0 ? styles.certificateRow : styles.certificateRowAlt}>
                    <img src={avatar} alt="" className={styles.eventAvatar} />
                    <span className={styles.eventName}>Name of the event</span>
                    <span className={styles.sportName}>Sport Name</span>
                    <span className={styles.eventDate}>Date</span>
                    <div className={styles.viewDetailsLink}>
                      <span className={styles.viewDetailsText}>View Details</span>
                      <MdKeyboardArrowDown className={styles.arrowIconRotated} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Tournaments Section */}
            <div className={styles.upcomingSection}>
              <div className={styles.upcomingSectionBackground} />
              <div className={styles.liveUpdatesBadge}>
                <span className={styles.badgeText}>Live updates</span>
              </div>
              <h2 className={styles.upcomingTitle}>Upcoming Tournaments</h2>
              <div className={styles.tournamentDetails}>
                <span className={styles.tournamentName}>Karnataka Badminton State Level Tournament</span>
                <span className={styles.tournamentLocation}>Bengaluru, Karnataka</span>
                <span className={styles.tournamentStats}>230 participants, 12 coaches, 10 officials, 21 volunteers</span>
                <span className={styles.tournamentMeta}>Tournament ID, Name, Organizer, Date, Location</span>
              </div>
              <div className={styles.viewAllEventsLink} onClick={handleNavigation}>
                <span className={styles.viewDetailsText}>View All Events</span>
                <MdKeyboardArrowDown className={styles.arrowIconRotated} />
              </div>
              <div className={styles.tabsContainer}>
                <div className={styles.tabFirst}>
                  <span className={styles.tabTextActive}>First</span>
                </div>
                <div className={styles.tabSecond}>
                  <span className={styles.tabTextInactive}>Second</span>
                </div>
                <div className={styles.tabThird}>
                  <span className={styles.tabTextInactive}>Third</span>
                </div>
                <div className={styles.tabFourth}>
                  <span className={styles.tabTextInactive}>Fourth</span>
                </div>
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
                <span className={styles.statNumber}>5289</span>
              </div>
              <div className={styles.statCardLeft}>
                <div className={styles.statCardBackground} />
                <div className={styles.statCardHeaderPurple} />
                <span className={styles.statLabel}>Certificates left</span>
                <span className={styles.statNumber}>16,211</span>
              </div>
            </div>

            {/* Generate Certificate Section */}
            <div className={styles.generateSectionOverlay} />
            <div className={styles.generateSection}>
              <h3 className={styles.generateTitle}>Generate New Certificate</h3>
              <p className={styles.generateDescription}>Click here to generate certificates for your upcoming tournament.</p>
              <button className={styles.createButton} onClick={handleCreateClick}>
                + Create
              </button>
            </div>

            {/* Renew Pack Section */}
            <div className={styles.renewPackSection}>
              <h3 className={styles.renewPackTitle}>Renew Pack</h3>
              <p className={styles.renewPackDescription}>Renew your pack to create more certificates.</p>
              <button className={styles.renewButton}>Renew</button>
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

export default CertificateDashboard;
