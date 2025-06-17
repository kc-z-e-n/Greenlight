import React, { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { database } from "./firebase";

interface Room {
  url: string;
}

interface RoomWithStatus extends Room {
  isOccupied: boolean;
}

interface RoomListProps {
  onSelectRoom: (url: string) => void;
  darkMode: boolean;
}

// * WARNING *
// Exposing your API key here is a security risk.
// Replace with your actual Daily.co API key:
const DAILY_API_KEY = "a6996420daac41a5ce1562edb41ec8b6b982ddceaad91fe32dc43ecd44a207b3";

const RoomList: React.FC<RoomListProps> = ({ onSelectRoom, darkMode }) => {
  const [rooms, setRooms] = useState<Record<string, RoomWithStatus> | null>(null);
  const [loading, setLoading] = useState(true);
  console.log("here")

  // Call Daily.co API to check if the room is currently active/occupied
  const checkRoomOccupied = async (roomName: string): Promise<boolean> => {
    try {
      const response = await fetch( `https://api.daily.co/v1/meetings?room=${roomName}&ongoing=true`, {
        headers: {
          Authorization: `Bearer ${DAILY_API_KEY}`,
        },
      });
      console.log("here3")

      if (!response.ok) {
        console.warn(`Failed to fetch room status for ${roomName}`);
        return false;
      }

      const data = await response.json();
      console.log("data", data.data);

      // Check if room has active participants or session is active
      // This depends on Daily.co response structure
      return data.data.length > 0
    } catch (error) {
      console.error("Error fetching room status:", error);
      return false;
    }
  };

  useEffect(() => {
    const roomsRef = ref(database, "\"rooms\"");
    const unsubscribe = onValue(roomsRef, async (snapshot) => {
      const data: Record<string, Room> | null = snapshot.val();
      if (!data) {
        setRooms(null);
        setLoading(false);
        return;
      }

      // For each room, check if occupied by calling Daily API
      const roomsWithStatus: Record<string, RoomWithStatus> = {};
      await Promise.all(
        Object.entries(data).map(async ([roomId, room]) => {
          const roomNameFromUrl = room.url.trim().split('/').pop() || roomId;
          const isOccupied = await checkRoomOccupied(roomNameFromUrl);
          roomsWithStatus[roomId] = { ...room, isOccupied };
        })
      );

      setRooms(roomsWithStatus);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const containerStyle: React.CSSProperties = {
    backgroundColor: darkMode ? '#1f2937' : '#ffffff', // gray-800 : white
    color: darkMode ? '#f9fafb' : '#111827', // gray-50 : gray-900
    padding: '1rem',
    borderRadius: '0.5rem',
  };

  const listItemStyle: React.CSSProperties = {
    cursor: "pointer",
    padding: '0.5rem',
    margin: '0.25rem 0',
    borderRadius: '0.25rem',
    backgroundColor: darkMode ? '#374151' : '#f3f4f6', // gray-700 : gray-100
    color: darkMode ? '#e5e7eb' : '#374151', // gray-200 : gray-700
    transition: 'background-color 0.2s',
  };

  if (loading) return (
    <p style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}>
      Loading rooms...
    </p>
  );
  
  if (!rooms) return (
    <p style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}>
      No rooms found
    </p>
  );

  return (
    <div style={containerStyle}>
      <h2 style={{ 
        marginBottom: '1rem',
        color: darkMode ? '#f9fafb' : '#111827',
        fontWeight: 'bold'
      }}>
        Available Rooms
      </h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {Object.entries(rooms).map(([id, room]) => (
          <li 
            key={id} 
            onClick={() => onSelectRoom(room.url)} 
            style={listItemStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = darkMode ? '#4b5563' : '#e5e7eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = darkMode ? '#374151' : '#f3f4f6';
            }}
          >
            {id} {room.isOccupied ? 
              <span style={{ color: '#ef4444' }}>(Occupied)</span> : 
              <span style={{ color: '#10b981' }}>(Available)</span>
            }
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomList;