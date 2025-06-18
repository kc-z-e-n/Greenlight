import React from 'react';
import PeerFeedbackFlow from './PeerFeedbackFlow';
import { useAuth } from './AuthContext';

const FeedbackPage: React.FC = () => {
  const { user } = useAuth();
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (user?.role !== 'student') return null;

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
        We'd love your feedback!
      </h2>
      <PeerFeedbackFlow darkMode={prefersDark} />
    </div>
  );
};

export default FeedbackPage;
