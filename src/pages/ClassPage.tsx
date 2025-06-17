// ClassPage.tsx  — shows the single room for this class
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDatabase, ref, get } from 'firebase/database';
import RoomList from '../RoomList';                     // ← reuse the list
import { useAuth } from '../AuthContext';

const ClassPage: React.FC = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [className, setClassName] = useState('Loading…');
  const [error, setError] = useState<string | null>(null);

  /* fetch class meta (name, etc.) */
  useEffect(() => {
    if (!classId) return;
    const fetch = async () => {
      try {
        const db = getDatabase();
        const snap = await get(ref(db, `classes/${classId}`));
        if (!snap.exists()) {
          setError('Class not found');
          return;
        }
        const data = snap.val();
        setClassName(data.name ?? `Class ${classId}`);
      } catch (e: any) {
        setError(e.message ?? 'Unknown error');
      }
    };
    fetch();
  }, [classId]);

  /* join handler reused by RoomList */
  const handleJoin = (url: string) => {
    navigate(`/video-call/${encodeURIComponent(url)}`);
  };

  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">{className}</h1>

      {/* one-room list scoped to this class */}
      <RoomList
        onSelectRoom={handleJoin}
        darkMode={false}
        classId={classId}          // ← filter by this class
      />

      {/* optional teacher-only extras could go here */}
      {user?.role === 'teacher' && (
        <p className="text-sm text-gray-500">
          (Teacher view — you could add room-management here)
        </p>
      )}
    </div>
  );
};

export default ClassPage;
