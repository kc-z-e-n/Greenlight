import React, { useState } from 'react';
import PeerFeedbackCard from './PeerFeedbackCard';
import EmotionFeedbackCard from './EmotionFeedbackCard';

interface PeerFeedbackFlowProps {
  darkMode: boolean;
}

const PeerFeedbackFlow: React.FC<PeerFeedbackFlowProps> = ({ darkMode }) => {
  const [step, setStep] = useState(1);

  const cardStyle: React.CSSProperties = {
    backgroundColor: darkMode ? '#1f2937' : '#ffffff', // gray-800 : white
    color: darkMode ? '#f9fafb' : '#111827', // gray-50 : gray-900
    border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`, // gray-700 : gray-200
    borderRadius: '0.5rem',
    padding: '1.5rem',
    boxShadow: darkMode 
      ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' 
      : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  };

  return (
    <div style={cardStyle}>
      {step === 1 ? (
        <PeerFeedbackCard onNext={() => setStep(2)} darkMode={darkMode} />
      ) : (
        <EmotionFeedbackCard darkMode={darkMode} />
      )}
    </div>
  );
};

export default PeerFeedbackFlow;