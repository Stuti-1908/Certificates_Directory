import React, { useCallback, useMemo, useState } from 'react';
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
}

interface GenerateCertificateProps {
  onBack?: () => void;
  onApprove?: () => void;
}

const GenerateCertificate: React.FC<GenerateCertificateProps> = ({ onBack, onApprove }) => {
  const [approvalMessage, setApprovalMessage] = useState<string | null>(null);

  // Sample user data for existing users
  const existingUsers: UserData[] = useMemo(
    () => [
      { id: '234567451248', sportLevel: 'Archery - State Level', firstName: 'Shreekant', middleName: 'Gupta', lastName: 'Rahul' },
      { id: '234567451249', sportLevel: 'Archery - National Level', firstName: 'Rama', middleName: 'Mehta', lastName: 'Vijay' },
      { id: '234567451250', sportLevel: 'Archery - State Level', firstName: 'Miland', middleName: 'Singh', lastName: 'Naina' },
      { id: '234567451251', sportLevel: 'Archery - National Level', firstName: 'Ajay', middleName: 'Agrawal', lastName: 'Suraj' },
      { id: '234567451252', sportLevel: 'Archery - State Level', firstName: 'Bhanu', middleName: 'Kumaar', lastName: 'Prathamesh' },
      { id: '234567451253', sportLevel: 'Archery - National Level', firstName: 'Praveen', middleName: 'Banerjee', lastName: 'Akshay' },
      { id: '234567451254', sportLevel: 'Archery - State Level', firstName: 'Rajesh', middleName: 'Kumari', lastName: 'Khushi' },
      { id: '234567451255', sportLevel: 'Archery - National Level', firstName: 'Mohan', middleName: 'Bhatiya', lastName: 'Amit' },
    ],
    [],
  );

  const newUsers: UserData[] = useMemo(() => [...existingUsers], [existingUsers]);

  const [existingChecked, setExistingChecked] = useState<boolean[]>(
    [true, true, false, false, true, true, true, false],
  );
  const [newChecked, setNewChecked] = useState<boolean[]>(
    [true, true, false, false, true, true, true, false],
  );

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

  const handleApproveExisting = useCallback(() => {
    const selectedCount = existingChecked.filter(Boolean).length;
    if (selectedCount === 0) {
      setApprovalMessage('Please select at least one user to approve');
      setTimeout(() => setApprovalMessage(null), 3000);
    } else {
      if (onApprove) onApprove();
    }
  }, [existingChecked, onApprove]);

  const handleApproveNew = useCallback(() => {
    const selectedCount = newChecked.filter(Boolean).length;
    if (selectedCount === 0) {
      setApprovalMessage('Please select at least one user to approve');
      setTimeout(() => setApprovalMessage(null), 3000);
    } else {
      if (onApprove) onApprove();
    }
  }, [newChecked, onApprove]);

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
        <div className={styles.pageTitle}>Generate Certificate</div>

        {/* Tabs Menu */}
        <div className={styles.tabsMenu}>
          <div className={`${styles.tabChip} ${styles.tabMerit}`}>Merit/Medals</div>
          <div className={`${styles.tabChip} ${styles.tabParticipants}`}>Participants</div>
          <div className={`${styles.tabChip} ${styles.tabCoaches}`}>Coaches</div>
          <div className={`${styles.tabChip} ${styles.tabVolunteers}`}>Volunteers</div>
          <div className={`${styles.tabChip} ${styles.tabOfficials}`}>Officials</div>
        </div>

        {/* Panels */}
        <div className={styles.panelsContainer}>
          {/* Left Panel */}
          <div className={styles.panelCard}>
            <div className={styles.panelHeaderRow}>
              <div>
                <h2 className={styles.panelTitle}>Users who exist in the system</h2>
                <div className={styles.panelSubtitle}>The certificates will directly be sent to these users account.</div>
              </div>
              <button className={styles.selectAllBtn} onClick={selectAllExisting}>Select All</button>
            </div>

            <div className={styles.tableBody}>
              {existingUsers.map((user, index) => (
                <div key={user.id + index} className={styles.tableRow}>
                  <div className={styles.colId}>{user.id}</div>
                  <div className={styles.colSportLevel}>{user.sportLevel}</div>
                  <div className={styles.colName}>{user.firstName}</div>
                  <div className={styles.colName}>{user.middleName}</div>
                  <div className={styles.colName}>{user.lastName}</div>
                  <div className={styles.colAction}>
                    <button
                      className={`${styles.checkbox} ${existingChecked[index] ? styles.checkboxChecked : ''}`}
                      onClick={() => toggleExisting(index)}
                    >
                      {existingChecked[index] && (
                        <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11 1L4.125 8L1 4.81818" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.approveWrapper}>
              <button className={styles.approveFab} onClick={handleApproveExisting}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="#30DFA0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Approve</span>
              </button>
            </div>
          </div>

          {/* Right Panel */}
          <div className={styles.panelCard}>
            <div className={styles.panelHeaderRow}>
              <div>
                <h2 className={styles.panelTitle}>Users who don't exist in the system</h2>
                <div className={styles.panelSubtitle}>The system will create a new account for all of these users automatically.</div>
              </div>
              <button className={styles.selectAllBtn} onClick={selectAllNew}>Select All</button>
            </div>

            <div className={styles.tableBody}>
              {newUsers.map((user, index) => (
                <div key={user.id + index} className={styles.tableRow}>
                  <div className={styles.colId}>{user.id}</div>
                  <div className={styles.colSportLevel}>{user.sportLevel}</div>
                  <div className={styles.colName}>{user.firstName}</div>
                  <div className={styles.colName}>{user.middleName}</div>
                  <div className={styles.colName}>{user.lastName}</div>
                  <div className={styles.colAction}>
                    <button
                      className={`${styles.checkbox} ${newChecked[index] ? styles.checkboxChecked : ''}`}
                      onClick={() => toggleNew(index)}
                    >
                      {newChecked[index] && (
                        <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11 1L4.125 8L1 4.81818" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.approveWrapper}>
              <button className={styles.approveFab} onClick={handleApproveNew}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="#30DFA0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Approve</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>© 2026 SportsKeyz. Powered by SporTech Innovation. All rights reserved.</div>
      </div>

      {approvalMessage && <div className={styles.toast}>{approvalMessage}</div>}
    </div>
  );
};

export default GenerateCertificate;
