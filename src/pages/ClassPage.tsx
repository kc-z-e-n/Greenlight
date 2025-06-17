import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, get, set } from 'firebase/database';
import { database } from '../firebase';
import { useAuth } from '../AuthContext';
import VideoCall from '../VideoCall';

const ClassPage: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [className, setClassName] = useState('');

  /* fetch class info once */
  useEffect(() => {
    if (!classId) return;
    (async () => {
      const snap = await get(ref(database, `classes/${classId}`));
      if (!snap.exists()) return navigate('/');
      const data = snap.val();
      setClassName(data.name);
      setRoomUrl(data.roomUrl ?? null);       // assumes you've stored roomUrl here
    })();
  }, [classId]);

  if (!classId) return null;

  const handleCreateRoom = async () => {
    const url = prompt('Paste Daily room URL');
    if (!url) return;
    await set(ref(database, `classes/${classId}/roomUrl`), url);
    setRoomUrl(url);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{className}</h1>

      {!roomUrl ? (
        user?.role === 'teacher' ? (
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded"
            onClick={handleCreateRoom}
          >
            Set Call URL
          </button>
        ) : (
          <p className="italic">Teacher hasn’t set the call yet.</p>
        )
      ) : (
        <VideoCall
          roomUrl={roomUrl}
          sessionId={classId}          // use classId for quizzes
          isTeacher={user?.role === 'teacher'}
          classId={classId}            // pass to VideoCall for quiz button
        />
      )}
    </div>
  );
};

export default ClassPage;
