// src/VideoCall.tsx — safe frame replacement with delay
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DailyIframe from '@daily-co/daily-js';
import type { DailyCall } from '@daily-co/daily-js';
import { database } from './firebase';
import { ref, set } from 'firebase/database';

interface Props {
  roomUrl: string;
  sessionId: string;
  isTeacher?: boolean;
}

const VideoCall: React.FC<Props> = ({ roomUrl, sessionId, isTeacher = false }) => {
  const callFrameRef = useRef<DailyCall | null>(null);
  const navigate = useNavigate();
  const [questionId, setQuestionId] = useState('');

  const launchQuiz = async () => {
    if (!questionId) return alert('Enter a question id (e.g. q1)');
    await set(ref(database, `quizzes/${sessionId}/activeQuiz`), questionId);
    alert(`Quiz "${questionId}" launched!`);
    setQuestionId('');
  };

  // 🔁 destroy returns a Promise so we can await
  const destroyFrame = async () => {
    const frame = callFrameRef.current;
    if (!frame) return;

    try {
      await frame.leave();
    } catch (e) {
      console.warn('Leave error:', e);
    }

    frame.destroy();
    callFrameRef.current = null;

    const container = document.getElementById('video-container');
    if (container) container.innerHTML = '';
  };

  const leaveAndBack = async () => {
    await destroyFrame();
    navigate(-1);
  };

  useEffect(() => {
    const setup = async () => {
      await destroyFrame(); // ✅ wait for any existing frame to be gone

      const frame = DailyIframe.createFrame({
        showLeaveButton: true,
        iframeStyle: { width: '100vw', height: '100vh', border: '0' },
      });

      callFrameRef.current = frame;

      const container = document.getElementById('video-container');
      const iframe = frame.iframe() as HTMLIFrameElement | null;
      if (container && iframe) {
        container.innerHTML = '';
        container.appendChild(iframe);
      }

      await frame.join({ url: roomUrl });
      frame.on('left-meeting', leaveAndBack);
    };

    setup();
    return () => { destroyFrame(); };
  }, [roomUrl]);

  return (
    <div className="relative w-full h-screen">
      <button
        onClick={leaveAndBack}
        className="absolute top-3 left-3 bg-gray-700 text-white px-3 py-1 rounded z-20"
      >
        ← Back
      </button>

      <div
        id="video-container"
        style={{ minWidth: 700, minHeight: 600 }}
        className="w-full h-full"
      />

      {isTeacher && (
        <div className="absolute top-4 right-4 w-56 bg-white rounded-lg shadow p-4 space-y-2 z-10">
          <h3 className="font-semibold text-sm">Quiz Control</h3>
          <input
            className="w-full p-2 border rounded text-sm"
            placeholder="question id (e.g. q1)"
            value={questionId}
            onChange={(e) => setQuestionId(e.target.value)}
          />
          <button
            onClick={launchQuiz}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
          >
            Start Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoCall;
