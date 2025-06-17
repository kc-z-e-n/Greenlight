import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useParams, Navigate } from 'react-router-dom';
import AppHome from './App';
import Whiteboard from './pages/Whiteboard';
import SessionRoom from './pages/SessionRoom';          
import './index.css';  
import CreateQuizForm from './pages/CreateQuizForm';
import AuthPage from './pages/AuthPage';
import { AuthProvider, useAuth } from './AuthContext'; 
import CreateClass from './pages/CreateClass';
import AddStudentToClass from './pages/AddStudentToClass';
import ClassPage from './pages/ClassPage';
import VideoCall from './VideoCall';

// Wrapper for VideoCall route to extract params and auth info
const VideoCallWrapper: React.FC = () => {
  const { user } = useAuth();
  const { roomUrl } = useParams<{ roomUrl: string }>();
  const sessionId = 'session_abc'; // or get this dynamically if needed

  if (!roomUrl) return <div>No room selected</div>;

  const decodedRoomUrl = decodeURIComponent(roomUrl);

  return (
    <VideoCall 
      roomUrl={decodedRoomUrl} 
      sessionId={sessionId} 
      isTeacher={user?.role === 'teacher'} 
    />
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider> 
      <BrowserRouter>
        <Routes>
          {/* Landing page = Daily video demo */}
          <Route path="/" element={<AppHome />} />
          <Route path="/whiteboard" element={<Whiteboard />} />

          {/* Quiz room  */}
          <Route path="/session/:sessionId" element={<SessionRoom />} />
          <Route path="/create-quiz" element={<CreateQuizForm />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/create-class" element={<CreateClass />} />
          <Route path="/add-student" element={<AddStudentToClass />} />

          {/* New Video Call route */}
          <Route path="/video-call/:roomUrl" element={<VideoCallWrapper />} />

          {/* fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/class/:classId/*"   element={<ClassPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);