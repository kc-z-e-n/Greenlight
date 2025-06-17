/*import React, { useState } from 'react';
import RoomList from './RoomList';
import VideoCall from './VideoCall';
import { Link } from 'react-router-dom';
import PeerFeedbackCard from './PeerFeedbackCard';
import EmotionFeedbackCard from './EmotionFeedbackCard';
import './App.css';

const App: React.FC = () => {
  const [step, setStep] = useState(1);
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const sessionId = 'session_abc'; 

  const handleNextFeedback = () => {
    setStep((prev) => prev + 1);
  };

  const handleSelectRoom = (url: string) => {
    setRoomUrl(url);
  };

  return (
    <div className="p-8 app-wrapper">
      <h1 className="text-3xl mb-6">EduCollab</h1>

      {step === 1 && <PeerFeedbackCard onNext={handleNextFeedback} />}
      {step === 2 && <EmotionFeedbackCard />}

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

      {!roomUrl ? (
        <RoomList onSelectRoom={handleSelectRoom} />
      ) : (
        <VideoCall
          roomUrl={roomUrl}
          sessionId={sessionId}
          isTeacher={true} // render quiz launcher panel
        />
      )}
    </div>
  );
};

export default App;
*/

import React, { useState } from 'react';
import RoomList from './RoomList';
import VideoCall from './VideoCall';
import PeerFeedbackFlow from './PeerFeedbackFlow';
import { Link } from 'react-router-dom';

const App: React.FC = () => {
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const sessionId = 'session_abc';

  const handleSelectRoom = (url: string) => {
    setRoomUrl(url);
  };

  return (
    <div className="p-8 flex">
      {/* Left column */}
      <div className="flex-1">
        <h1 className="text-3xl mb-6">Daily + Firebase Video Call</h1>

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

        {!roomUrl ? (
          <RoomList onSelectRoom={handleSelectRoom} />
        ) : (
          <VideoCall
            roomUrl={roomUrl}
            sessionId={sessionId}
            isTeacher={true}
          />
        )}
      </div>

      {/* Right column: only show after joining call */}
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
