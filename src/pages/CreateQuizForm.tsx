import { useState } from 'react';
import { database } from '../firebase';
import { ref, set } from 'firebase/database';

/**
 * Teacher form to seed quizzes.
 * Writes to: /quizzes/{sessionId}/questionBank/{questionId}
 */
const CreateQuizForm: React.FC = () => {
  const [sessionId, setSessionId]   = useState('');
  const [questionId, setQuestionId] = useState('');
  const [prompt, setPrompt]         = useState('');
  const [options, setOptions]       = useState<string[]>(['', '', '', '']);

  const handleSave = async () => {
    if (!sessionId || !questionId || !prompt) {
      alert('Fill session, questionId, question');
      return;
    }
    const cleanOpts = options.filter(Boolean);
    if (cleanOpts.length < 2) {
      alert('Need at least two options');
      return;
    }
    await set(ref(database, `quizzes/${sessionId}/questionBank/${questionId}`), {
      question: prompt,
      options : cleanOpts,
    });
    alert(`Saved “${questionId}” under ${sessionId}`);
    setPrompt('');
    setOptions(['', '', '', '']);
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Create a Quiz</h1>

      <input
        className="border p-2 w-full"
        placeholder="Session ID (e.g. session_abc)"
        value={sessionId}
        onChange={e => setSessionId(e.target.value)}
      />

      <input
        className="border p-2 w-full"
        placeholder="Question ID (e.g. q1)"
        value={questionId}
        onChange={e => setQuestionId(e.target.value)}
      />

      <textarea
        className="border p-2 w-full h-24"
        placeholder="Question prompt"
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
      />

      {options.map((opt, i) => (
        <input
          key={i}
          className="border p-2 w-full"
          placeholder={`Option ${i + 1}`}
          value={opt}
          onChange={e => setOptions(prev => {
            const copy = [...prev];
            copy[i] = e.target.value;
            return copy;
          })}
        />
      ))}

      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Save Quiz
      </button>
    </div>
  );
};

export default CreateQuizForm;