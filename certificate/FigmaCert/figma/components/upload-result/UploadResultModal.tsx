import type { FC } from 'react';
import { useState, useCallback, useMemo } from 'react';
import styles from './UploadResultModal.module.css';

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

interface UploadResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadResult?: (eventId: number) => void;
  onDownloadSample?: () => void;
  onCreateEvent?: () => void;
  selectedEventId?: number | null;
}

const UploadResultModal: FC<UploadResultModalProps> = ({ 
  isOpen,
  onClose,
  onUploadResult,
  onDownloadSample,
  onCreateEvent,
  selectedEventId 
}) => {
  const [uploadingEventId, setUploadingEventId] = useState<number | null>(null);

  // Filter events to show only the selected event
  const eventsToDisplay = useMemo(() => {
    if (selectedEventId) {
      return sampleEvents.filter(event => event.id === selectedEventId);
    }
    return sampleEvents;
  }, [selectedEventId]);

  const handleClose = useCallback(() => {
    setUploadingEventId(null);
    onClose();
  }, [onClose]);

  const handleCreateEvent = useCallback(() => {
    onCreateEvent?.();
  }, [onCreateEvent]);

  const handleDownloadSample = useCallback(() => {
    onDownloadSample?.();
  }, [onDownloadSample]);

  const handleUploadResult = useCallback((eventId: number) => {
    setUploadingEventId(eventId);
    onUploadResult?.(eventId);
  }, [onUploadResult]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header with back arrow, title and download sample button */}
        <div className={styles.modalHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.backButton} onClick={handleClose}>
              <BackArrowIcon />
            </div>
            <h2 className={styles.modalTitle}>Upload Result</h2>
          </div>
          <button className={styles.downloadSampleButton} onClick={handleDownloadSample}>
            Download Sample
          </button>
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
              <span className={styles.headerCell}>Location</span>
              <span className={styles.headerCellLast}>Upload Result</span>
            </div>

            {/* Table body with event rows */}
            <div className={styles.tableBody}>
              {eventsToDisplay.map((event) => (
                <div 
                  key={event.id}
                  className={styles.tableRow}
                >
                  <span className={styles.tableCell}>{event.eventId}</span>
                  <span className={styles.tableCell}>{event.eventName}</span>
                  <span className={styles.tableCell}>{event.organizer}</span>
                  <span className={styles.tableCell}>{event.date}</span>
                  <span className={styles.tableCell}>{event.location}</span>
                  <div className={styles.tableCellLast}>
                    <button 
                      className={styles.uploadResultButton}
                      onClick={() => handleUploadResult(event.id)}
                    >
                      Upload Result
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadResultModal;
