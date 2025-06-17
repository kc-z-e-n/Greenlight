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
  }

  // * WARNING *
  // Exposing your API key here is a security risk.
  // Replace with your actual Daily.co API key:
  const DAILY_API_KEY = "a6996420daac41a5ce1562edb41ec8b6b982ddceaad91fe32dc43ecd44a207b3";

  const RoomList: React.FC<RoomListProps> = ({ onSelectRoom }) => {
    const [rooms, setRooms] = useState<Record<string, RoomWithStatus> | null>(null);
    const [loading, setLoading] = useState(true);
    console.log("here")

    // Call Daily.co API to check if the room is currently active/occupied
    const checkRoomOccupied = async (roomName: string): Promise<boolean> => {
      try {
        const response = await fetch( https://api.daily.co/v1/meetings?room=${roomName}&ongoing=true, {
          headers: {
            Authorization: Bearer ${DAILY_API_KEY},
          },
        });

        if (!response.ok) {
          console.warn(Failed to fetch room status for ${roomName});
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

    if (loading) return <p>Loading rooms...</p>;
    if (!rooms) return <p>No rooms found</p>;

    return (
      <div>
        <h2>Available Rooms</h2>
        <ul>
          {Object.entries(rooms).map(([id, room]) => (
            <li key={id} onClick={() => onSelectRoom(room.url)} style={{ cursor: "pointer" }}>
              {id} {room.isOccupied ? "(Occupied)" : "(Available)"}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  export default RoomList;