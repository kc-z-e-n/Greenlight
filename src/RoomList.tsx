// src/RoomList.tsx
import React, { useEffect, useState } from 'react';
import { onValue, ref, get } from 'firebase/database';
import {database} from './firebase'

interface Room {
  url: string;
}

interface RoomListProps {
  onSelectRoom: (url: string) => void;
}

const RoomList: React.FC<RoomListProps> = ({ onSelectRoom }) => {
  const [rooms, setRooms] = useState<Record<string, Room> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
  const rootRef = ref(database, "/");
  get(rootRef).then(snapshot => {
    console.log("🔥 Root snapshot:", snapshot.val());
  });
}, []);

  useEffect(() => {
    const roomsRef = ref(database, "\"rooms\"");
    get(roomsRef).then(snapshot => {
    console.log("🔥 Room snapshot:", snapshot.val());
  });
    const unsubscribe = onValue(roomsRef, (snapshot) => {
      const data = snapshot.val();
      console.log("data", data)
      setRooms(data);
      setLoading(false);
    });

    return () => unsubscribe(); // unsubscribe when component unmounts
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!rooms) return <p>No rooms found</p>;

  return (
    <div>
      <h2>Available Rooms</h2>
      <ul>
        {Object.entries(rooms).map(([id, room]) => (
          <li key={id} onClick={() => onSelectRoom(room.url)}>
            {id}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomList;
