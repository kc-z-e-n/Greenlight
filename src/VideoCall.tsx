import React, { useEffect, useRef, useState } from 'react';
import DailyIframe from '@daily-co/daily-js';
import type { DailyCall } from '@daily-co/daily-js';

import { database } from './firebase';                       // ← your Firebase setup
import { ref, set } from 'firebase/database';

interface Props {
  roomUrl: string;
  sessionId: string;    // e.g. "session_abc"
  isTeacher?: boolean;  // show quiz controls only for host
}

const VideoCall: React.FC<Props> = ({ roomUrl, sessionId, isTeacher = false }) => {
  const callFrameRef = useRef<DailyCall | null>(null);

  /* ─── Quiz-control local state ─── */
  const [questionId, setQuestionId] = useState('');

  const launchQuiz = async () => {
    if (!questionId) return alert('Enter a question id (e.g. q1)');
    await set(ref(database, `quizzes/${sessionId}/activeQuiz`), questionId);
    alert(`Quiz “${questionId}” launched!`);
    setQuestionId('');
  };

  /* ─── Daily video set-up ─── */
useEffect(() => {
  const setup = async () => {
    const frame = DailyIframe.createFrame({
      showLeaveButton: true,
      iframeStyle: { width: '100%', height: '600px', border: '0' },
    });

    await frame.join({ url: roomUrl });
    callFrameRef.current = frame;

    const container = document.getElementById('video-container');
    const iframeEl = frame.iframe;
    if (container && iframeEl instanceof HTMLIFrameElement) {
      container.innerHTML = '';
      container.appendChild(iframeEl);
    }
  };

  setup(); // run the async setup

  return () => {
    callFrameRef.current?.leave();
  };
}, [roomUrl]);

  return (
    <div className="relative">
      {/* Daily iframe mounts here */}
      <div id="video-container" />

      {/* ─── Teacher-only quiz control panel ─── */}
      {isTeacher && (
        <div className="absolute top-4 right-4 w-56 bg-white rounded shadow p-4 space-y-2">
          <h3 className="font-semibold text-sm">Quiz Control</h3>
          <input
            className="border p-1 w-full text-sm"
            placeholder="question id (e.g. q1)"
            value={questionId}
            onChange={e => setQuestionId(e.target.value)}
          />
          <button
            onClick={launchQuiz}
            className="w-full bg-green-600 hover:bg-green-700 text-white text-sm py-1 rounded"
          >
            Start Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoCall;