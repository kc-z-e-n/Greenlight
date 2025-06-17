// src/App.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import RoomList from './RoomList';
import VideoCall from './VideoCall';
import PeerFeedbackFlow from './PeerFeedbackFlow';
import AuthButtons from './components/AuthButtons';
import ClassList from './components/ClassList';
import { useAuth } from './AuthContext';

const App: React.FC = () => {
  const { user } = useAuth();                         // know the role
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const sessionId = 'session_abc'; // Reuse for quiz launcher panel

  const handleSelectRoom = (url: string) => setRoomUrl(url);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    padding: '2rem',
    minHeight: '100vh',
    alignItems: 'flex-start',
    backgroundColor: '#f9fafb',
    fontFamily: 'Arial, sans-serif',
  };

  const leftColumnStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    marginBottom: '1.5rem',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const headingStyle: React.CSSProperties = {
    fontSize: '2rem',
    fontWeight: 'bold',
    margin: 0,
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: 'flex',
    gap: '1rem',
  };

  const linkStyle: React.CSSProperties = {
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    color: 'white',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: 500,
  };

  const rightColumnStyle: React.CSSProperties = {
    width: '24rem',
    marginLeft: '2rem',
  };

  const feedbackButtonStyle: React.CSSProperties = {
    backgroundColor: '#9333ea', // purple-600
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 500,
  };

  return (
    <div style={containerStyle}>
      {/* ───────── Left column ───────── */}
      <div style={leftColumnStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h1 style={headingStyle}>Daily + Firebase Video Call</h1>
          <div style={buttonGroupStyle}>
            <AuthButtons />
          </div>
        </div>

        {/* Action buttons */}
        <div style={buttonGroupStyle}>
          <Link
            to="/create-quiz"
            style={{
              ...linkStyle,
              backgroundColor: '#2563eb', // blue-600
            }}
          >
            Create Quiz
          </Link>

          <Link
            to="/session/test123"
            style={{
              ...linkStyle,
              backgroundColor: '#16a34a', // green-600
            }}
          >
            Jump to Quiz Demo
          </Link>
        </div>

        {/* room selector or active call */}
        {!roomUrl ? (
          <RoomList onSelectRoom={handleSelectRoom} />
        ) : (
          <VideoCall
            roomUrl={roomUrl}
            sessionId={sessionId}
            isTeacher={true} // Show quiz-launch panel
          />
        )}
      </div>

      {/* ──────────────────────── Right column ──────────────────────── */}
      {roomUrl && (
        <div style={rightColumnStyle}>
          {!showFeedback ? (
            <button style={feedbackButtonStyle} onClick={() => setShowFeedback(true)}>
              Give Feedback
            </button>
          ) : (
            <PeerFeedbackFlow />
          )}
        </div>
      )}
    </div>
  );
};

export default App;
