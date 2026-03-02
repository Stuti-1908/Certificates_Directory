import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { MdSearch, MdNotifications } from 'react-icons/md';
import {
  DashboardIcon,
  CalendarIcon,
  TrophyIcon,
  GroupIcon,
  BookIcon,
  AdminIcon,
  LogoutIcon,
  TranslateIcon,
} from '../icons/SidebarIcons';
import styles from './GenerateCertificate.module.css';

const imgSportsKeyzWhite1 = "/SportsKeyz White 1.png";

type TabType = 'merit' | 'participants' | 'coaches' | 'volunteers' | 'officials';

interface UserData {
  id: string;
  sportLevel: string;
  firstName: string;
  middleName: string;
  lastName: string;
  certificateType?: string;
  sport?: string;
  role?: string;
  eventName?: string;
  organization?: string;
  association?: string;
  startDate?: string;
  endDate?: string;
}

interface ParticipantData {
  firstName: string;
  middleName?: string;
  lastName: string;
  certificateType: string;
  sport?: string;
  role?: string;
  eventName?: string;
  organization?: string;
  association?: string;
  startDate?: string;
  endDate?: string;
  rowNumber?: number;
}

interface GenerationResult {
  results: any[];
  successCount: number;
  failCount: number;
  total: number;
  byType: Record<string, any[]>;
}

interface GenerateCertificateProps {
  onBack?: () => void;
  onApprove?: (result: GenerationResult) => void;
  participants?: ParticipantData[];
  eventName?: string;
}

// Fallback sample data when no participants are passed
const sampleUsers: UserData[] = [
  { id: '234567451248', sportLevel: 'Archery - State Level', firstName: 'Shreekant', middleName: 'Gupta', lastName: 'Rahul', certificateType: 'gold', sport: 'Archery' },
  { id: '234567451249', sportLevel: 'Archery - National Level', firstName: 'Rama', middleName: 'Mehta', lastName: 'Vijay', certificateType: 'silver', sport: 'Archery' },
  { id: '234567451250', sportLevel: 'Archery - State Level', firstName: 'Miland', middleName: 'Singh', lastName: 'Naina', certificateType: 'bronze', sport: 'Archery' },
  { id: '234567451251', sportLevel: 'Archery - National Level', firstName: 'Ajay', middleName: 'Agrawal', lastName: 'Suraj', certificateType: 'participation', sport: 'Archery', role: 'Athlete' },
  { id: '234567451252', sportLevel: 'Archery - State Level', firstName: 'Bhanu', middleName: 'Kumaar', lastName: 'Prathamesh', certificateType: 'participation', sport: 'Archery', role: 'Coach' },
  { id: '234567451253', sportLevel: 'Archery - National Level', firstName: 'Praveen', middleName: 'Banerjee', lastName: 'Akshay', certificateType: 'participation', sport: 'Archery', role: 'Volunteer' },
  { id: '234567451254', sportLevel: 'Archery - State Level', firstName: 'Rajesh', middleName: 'Kumari', lastName: 'Khushi', certificateType: 'participation', sport: 'Archery', role: 'Referee' },
  { id: '234567451255', sportLevel: 'Archery - National Level', firstName: 'Mohan', middleName: 'Bhatiya', lastName: 'Amit', certificateType: 'participation', sport: 'Archery', role: 'Athlete' },
];

/**
 * Determine which tab a participant belongs to based on certificateType and role
 */
function getParticipantTab(user: UserData): TabType {
  const certType = (user.certificateType || '').toLowerCase();
  const role = (user.role || '').toLowerCase();

  // Merit tab: gold, silver, bronze
  if (certType === 'gold' || certType === 'silver' || certType === 'bronze') {
    return 'merit';
  }

  // Role-based tabs for participation certificates
  if (role === 'coach' || role === 'coaching') return 'coaches';
  if (role === 'volunteer' || role === 'volunteering') return 'volunteers';
  if (role === 'referee' || role === 'official' || role === 'umpire' || role === 'judge') return 'officials';

  // Default: participants tab (athletes, or participation with no specific role)
  return 'participants';
}

const GenerateCertificate: React.FC<GenerateCertificateProps> = ({ onBack, onApprove, participants, eventName }) => {
  const [approvalMessage, setApprovalMessage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('merit');

  // Convert passed participants into UserData format for display
  const allUsers: UserData[] = useMemo(() => {
    if (!participants || participants.length === 0) return sampleUsers;
    return participants.map((p, i) => ({
      id: String(p.rowNumber || i + 1).padStart(12, '0'),
      sportLevel: `${p.sport || 'Unknown'} - ${p.certificateType || 'Unknown'}`,
      firstName: p.firstName,
      middleName: p.middleName || '',
      lastName: p.lastName,
      certificateType: p.certificateType,
      sport: p.sport,
      role: p.role,
      eventName: p.eventName,
      organization: p.organization,
      association: p.association,
      startDate: p.startDate,
      endDate: p.endDate,
    }));
  }, [participants]);

  // Compute counts per tab for badge display
  const tabCounts = useMemo(() => {
    const counts: Record<TabType, number> = { merit: 0, participants: 0, coaches: 0, volunteers: 0, officials: 0 };
    allUsers.forEach(u => { counts[getParticipantTab(u)]++; });
    return counts;
  }, [allUsers]);

  // Filter users by active tab
  const filteredUsers = useMemo(() => {
    return allUsers.filter(u => getParticipantTab(u) === activeTab);
  }, [allUsers, activeTab]);

  // Split filtered users into "existing" (first half) and "new" (second half)
  const existingUsers = useMemo(() => filteredUsers.slice(0, Math.ceil(filteredUsers.length / 2)), [filteredUsers]);
  const newUsers = useMemo(() => filteredUsers.slice(Math.ceil(filteredUsers.length / 2)), [filteredUsers]);

  const [existingChecked, setExistingChecked] = useState<boolean[]>([]);
  const [newChecked, setNewChecked] = useState<boolean[]>([]);

  // Re-initialize checked arrays when filtered users change
  useEffect(() => {
    setExistingChecked(existingUsers.map(() => true));
  }, [existingUsers]);

  useEffect(() => {
    setNewChecked(newUsers.map(() => true));
  }, [newUsers]);

  // Auto-select the first tab that has entries
  useEffect(() => {
    if (tabCounts[activeTab] === 0) {
      const tabOrder: TabType[] = ['merit', 'participants', 'coaches', 'volunteers', 'officials'];
      const firstNonEmpty = tabOrder.find(t => tabCounts[t] > 0);
      if (firstNonEmpty) setActiveTab(firstNonEmpty);
    }
  }, [tabCounts, activeTab]);

  const toggleExisting = useCallback((index: number) => {
    setExistingChecked((prev) => prev.map((v, i) => (i === index ? !v : v)));
  }, []);

  const toggleNew = useCallback((index: number) => {
    setNewChecked((prev) => prev.map((v, i) => (i === index ? !v : v)));
  }, []);

  const selectAllExisting = useCallback(() => {
    const allChecked = existingChecked.every(Boolean);
    setExistingChecked(existingChecked.map(() => !allChecked));
  }, [existingChecked]);

  const selectAllNew = useCallback(() => {
    const allChecked = newChecked.every(Boolean);
    setNewChecked(newChecked.map(() => !allChecked));
  }, [newChecked]);

  // Collect selected participants for a specific group (existing or new)
  const getSelectedParticipants = useCallback((group: 'existing' | 'new'): ParticipantData[] => {
    const selected: ParticipantData[] = [];

    // Collect from the requested group
    if (group === 'existing') {
      existingUsers.forEach((user, i) => {
        if (existingChecked[i]) {
          const originalIdx = allUsers.indexOf(user);
          if (participants && participants[originalIdx]) {
            selected.push(participants[originalIdx]);
          } else {
            selected.push({
              firstName: user.firstName,
              middleName: user.middleName,
              lastName: user.lastName,
              certificateType: user.certificateType || 'participation',
              sport: user.sport,
              role: user.role,
              eventName: user.eventName || eventName,
              organization: user.organization,
              association: user.association,
              startDate: user.startDate,
              endDate: user.endDate,
            });
          }
        }
      });
    }

    if (group === 'new') {
      newUsers.forEach((user, i) => {
        if (newChecked[i]) {
          const originalIdx = allUsers.indexOf(user);
          if (participants && participants[originalIdx]) {
            selected.push(participants[originalIdx]);
          } else {
            selected.push({
              firstName: user.firstName,
              middleName: user.middleName,
              lastName: user.lastName,
              certificateType: user.certificateType || 'participation',
              sport: user.sport,
              role: user.role,
              eventName: user.eventName || eventName,
              organization: user.organization,
              association: user.association,
              startDate: user.startDate,
              endDate: user.endDate,
            });
          }
        }
      });
    }

    return selected;
  }, [existingUsers, newUsers, existingChecked, newChecked, allUsers, participants, eventName]);

  const handleGenerate = useCallback(async (group: 'existing' | 'new') => {
    const selected = getSelectedParticipants(group);
    if (selected.length === 0) {
      setApprovalMessage('Please select at least one user to approve');
      setTimeout(() => setApprovalMessage(null), 3000);
      return;
    }

    setIsGenerating(true);
    setApprovalMessage(null);

    try {
      const response = await fetch('/api/generate-certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participants: selected }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate certificates');
      }

      setIsGenerating(false);
      if (onApprove) onApprove(data);
    } catch (err: any) {
      setIsGenerating(false);
      setApprovalMessage(err.message || 'Certificate generation failed');
      setTimeout(() => setApprovalMessage(null), 5000);
    }
  }, [getSelectedParticipants, onApprove]);

  const handleApproveExisting = useCallback(async () => {
    const selectedCount = existingChecked.filter(Boolean).length;
    if (selectedCount === 0) {
      setApprovalMessage('Please select at least one user to approve');
      setTimeout(() => setApprovalMessage(null), 3000);
      return;
    }
    await handleGenerate('existing');
  }, [existingChecked, handleGenerate]);

  const handleApproveNew = useCallback(async () => {
    const selectedCount = newChecked.filter(Boolean).length;
    if (selectedCount === 0) {
      setApprovalMessage('Please select at least one user to approve');
      setTimeout(() => setApprovalMessage(null), 3000);
      return;
    }
    await handleGenerate('new');
  }, [newChecked, handleGenerate]);

  const renderUserTable = (
    users: UserData[],
    checked: boolean[],
    toggleFn: (index: number) => void,
    selectAllFn: () => void,
    title: string,
    subtitle: string,
    approveFn: () => void,
  ) => (
    <div className={styles.panelCard}>
      <div className={styles.panelHeaderRow}>
        <div>
          <h2 className={styles.panelTitle}>{title}</h2>
          <div className={styles.panelSubtitle}>{subtitle}</div>
        </div>
        <button className={styles.selectAllBtn} onClick={selectAllFn}>Select All</button>
      </div>

      <div className={styles.tableBody}>
        {users.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: '40px 0', fontSize: '14px' }}>
            No users in this category
          </div>
        ) : (
          users.map((user, index) => (
            <div key={user.id + index} className={styles.tableRow}>
              <div className={styles.colId}>{user.id}</div>
              <div className={styles.colSportLevel}>{user.sportLevel}</div>
              <div className={styles.colName}>{user.firstName}</div>
              <div className={styles.colName}>{user.middleName}</div>
              <div className={styles.colName}>{user.lastName}</div>
              <div className={styles.colAction}>
                <button
                  className={`${styles.checkbox} ${checked[index] ? styles.checkboxChecked : ''}`}
                  onClick={() => toggleFn(index)}
                >
                  {checked[index] && (
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 1L4.125 8L1 4.81818" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {users.length > 0 && (
        <div className={styles.approveWrapper}>
          <button className={styles.approveFab} onClick={approveFn} disabled={isGenerating}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17L4 12" stroke="#30DFA0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{isGenerating ? 'Wait...' : 'Approve'}</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className={styles.dashboardLayout}>
      {/* Sidebar Section */}
      <div className={styles.sidebarContainer}>
        <img src={imgSportsKeyzWhite1} alt="SportsKeyz" className={styles.sysLogo} />
        <div className={styles.sidebarBackground}>
          <div className={styles.sidebarIcons}>
            <DashboardIcon className={styles.sidebarIconActive} title="Dashboard" onClick={onBack} />
            <CalendarIcon className={styles.sidebarIconGray} title="Calendar" />
            <TrophyIcon className={styles.sidebarIconGray} title="Events" />
            <GroupIcon className={styles.sidebarIconGray} title="Users" />
            <BookIcon className={styles.sidebarIconGray} title="Library" />
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
        <div className={styles.pageTitle}>
          Generate Certificate
          {eventName && <span style={{ fontSize: '14px', fontWeight: 400, color: '#888', marginLeft: '12px' }}>for {eventName}</span>}
        </div>

        {/* Tabs Menu - Now functional with active state */}
        <div className={styles.tabsMenu}>
          <div
            className={`${styles.tabChip} ${styles.tabMerit}`}
            onClick={() => setActiveTab('merit')}
            style={{
              opacity: activeTab === 'merit' ? 1 : 0.45,
              cursor: 'pointer',
              transform: activeTab === 'merit' ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.2s ease',
              boxShadow: activeTab === 'merit' ? '0 4px 15px rgba(255,209,1,0.4)' : 'none',
            }}
          >
            Merit/Medals {tabCounts.merit > 0 && `(${tabCounts.merit})`}
          </div>
          <div
            className={`${styles.tabChip} ${styles.tabParticipants}`}
            onClick={() => setActiveTab('participants')}
            style={{
              opacity: activeTab === 'participants' ? 1 : 0.45,
              cursor: 'pointer',
              transform: activeTab === 'participants' ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.2s ease',
              boxShadow: activeTab === 'participants' ? '0 4px 15px rgba(157,255,0,0.4)' : 'none',
            }}
          >
            Participants {tabCounts.participants > 0 && `(${tabCounts.participants})`}
          </div>
          <div
            className={`${styles.tabChip} ${styles.tabCoaches}`}
            onClick={() => setActiveTab('coaches')}
            style={{
              opacity: activeTab === 'coaches' ? 1 : 0.45,
              cursor: 'pointer',
              transform: activeTab === 'coaches' ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.2s ease',
              boxShadow: activeTab === 'coaches' ? '0 4px 15px rgba(168,144,254,0.4)' : 'none',
            }}
          >
            Coaches {tabCounts.coaches > 0 && `(${tabCounts.coaches})`}
          </div>
          <div
            className={`${styles.tabChip} ${styles.tabVolunteers}`}
            onClick={() => setActiveTab('volunteers')}
            style={{
              opacity: activeTab === 'volunteers' ? 1 : 0.45,
              cursor: 'pointer',
              transform: activeTab === 'volunteers' ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.2s ease',
              boxShadow: activeTab === 'volunteers' ? '0 4px 15px rgba(255,149,0,0.4)' : 'none',
            }}
          >
            Volunteers {tabCounts.volunteers > 0 && `(${tabCounts.volunteers})`}
          </div>
          <div
            className={`${styles.tabChip} ${styles.tabOfficials}`}
            onClick={() => setActiveTab('officials')}
            style={{
              opacity: activeTab === 'officials' ? 1 : 0.45,
              cursor: 'pointer',
              transform: activeTab === 'officials' ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.2s ease',
              boxShadow: activeTab === 'officials' ? '0 4px 15px rgba(0,163,255,0.4)' : 'none',
            }}
          >
            Officials {tabCounts.officials > 0 && `(${tabCounts.officials})`}
          </div>
        </div>

        {/* Generating overlay */}
        {isGenerating && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 9999, flexDirection: 'column', gap: '16px',
          }}>
            <div style={{
              width: '48px', height: '48px', border: '4px solid #30DFA0',
              borderTopColor: 'transparent', borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
            <div style={{ color: '#fff', fontSize: '18px', fontWeight: 600 }}>
              Generating certificates...
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        )}

        {/* Panels */}
        <div className={styles.panelsContainer}>
          {renderUserTable(
            existingUsers,
            existingChecked,
            toggleExisting,
            selectAllExisting,
            'Users who exist in the system',
            'The certificates will directly be sent to these users account.',
            handleApproveExisting,
          )}
          {renderUserTable(
            newUsers,
            newChecked,
            toggleNew,
            selectAllNew,
            "Users who don't exist in the system",
            'The system will create a new account for all of these users automatically.',
            handleApproveNew,
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>© 2026 SportsKeyz. Powered by SporTech Innovation. All rights reserved.</div>
      </div>

      {approvalMessage && <div className={styles.toast}>{approvalMessage}</div>}
    </div>
  );
};

export default GenerateCertificate;
