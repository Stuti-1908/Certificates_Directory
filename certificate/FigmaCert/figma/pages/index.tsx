import React, { useState, useCallback, useEffect } from 'react';
import Head from 'next/head';
import EmptyStateDashboard from '../components/empty-state/EmptyStateDashboard';
import SelectEventModal from '../components/select-event/SelectEventModal';
import UploadResultModal from '../components/upload-result/UploadResultModal';
import GenerateCertificate from '../components/generate-certificate/GenerateCertificate';
import SuccessCelebration from '../components/success-celebration/SuccessCelebration';
import CertificateDashboard from '../components/certificates/CertificateDashboard';

// Shared participant interface
export interface ParticipantData {
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

// Generation result from the API
export interface GenerationResult {
  results: Array<{
    filePath?: string;
    fileName?: string;
    certId?: string;
    name?: string;
    type?: string;
    url?: string;
    error?: string;
  }>;
  successCount: number;
  failCount: number;
  total: number;
  byType: Record<string, any[]>;
}

// History entry stored in localStorage
export interface CertificateHistoryEntry {
  id: string;
  eventName: string;
  sport: string;
  date: string;
  totalCertificates: number;
  successCount: number;
  results: GenerationResult['results'];
  createdAt: string;
}

const HISTORY_STORAGE_KEY = 'certificate-generation-history';

function loadHistory(): CertificateHistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(history: CertificateHistoryEntry[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
}

const HomePage: React.FC = () => {
  const [step, setStep] = useState<'empty' | 'generate' | 'dashboard'>('empty');

  // Check localStorage on mount to determine initial view
  useEffect(() => {
    const history = loadHistory();
    if (history.length > 0) {
      setStep('dashboard');
    }
  }, []);
  const [isSelectEventOpen, setIsSelectEventOpen] = useState(false);
  const [isUploadResultOpen, setIsUploadResultOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  // Real data state
  const [parsedParticipants, setParsedParticipants] = useState<ParticipantData[]>([]);
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);
  const [selectedEventName, setSelectedEventName] = useState<string>('');

  // Event name mapping (from the modals' sample data)
  const eventNames: Record<number, string> = {
    1: 'Karnataka Badminton Tournament',
    2: 'State Level Football Championship',
    3: 'Swimming Competition',
  };

  const handleCreateClick = () => {
    setIsSelectEventOpen(true);
  };

  const handleSelectEvent = (eventId: number) => {
    setSelectedEventId(eventId);
    setSelectedEventName(eventNames[eventId] || `Event ${eventId}`);
    setIsSelectEventOpen(false);
    setIsUploadResultOpen(true);
  };

  const handleUploadResult = useCallback((eventId: number, participants: ParticipantData[]) => {
    setParsedParticipants(participants);
    setIsUploadResultOpen(false);
    setStep('generate');
  }, []);

  const handleBackToDashboard = () => {
    setStep('empty');
    setSelectedEventId(null);
    setParsedParticipants([]);
    setGenerationResult(null);
  };

  const handleApprove = useCallback((result: GenerationResult) => {
    setGenerationResult(result);

    // Save to history
    const history = loadHistory();
    const firstParticipant = parsedParticipants[0];
    const historyEntry: CertificateHistoryEntry = {
      id: Date.now().toString(36),
      eventName: selectedEventName || firstParticipant?.eventName || 'Unknown Event',
      sport: firstParticipant?.sport || 'Unknown Sport',
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      totalCertificates: result.total,
      successCount: result.successCount,
      results: result.results,
      createdAt: new Date().toISOString(),
    };
    history.unshift(historyEntry);
    saveHistory(history);

    setIsSuccessOpen(true);
  }, [parsedParticipants, selectedEventName]);

  return (
    <>
      <Head>
        <title>SportsKeyz - Certificate Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div style={{ minHeight: '100vh', background: '#1a1a1a' }}>
        {step === 'empty' && (
          <EmptyStateDashboard
            onCreateClick={handleCreateClick}
          />
        )}

        {step === 'dashboard' && (
          <CertificateDashboard
            onCreateClick={handleCreateClick}
            onNavigate={() => { }}
          />
        )}

        {step === 'generate' && (
          <GenerateCertificate
            onBack={handleBackToDashboard}
            onApprove={handleApprove}
            participants={parsedParticipants}
            eventName={selectedEventName}
          />
        )}

        <SelectEventModal
          isOpen={isSelectEventOpen}
          onClose={() => setIsSelectEventOpen(false)}
          onSelectEvent={handleSelectEvent}
        />

        <UploadResultModal
          isOpen={isUploadResultOpen}
          onClose={() => setIsUploadResultOpen(false)}
          selectedEventId={selectedEventId}
          onUploadResult={handleUploadResult}
        />

        <SuccessCelebration
          isOpen={isSuccessOpen}
          onClose={() => {
            setIsSuccessOpen(false);
            setStep('dashboard');
            setSelectedEventId(null);
            setParsedParticipants([]);
            setGenerationResult(null);
          }}
          eventName={selectedEventName}
          registeredCount={generationResult?.successCount ?? 0}
          nonRegisteredCount={generationResult?.failCount ?? 0}
        />
      </div>
    </>
  );
};

export default HomePage;
