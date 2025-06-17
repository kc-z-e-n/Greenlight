import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
//@ts-ignore
import { database } from '../firebase.js';
import { ref, onValue, set } from 'firebase/database';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const SessionRoom: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [quiz, setQuiz] = useState<{ question: string; options: string[] } | null>(null);
  const [selected, setSelected] = useState('');
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const userId = `user_${Math.floor(Math.random() * 10000)}`;

  // Listen for quiz
  useEffect(() => {
    const quizRef = ref(database, `quizzes/${sessionId}`);
    onValue(quizRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setQuiz(data);
    });

    const responseRef = ref(database, `quizzes/${sessionId}/responses`);
    onValue(responseRef, (snapshot) => {
      const all = snapshot.val() || {};
      const counts: Record<string, number> = {};
      Object.values(all).forEach((ans) => {
        counts[ans as string] = (counts[ans as string] || 0) + 1;
      });
      setResponses(counts);
    });
  }, [sessionId]);

  const handleSubmit = () => {
    if (!selected) return;
    set(ref(database, `quizzes/${sessionId}/responses/${userId}`), selected);
    setSubmitted(true);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Session ID: {sessionId}</h1>

      {quiz ? (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{quiz.question}</h2>
          {quiz.options.map((opt) => (
            <label key={opt} className="block mb-2">
              <input
                type="radio"
                value={opt}
                checked={selected === opt}
                onChange={(e) => setSelected(e.target.value)}
                disabled={submitted}
              />{' '}
              {opt}
            </label>
          ))}
          <button
            onClick={handleSubmit}
            className="mt-3 px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
            disabled={submitted}
          >
            Submit Answer
          </button>
        </div>
      ) : (
        <p>Waiting for quiz question...</p>
      )}

      {Object.keys(responses).length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Live Results:</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={Object.entries(responses).map(([name, count]) => ({ name, count }))}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#4ade80" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default SessionRoom;
