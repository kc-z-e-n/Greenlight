// src/VideoCall.tsx
import React, { useEffect, useRef, useState } from 'react';
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
  const [questionId, setQuestionId] = useState('');

  const launchQuiz = async () => {
    if (!questionId) return alert('Enter a question id (e.g. q1)');
    await set(ref(database, `quizzes/${sessionId}/activeQuiz`), questionId);
    alert(`Quiz "${questionId}" launched!`);
    setQuestionId('');
  };

  useEffect(() => {
    const setup = async () => {
      const frame = DailyIframe.createFrame({
        showLeaveButton: true,
        iframeStyle: {
          width: '100%',
          height: '100vh',
          border: '0',
          borderRadius: '8px'
        },
      });

      await frame.join({ url: roomUrl });
      callFrameRef.current = frame;

      const container = document.getElementById('video-container');
      const iframeEl = frame.iframe;
      if (container && iframeEl instanceof HTMLIFrameElement) {
        container.innerHTML = '';
        container.appendChild(iframeEl);
        
        // Ensure the iframe takes full height of its container
        iframeEl.style.width = '100%';
        iframeEl.style.height = '100%';
      }
    };

    setup();

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
    <div className="relative w-full h-screen"> {/* Full viewport height */}
      {/* Video container with full height */}
      <div 
        id="video-container" 
        className="w-full h-full min-h-[600px]"
      />

      {/* Teacher-only quiz control panel */}
      {isTeacher && (
        <div className="absolute top-4 right-4 w-56 bg-white rounded-lg shadow-lg p-4 space-y-2 z-10">
          <h3 className="font-semibold text-sm">Quiz Control</h3>
          <input
            className="w-full p-2 border border-gray-300 rounded text-sm"
            placeholder="question id (e.g. q1)"
            value={questionId}
            onChange={e => setQuestionId(e.target.value)}
          />
          <button
            onClick={launchQuiz}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition-colors"
          >
            Start Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoCall;