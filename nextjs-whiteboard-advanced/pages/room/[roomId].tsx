// pages/room/[roomId].tsx

import { useRouter } from 'next/router';
import { RoomProvider, LiveblocksProvider } from '@liveblocks/react';
import { ClientSideSuspense } from '@liveblocks/react';
import dynamic from 'next/dynamic';

// Dynamically import your whiteboard UI component
const Whiteboard = dynamic(() => import('../../src/index'), {
    ssr: false,
  });
  
export default function RoomPage() {
  const router = useRouter();
  const { roomId } = router.query;

  if (!roomId || typeof roomId !== 'string') {
    return <div>Loading room...</div>;
  }

  return (
    <RoomProvider
      id={roomId}
      initialPresence={{
        selection: [],
        cursor: null,
        pencilDraft: null,
        penColor: null,
      }}
    >
      <LiveblocksProvider>
        <ClientSideSuspense fallback={<div>Loading board...</div>}>
          {() => <Whiteboard />}
        </ClientSideSuspense>
      </LiveblocksProvider>
    </RoomProvider>
  );
}
