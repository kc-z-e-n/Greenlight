import React, { useState } from 'react';
import PeerFeedbackCard from './PeerFeedbackCard';
import EmotionFeedbackCard from './EmotionFeedbackCard';

const PeerFeedbackFlow: React.FC = () => {
  const [step, setStep] = useState(1);

  return (
    <div className="card">
      {step === 1 ? (
        <PeerFeedbackCard onNext={() => setStep(2)} />
      ) : (
        <EmotionFeedbackCard />
      )}
    </div>
  );
};

export default PeerFeedbackFlow;
