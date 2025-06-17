import React, { useState } from 'react';
import RoomList from './RoomList';
import VideoCall from './VideoCall';
import PeerFeedbackFlow from './PeerFeedbackFlow';
import { Link } from 'react-router-dom';
import AuthButtons from './components/AuthButtons'; 

const App: React.FC = () => {
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const sessionId = 'session_abc';       // reuse for quiz launcher panel

  const handleSelectRoom = (url: string) => setRoomUrl(url);

  return (
    <div className="p-8 flex">
      {/* ───────── Left column ───────── */}
      <div className="flex-1">
        {/* Header row */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Daily + Firebase Video Call</h1>
          <AuthButtons />                 {/* login / register / logout */}
        </div>

        {/* Teacher action buttons */}
        <div className="space-x-4 mb-6">
          <Link
            to="/create-quiz"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded"
          >
            Create Quiz
          </Link>

          <Link
            to="/session/test123"
            className="inline-block px-4 py-2 bg-green-600 text-white rounded"
          >
            Jump to Quiz Demo
          </Link>
        </div>

        {/* Video-call or room selector */}
        {!roomUrl ? (
          <RoomList onSelectRoom={handleSelectRoom} />
        ) : (
          <VideoCall
            roomUrl={roomUrl}
            sessionId={sessionId}
            isTeacher={true}            // show quiz-launch panel
          />
        )}
      </div>

      {/* ───────── Right column (feedback) ───────── */}
      {roomUrl && (
        <div className="w-96 ml-8">
          {!showFeedback ? (
            <button
              className="bg-purple-600 text-white px-4 py-2 rounded"
              onClick={() => setShowFeedback(true)}
            >
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