import React, { useState } from 'react';
import RoomList from './RoomList';
import VideoCall from './VideoCall';
import { Link } from 'react-router-dom';

const App: React.FC = () => {
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const sessionId = 'session_abc'; 

  const handleSelectRoom = (url: string) => {
    setRoomUrl(url);
  };

  return (
    <div className="p-8">
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
          // sessionId={sessionId}
          // isTeacher={true} // render quiz launcher panel
        />
      )}
    </div>
  );
};

export default App;
