import type { FC } from 'react';
import { useState, useCallback } from 'react';
import styles from './SelectEventModal.module.css';

// Back arrow SVG component - Chevron pointing left
const BackArrowIcon = () => (
  <svg width="12" height="19" viewBox="0 0 12 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 17L2 9.5L10 2" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Sample event data
const sampleEvents = [
  { id: 1, eventId: 'EVT001', eventName: 'Karnataka Badminton Tournament', organizer: 'Sports Association', date: '2026-03-15', location: 'Bengaluru' },
  { id: 2, eventId: 'EVT002', eventName: 'State Level Football Championship', organizer: 'Football Federation', date: '2026-04-20', location: 'Mysore' },
  { id: 3, eventId: 'EVT003', eventName: 'Swimming Competition', organizer: 'Aquatic Sports', date: '2026-05-10', location: 'Mangalore' },
];

interface SelectEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEvent?: (eventId: number) => void;
  onCreateEvent?: () => void;
}

const SelectEventModal: FC<SelectEventModalProps> = ({ 
  isOpen,
  onClose,
  onSelectEvent,
  onCreateEvent 
}) => {
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const handleClose = useCallback(() => {
    setSelectedEventId(null);
    setIsSelecting(false);
    onClose();
  }, [onClose]);

  const handleCreateEvent = useCallback(() => {
    onCreateEvent?.();
  }, [onCreateEvent]);

  const handleRowClick = useCallback((eventId: number) => {
    if (isSelecting) return; // Prevent multiple clicks
    
    // Show green selection effect first
    setSelectedEventId(eventId);
    setIsSelecting(true);
    
    // After a short delay to show the effect, navigate to upload page
    setTimeout(() => {
      onSelectEvent?.(eventId);
      setIsSelecting(false);
    }, 500);
  }, [onSelectEvent, isSelecting]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header with back arrow and title */}
        <div className={styles.modalHeader}>
          <div className={styles.backButton} onClick={handleClose}>
            <BackArrowIcon />
          </div>
          <h2 className={styles.modalTitle}>Select the event</h2>
        </div>

        {/* Description */}
        <p className={styles.modalDescription}>
          <span className={styles.descriptionText}>Please choose the event for certificate generation. Can't find the name?</span>
          <span className={styles.createEventLink} onClick={handleCreateEvent}> Create Event</span>
        </p>

        {/* Table container */}
        <div className={styles.tableContainer}>
          <div className={styles.tableWrapper}>
            {/* Table header */}
            <div className={styles.tableHeader}>
              <span className={styles.headerCell}>Event Id</span>
              <span className={styles.headerCell}>Event Name</span>
              <span className={styles.headerCell}>Organizer</span>
              <span className={styles.headerCell}>Date</span>
              <span className={styles.headerCellLast}>Location</span>
            </div>

            {/* Table body with event rows */}
            <div className={styles.tableBody}>
              {sampleEvents.map((event) => (
                <div 
                  key={event.id}
                  className={`${styles.tableRow} ${selectedEventId === event.id ? styles.tableRowSelected : ''}`}
                  onClick={() => handleRowClick(event.id)}
                >
                  <span className={styles.tableCell}>{event.eventId}</span>
                  <span className={styles.tableCell}>{event.eventName}</span>
                  <span className={styles.tableCell}>{event.organizer}</span>
                  <span className={styles.tableCell}>{event.date}</span>
                  <span className={styles.tableCellLast}>{event.location}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectEventModal;