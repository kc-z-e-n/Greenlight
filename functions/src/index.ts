import * as functions from 'firebase-functions';
import axios from 'axios';

// Load env variables from .env
import * as dotenv from 'dotenv';
dotenv.config();

export const checkRoomStatus = functions.https.onRequest(async (req, res) => {
  const roomName = req.query.roomName as string;

  if (!roomName) {
    res.status(400).json({ error: 'Missing roomName query param' });
    return;
  }

  try {
    const response = await axios.get(`https://api.daily.co/v1/rooms/${roomName}`, {
      headers: {
        Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
      },
    });

    // This is just an example check. Adjust according to your use case.
    const isMeetingRunning = response.data?.config?.start_video_off === false;

    res.json({ isMeetingRunning });
  } catch (error) {
    console.error(error)
  }
});
