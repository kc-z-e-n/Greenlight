import React, { useState, useEffect } from 'react';
import { Link , useNavigate} from 'react-router-dom';
import RoomList from './RoomList';
import VideoCall from './VideoCall';
import PeerFeedbackFlow from './PeerFeedbackFlow';
import AuthButtons from './components/AuthButtons';
import ClassList from './components/ClassList';
import { useAuth } from './AuthContext';

const App: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const [darkMode, setDarkMode] = useState(false);

  // Detect system dark mode preference
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setDarkMode(mq.matches);

    const handler = (e: MediaQueryListEvent) => setDarkMode(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const sessionId = 'session_abc';
  const handleSelectRoom = (url: string) => {
    // encode the URL so it can safely go in the URL path
    const encodedUrl = encodeURIComponent(url);
    navigate(`/video-call/${encodedUrl}`);
  };

  // Common colors depending on mode
  const colors = {
    background: darkMode ? '#121212' : '#f9fafb',
    textPrimary: darkMode ? '#f9fafb' : '#111827', // lighter text on dark bg, dark text on light bg
    textSecondary: darkMode ? '#d1d5db' : '#6b7280',
    border: darkMode ? '#374151' : '#e5e7eb',
    purple: '#9333ea',
    blue: '#2563eb',
    green: '#16a34a',
    buttonText: '#fff',
  };

  const container: React.CSSProperties = {
    display: 'flex',
    padding: '2rem',
    minHeight: '100vh',
    backgroundColor: colors.background,
    fontFamily: 'Arial, sans-serif',
    color: colors.textPrimary,
  };

  const leftCol: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  };

  const header: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const h1: React.CSSProperties = {
    fontSize: '2rem',
    fontWeight: 'bold',
    margin: 0,
  };

  const btnStack: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  };

  const btn = (bg: string): React.CSSProperties => ({
    backgroundColor: bg,
    color: colors.buttonText,
    textAlign: 'center',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: 500,
    userSelect: 'none',
  });

  const outlineBtn: React.CSSProperties = {
    border: `1px solid ${colors.border}`,
    color: colors.textSecondary,
    textAlign: 'center',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: 500,
    userSelect: 'none',
    backgroundColor: 'transparent',
  };

  const rightCol: React.CSSProperties = { width: '24rem', marginLeft: '2rem' };

  const feedbackBtn: React.CSSProperties = {
    backgroundColor: colors.purple,
    color: colors.buttonText,
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 500,
  };

  return (
    <div style={container}>
      {/* ───────── Left column ───────── */}
      <div style={leftCol}>
        {/* header */}
        <div style={header}>
          <h1 style={h1}>Daily + Firebase Video Call</h1>
          <AuthButtons darkMode={darkMode} />
        </div>

        {/* teacher-only actions */}
        {user?.role === 'teacher' && (
          <div style={btnStack}>
            <Link to="/create-class" style={btn(colors.purple)}>Create Class</Link>
            <Link to="/add-student" style={outlineBtn}>Add Student</Link>
            <Link to="/create-quiz" style={btn(colors.blue)}>Create Quiz</Link>
            <Link to="/session/test123" style={btn(colors.green)}>Jump to Quiz Demo</Link>
          </div>
        )}

        {/* list the classes this user belongs to */}
        <ClassList darkMode={darkMode} />

        {/* room selector OR active call */}
          <RoomList onSelectRoom={handleSelectRoom} darkMode={darkMode} />
      </div>

      {/* ───────── Right column ───────── */}
      {roomUrl && (
        <div style={rightCol}>
          {!showFeedback ? (
            <button style={feedbackBtn} onClick={() => setShowFeedback(true)}>
              Give Feedback
            </button>
          ) : (
            <PeerFeedbackFlow darkMode={darkMode} />
          )}
        </div>
      )}
    </div>
  );
};

export default App;
