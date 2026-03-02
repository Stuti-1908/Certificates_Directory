import type { NextPage } from 'next';
import { useCallback, useEffect, useState } from 'react';
import { MdSearch, MdKeyboardArrowDown, MdNotifications, MdClose } from 'react-icons/md';
import { DashboardIcon, CalendarIcon, TrophyIcon, GroupIcon, BookIcon, AdminIcon, LogoutIcon, TranslateIcon } from '../icons/SidebarIcons';
import styles from './CertificateDashboard.module.css';

// Assets
const imgSportsKeyzWhite1 = "/SportsKeyz White 1.png";
const imgRectangle687 = "/profile images/Rectangle 687.png";
const imgRectangle688 = "/profile images/Rectangle 687 (1).png";
const imgRectangle689 = "/profile images/Rectangle 687 (2).png";
const imgRectangle690 = "/profile images/Rectangle 687 (3).png";
const imgRectangle691 = "/profile images/Rectangle 687 (4).png";
const imgRectangle692 = "/profile images/Rectangle 687 (5).png";

const defaultAvatars = [imgRectangle687, imgRectangle688, imgRectangle689, imgRectangle690, imgRectangle691, imgRectangle692];

// History entry interface (matches index.tsx)
interface CertificateHistoryEntry {
  id: string;
  eventName: string;
  sport: string;
  date: string;
  totalCertificates: number;
  successCount: number;
  results: Array<{
    fileName?: string;
    url?: string;
    name?: string;
    type?: string;
    certId?: string;
    error?: string;
  }>;
  createdAt: string;
}

const HISTORY_STORAGE_KEY = 'certificate-generation-history';

interface CertificateDashboardProps {
  onNavigate?: () => void;
  onCreateClick?: () => void;
}

const CertificateDashboard: NextPage<CertificateDashboardProps> = ({
  onNavigate,
  onCreateClick
}) => {
  const [history, setHistory] = useState<CertificateHistoryEntry[]>([]);
  const [viewingEntry, setViewingEntry] = useState<CertificateHistoryEntry | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (raw) {
        setHistory(JSON.parse(raw));
      }
    } catch {
      // ignore
    }
  }, []);

  const totalCertificatesCreated = history.reduce((sum, h) => sum + h.successCount, 0);

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
                {history.length > 0 ? (
                  history.slice(0, 6).map((entry, idx) => (
                    <div key={entry.id} className={idx % 2 === 0 ? styles.certificateRow : styles.certificateRowAlt}>
                      <img src={defaultAvatars[idx % defaultAvatars.length]} alt="Event Avatar" className={styles.eventAvatar} />
                      <span className={styles.eventName}>{entry.eventName}</span>
                      <span className={styles.sportName}>{entry.sport}</span>
                      <span className={styles.eventDate}>{entry.date}</span>
                      <div className={styles.viewDetailsLink} onClick={() => setViewingEntry(entry)} style={{ cursor: 'pointer' }}>
                        <span className={styles.viewDetailsText}>{entry.successCount} certs - View</span>
                        <MdKeyboardArrowDown className={styles.arrowIconRotatedDetails} />
                      </div>
                    </div>
                  ))
                ) : (
                  defaultAvatars.map((avatar, idx) => (
                    <div key={idx} className={idx % 2 === 0 ? styles.certificateRow : styles.certificateRowAlt}>
                      <img src={avatar} alt="Event Avatar" className={styles.eventAvatar} />
                      <span className={styles.eventName}>Name of the event</span>
                      <span className={styles.sportName}>Sport Name</span>
                      <span className={styles.eventDate}>Date</span>
                      <div className={styles.viewDetailsLink}>
                        <span className={styles.viewDetailsText}>View Details</span>
                        <MdKeyboardArrowDown className={styles.arrowIconRotatedDetails} />
                      </div>
                    </div>
                  ))
                )}
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
                <div className={styles.tabFirst}><span className={styles.tabTextActive}>First</span></div>
                <div className={styles.tabSecond}><span className={styles.tabTextInactive}>Second</span></div>
                <div className={styles.tabThird}><span className={styles.tabTextInactive}>Third</span></div>
                <div className={styles.tabFourth}><span className={styles.tabTextInactive}>Fourth</span></div>
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
                <span className={styles.statNumber}>{totalCertificatesCreated > 0 ? totalCertificatesCreated.toLocaleString() : '5289'}</span>
              </div>
              <div className={styles.statCardLeft}>
                <div className={styles.statCardBackground} />
                <div className={styles.statCardHeaderPurple} />
                <span className={styles.statLabel}>Certificates left</span>
                <span className={styles.statNumber}>{totalCertificatesCreated > 0 ? (20000 - totalCertificatesCreated).toLocaleString() : '16,211'}</span>
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

      {/* View Details Modal — shows generated certificate images */}
      {viewingEntry && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 9999,
          }}
          onClick={() => setViewingEntry(null)}
        >
          <div
            style={{
              background: '#1d1e20', borderRadius: '20px', padding: '30px',
              maxWidth: '900px', width: '90%', maxHeight: '85vh', overflowY: 'auto',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setViewingEntry(null)}
              style={{
                position: 'absolute', top: '15px', right: '15px',
                background: 'transparent', border: 'none', color: '#fff',
                cursor: 'pointer', fontSize: '24px',
              }}
            >
              <MdClose />
            </button>

            <h2 style={{ color: '#fff', margin: '0 0 8px 0', fontSize: '22px' }}>
              {viewingEntry.eventName}
            </h2>
            <p style={{ color: '#888', margin: '0 0 20px 0', fontSize: '14px' }}>
              {viewingEntry.sport} | {viewingEntry.date} | {viewingEntry.successCount} certificates generated
            </p>

            {/* Certificate grid */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '16px',
            }}>
              {viewingEntry.results
                .filter(r => r.url && !r.error)
                .map((result, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#23282e', borderRadius: '12px', padding: '12px',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
                    }}
                  >
                    <img
                      src={result.url}
                      alt={result.name || result.fileName}
                      style={{
                        width: '100%', height: 'auto', borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.1)',
                      }}
                    />
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: '#fff', fontSize: '12px', fontWeight: 600 }}>
                        {result.name || 'Certificate'}
                      </div>
                      <div style={{
                        color: result.type === 'gold' ? '#FFD700' :
                          result.type === 'silver' ? '#C0C0C0' :
                            result.type === 'bronze' ? '#CD7F32' : '#30DFA0',
                        fontSize: '11px', textTransform: 'capitalize',
                      }}>
                        {result.type}
                      </div>
                      {result.certId && (
                        <div style={{ color: '#666', fontSize: '9px', marginTop: '4px' }}>
                          {result.certId}
                        </div>
                      )}
                    </div>
                    <a
                      href={result.url}
                      download={result.fileName}
                      style={{
                        background: '#30DFA0', color: '#000', padding: '6px 16px',
                        borderRadius: '6px', fontSize: '11px', fontWeight: 600,
                        textDecoration: 'none', cursor: 'pointer',
                      }}
                    >
                      Download
                    </a>
                  </div>
                ))
              }
            </div>

            {viewingEntry.results.filter(r => r.url && !r.error).length === 0 && (
              <div style={{ color: '#888', textAlign: 'center', padding: '40px 0' }}>
                No certificate images available for this event.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateDashboard;
