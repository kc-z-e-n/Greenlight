// RoomList.tsx  — now falls back to the class's own roomUrl
import React, { useEffect, useState } from 'react';
import {
  getDatabase,
  ref,
  onValue,
  get,
  child,
} from 'firebase/database';

interface Room {
  id: string;
  name: string;
  url: string;
  classId?: string;
}

interface Props {
  onSelectRoom: (url: string) => void;
  darkMode: boolean;
  classId?: string;          // optional class filter
}

const RoomList: React.FC<Props> = ({ onSelectRoom, darkMode, classId }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  /* ───────── Live listener on /rooms ───────── */
  useEffect(() => {
    const db = getDatabase();
    const roomsRef = ref(db, 'rooms');
    const off = onValue(
      roomsRef,
      snap => {
        if (!snap.exists()) {
          setRooms([]);
          return;
        }
        const raw = snap.val();
        const list: Room[] = Object.keys(raw).map(id => ({ id, ...raw[id] }));
        const filtered = classId ? list.filter(r => r.classId === classId) : list;
        setRooms(filtered);
      },
      { onlyOnce: false }
    );
    return () => off();
  }, [classId]);

  /* ───────── One-time fallback: class/{classId}/roomUrl ───────── */
  useEffect(() => {
    if (!classId) {
      setLoading(false);
      return;
    }
    const fetchFallback = async () => {
      const db = getDatabase();
      const snap = await get(child(ref(db), `classes/${classId}/roomUrl`));
      if (snap.exists()) {
        setRooms([
          {
            id: classId,
            name: 'Class Room',
            url: snap.val(),
            classId,
          },
        ]);
      }
      setLoading(false);
    };
    fetchFallback();
  }, [classId]);

  if (loading) return <p className="text-gray-500">Loading…</p>;

  if (rooms.length === 0)
    return (
      <p style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}>
        No active rooms.
      </p>
    );

  return (
    <div className="space-y-2">
      {rooms.map(r => (
        <button
          key={r.id}
          onClick={() => onSelectRoom(r.url)}
          className="w-full px-4 py-2 text-left bg-gray-200 hover:bg-gray-300 rounded"
        >
          {r.name}
        </button>
      ))}
    </div>
  );
};

export default RoomList;
