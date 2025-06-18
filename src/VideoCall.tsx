// src/VideoCall.tsx — safe frame replacement with delay
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DailyIframe from '@daily-co/daily-js';
import type { DailyCall } from '@daily-co/daily-js';
import { database } from './firebase';
import { ref, set, onValue, get } from 'firebase/database';
import QuizPopup from './components/QuizPopup';

interface Props {
  roomUrl: string;
  isTeacher?: boolean;
  classId?: string;
}

type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: string;
};

const VideoCall: React.FC<Props> = ({ roomUrl, isTeacher = false, classId = 'c001' }) => {
  const callFrameRef = useRef<DailyCall | null>(null);
  const [quizId, setQuizId] = useState('');
  const [showQuizPopup, setShowQuizPopup] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const navigate = useNavigate();
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);

  // Listen for quiz launch events (for students)
  useEffect(() => {
    if (isTeacher) return;

    const quizRef = ref(database, `classes/${classId}/activeQuiz`);

    const unsubscribe = onValue(quizRef, async (snapshot) => {
      const quizId = snapshot.val(); // should be like "q1" or "quiz123"
      console.log(quizId)

      if (!quizId) {
        setShowQuizPopup(false);
        setQuizId('');
        return;
      }

      try {
        const quizDataRef = ref(database, `quizzes/${classId}/${quizId}/questionBank`);
        const quizSnapshot = await get(quizDataRef);
        const quizData = quizSnapshot.val();

        if (quizSnapshot.exists()) {
          setQuizId(quizId); // Save current quizId
          setShowQuizPopup(true); // Show quiz popup
          // Optional: fetch & set questions if needed here
          const quizData = quizSnapshot.val();
          if (quizData) {
            // Transform raw data object into array
            const parsedQuestions: QuizQuestion[] = Object.entries(quizData).map(
              ([id, data]: [string, any]) => ({
                id,
                question: data.question,
                options: data.options,
                answer: data.answer,
              })
            );
            console.log(parsedQuestions)
            setQuizQuestions(parsedQuestions);
          }
        } else {
          console.warn(`Quiz data not found at quizzes/${classId}/${quizId}/questionBank`);
          setShowQuizPopup(false);
        }
      } catch (err) {
        console.error('Error fetching quiz data:', err);
        setShowQuizPopup(false);
      }
    });

    return () => unsubscribe();
  }, [quizId, isTeacher]);


  // Teacher launches quiz
  const launchQuiz = async () => {
    if (!quizId.trim()) {
      alert('Please enter a quiz ID');
      return;
    }

    try {
      // Write to database to notify students
      await set(ref(database, `classes/${classId}/activeQuiz`), quizId.trim());
      setShowQuizPopup(true); // Show popup for teacher too
      alert(`Quiz "${quizId}" launched!`);
      setQuizId('');
    } catch (error) {
      console.error('Error launching quiz:', error);
      alert('Failed to launch quiz');
    }
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
    if (!isTeacher) {
      navigate('/feedback'); 
    } else {
      navigate(-1);
    }
  };


  
  // Close popup
  const startQuiz = () => {
    setShowQuizPopup(false);
    setShowQuiz(true);
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

      <button
      onClick={() => navigate(`/whiteboard/${classId}`)}
      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded"
    >
      Open Whiteboard
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
            className="w-full p-2 border border-gray-300 rounded text-sm"
            placeholder="Quiz id (e.g. q1)"
            value={quizId}
            onChange={e => setQuizId(e.target.value)}
          />
          <button
            onClick={launchQuiz}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
          >
            Start Quiz
          </button>
        </div>
      )}

      {/* Quiz Notification Popup */}
      {showQuizPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {isTeacher ? 'Quiz Launched!' : 'New Quiz Available!'}
            </h2>
            <p className="mb-4">
              {isTeacher
                ? `You've launched quiz: ${quizId}`
                : 'The teacher has started a new quiz. Get ready!'}
            </p>
            <div className="flex justify-end">
              <button
                onClick={startQuiz}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {isTeacher ? 'Close' : 'Start Quiz'}
              </button>
            </div>
          </div>
        </div>
      )}
      {
        showQuiz && (<QuizPopup questions={quizQuestions} onClose={() => {}}></QuizPopup>)
      }
    </div>
  );
};

export default VideoCall;