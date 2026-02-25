import React, { useState } from 'react';
import Head from 'next/head';
import EmptyStateDashboard from '../components/empty-state/EmptyStateDashboard';
import SelectEventModal from '../components/select-event/SelectEventModal';
import UploadResultModal from '../components/upload-result/UploadResultModal';
import GenerateCertificate from '../components/generate-certificate/GenerateCertificate';
import SuccessCelebration from '../components/success-celebration/SuccessCelebration';
import CertificateDashboard from '../components/certificates/CertificateDashboard';

const HomePage: React.FC = () => {
  const [step, setStep] = useState<'empty' | 'generate' | 'dashboard'>('empty');
  const [isSelectEventOpen, setIsSelectEventOpen] = useState(false);
  const [isUploadResultOpen, setIsUploadResultOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  const handleCreateClick = () => {
    setIsSelectEventOpen(true);
  };

  const handleSelectEvent = (eventId: number) => {
    setSelectedEventId(eventId);
    setIsSelectEventOpen(false);
    setIsUploadResultOpen(true);
  };

  const handleUploadResult = (eventId: number) => {
    setIsUploadResultOpen(false);
    setStep('generate');
  };

  const handleBackToDashboard = () => {
    setStep('empty');
    setSelectedEventId(null);
  };

  const handleApprove = () => {
    setIsSuccessOpen(true);
  };

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
            setStep('dashboard'); // Redirect to populated dash instead of empty
            setSelectedEventId(null);
          }}
        />
      </div>
    </>
  );
};

export default HomePage;
