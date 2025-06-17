// src/App.tsx
import React, { useState } from 'react';
import RoomList from './RoomList';
import VideoCall from './VideoCall';


const App: React.FC = () => {
  const [roomUrl, setRoomUrl] = useState<string | null>(null);

  const handleSelectRoom = (url: string) => {
    setRoomUrl(url);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl mb-6">Daily + Firebase Video Call</h1>
      {!roomUrl ? (
        <RoomList onSelectRoom={handleSelectRoom} />
      ) : (
        <VideoCall roomUrl={roomUrl} />
      )}
    </div>
  );
};

export default App;
