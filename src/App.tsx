// src/App.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import RoomList from './RoomList';
import VideoCall from './VideoCall';
import PeerFeedbackFlow from './PeerFeedbackFlow';
import AuthButtons from './components/AuthButtons';
import ClassList from './components/ClassList';       // ★ new
import { useAuth } from './AuthContext';

const App: React.FC = () => {
  const { user } = useAuth();                         // know role
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const sessionId = 'session_abc';
  const handleSelectRoom = (url: string) => setRoomUrl(url);

  /* ── simple inline styles to match your current aesthetic ── */
  const container: React.CSSProperties = {
    display: 'flex',
    padding: '2rem',
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    fontFamily: 'Arial, sans-serif',
  };
  const leftCol: React.CSSProperties = { flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' };
  const header: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
  const h1: React.CSSProperties = { fontSize: '2rem', fontWeight: 'bold', margin: 0 };
  const btnStack: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '0.75rem' };
  const btn = (bg: string): React.CSSProperties => ({
    backgroundColor: bg,
    color: 'white',
    textAlign: 'center',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: 500,
  });
  const outlineBtn: React.CSSProperties = {
    border: '1px solid #4b5563',
    color: '#374151',
    textAlign: 'center',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: 500,
  };
  const rightCol: React.CSSProperties = { width: '24rem', marginLeft: '2rem' };
  const feedbackBtn: React.CSSProperties = btn('#9333ea');

  return (
    <div style={container}>
      {/* ───────── Left column ───────── */}
      <div style={leftCol}>
        {/* header */}
        <div style={header}>
          <h1 style={h1}>Daily + Firebase Video Call</h1>
          <AuthButtons />
        </div>

        {/* teacher-only actions */}
        {user?.role === 'teacher' && (
          <div style={btnStack}>
            <Link to="/create-class" style={btn('#7c3aed')}>Create Class</Link>
            <Link to="/add-student"  style={outlineBtn}>Add Student</Link>
            <Link to="/create-quiz"  style={btn('#2563eb')}>Create Quiz</Link>
            <Link to="/session/test123" style={btn('#16a34a')}>Jump to Quiz Demo</Link>
          </div>
        )}

        {/* list the classes this user belongs to */}
        <ClassList />

        {/* room selector OR active call */}
        {!roomUrl ? (
          <RoomList onSelectRoom={handleSelectRoom} />
        ) : (
          <VideoCall
            roomUrl={roomUrl}
            sessionId={sessionId}
            isTeacher={user?.role === 'teacher'}
          />
        )}
      </div>

      {/* ───────── Right column ───────── */}
      {roomUrl && (
        <div style={rightCol}>
          {!showFeedback ? (
            <button style={feedbackBtn} onClick={() => setShowFeedback(true)}>
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
