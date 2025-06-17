// src/VideoCall.tsx
import React, { useEffect, useRef, useState } from 'react';
import DailyIframe from '@daily-co/daily-js';
import type { DailyCall } from '@daily-co/daily-js';
import { ref, set } from 'firebase/database';

import { database } from './firebase';
import { useAuth } from './AuthContext';

/* ──────────────────── Types ──────────────────── */
interface VideoCallProps {
  roomUrl: string;                 // Daily room URL
  sessionId: string;               // Fallback quiz session id
  isTeacher?: boolean;             // host flag
  classId?: string;                // Optional: class key (preferred for quizzes)
}

/* ──────────────────── Component ──────────────────── */
  const VideoCall: React.FC<VideoCallProps> = ({
    roomUrl,
    sessionId,
    isTeacher = false,
    classId,
  }) => {
    const { user } = useAuth();
    const callFrameRef = useRef<DailyCall | null>(null); // keep Daily instance
    const [quizId, setQuizId] = useState('');            // text box state

  /* ────────────── Effect: mount Daily iframe ────────────── */
    useEffect(() => {
      const setupCall = async () => {
        const frame = DailyIframe.createFrame({
          showLeaveButton: true,
          iframeStyle: {
            width: '100%',
            height: '600px',
            border: '0',
            borderRadius: '0.5rem',
          },
        });

        frame.join({ url: roomUrl });
        callFrameRef.current = frame;

        const container = document.getElementById('video-container');
        const iframeEl = frame.iframe;
        if (container && iframeEl instanceof HTMLIFrameElement) {
          container.innerHTML = '';
          container.appendChild(iframeEl);
        }
      };

      setupCall(); // Call the async function

      return () => {
        callFrameRef.current?.leave();
      };
    }, [roomUrl]);

  /* ────────────── Teacher: launch quiz ────────────── */
  const launchQuiz = async () => {
    if (!quizId.trim()) return alert('Enter a quiz id first!');
    const path = classId
      ? `classes/${classId}/activeQuiz`
      : `quizzes/${sessionId}/activeQuiz`;
    await set(ref(database, path), quizId.trim());
    alert(`Quiz "${quizId}" launched!`);
    setQuizId('');
  };

  /* ──────────────────── Render ──────────────────── */
  return (
    <div className="relative">
      <div id="video-container" />

      {/* Teacher bottom bar */}
      {isTeacher && (
        <div className="absolute inset-x-0 bottom-0 flex justify-center p-4 bg-white/80 backdrop-blur">
          <div className="flex items-center gap-2">
            <input
              className="border px-2 py-1 text-sm rounded"
              value={quizId}
              onChange={(e) => setQuizId(e.target.value)}
              placeholder="quiz id (e.g. q1)"
            />
            <button
              className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded"
              onClick={launchQuiz}
            >
              Start Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCall;
