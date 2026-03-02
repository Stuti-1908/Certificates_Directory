import type { FC } from 'react';
import { useState, useCallback, useMemo, useRef } from 'react';
import styles from './UploadResultModal.module.css';

// Back arrow SVG component - Chevron pointing left
const BackArrowIcon = () => (
  <svg width="12" height="19" viewBox="0 0 12 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 17L2 9.5L10 2" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Sample event data (fallback when no events are passed)
const sampleEvents = [
  { id: 1, eventId: 'EVT001', eventName: 'Karnataka Badminton Tournament', organizer: 'Sports Association', date: '2026-03-15', location: 'Bengaluru' },
  { id: 2, eventId: 'EVT002', eventName: 'State Level Football Championship', organizer: 'Football Federation', date: '2026-04-20', location: 'Mysore' },
  { id: 3, eventId: 'EVT003', eventName: 'Swimming Competition', organizer: 'Aquatic Sports', date: '2026-05-10', location: 'Mangalore' },
];

interface UploadResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadResult?: (eventId: number, participants: any[]) => void;
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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter events to show only the selected event
  const eventsToDisplay = useMemo(() => {
    if (selectedEventId) {
      return sampleEvents.filter(event => event.id === selectedEventId);
    }
    return sampleEvents;
  }, [selectedEventId]);

  const handleClose = useCallback(() => {
    setUploadingEventId(null);
    setUploadError(null);
    setIsUploading(false);
    onClose();
  }, [onClose]);

  const handleCreateEvent = useCallback(() => {
    onCreateEvent?.();
  }, [onCreateEvent]);

  const handleDownloadSample = useCallback(async () => {
    if (onDownloadSample) {
      onDownloadSample();
      return;
    }
    // Default: download from API
    try {
      const response = await fetch('/api/download-sample-csv');
      if (!response.ok) throw new Error('Failed to download sample CSV');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sample-participants.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to download sample CSV');
    }
  }, [onDownloadSample]);

  const handleUploadClick = useCallback((eventId: number) => {
    setUploadingEventId(eventId);
    setUploadError(null);
    // Trigger the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset to allow re-selecting the same file
      fileInputRef.current.click();
    }
  }, []);

  const handleFileSelected = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      setUploadError('Please upload a .csv file');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('csvFile', file);

      const response = await fetch('/api/upload-csv', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to parse CSV file');
      }

      // Success — pass parsed participants back to parent
      setIsUploading(false);
      onUploadResult?.(uploadingEventId!, data.participants);
    } catch (err: any) {
      setIsUploading(false);
      setUploadError(err.message || 'Failed to upload CSV file');
    }
  }, [uploadingEventId, onUploadResult]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Hidden file input for CSV upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          style={{ display: 'none' }}
          onChange={handleFileSelected}
        />

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

        {/* Error message */}
        {uploadError && (
          <div style={{
            background: '#ff4d4f20',
            border: '1px solid #ff4d4f',
            borderRadius: '8px',
            padding: '10px 16px',
            margin: '0 0 16px 0',
            color: '#ff4d4f',
            fontSize: '14px',
          }}>
            {uploadError}
          </div>
        )}

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
                      onClick={() => handleUploadClick(event.id)}
                      disabled={isUploading}
                    >
                      {isUploading && uploadingEventId === event.id ? 'Uploading...' : 'Upload Result'}
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
