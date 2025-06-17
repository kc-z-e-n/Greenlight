import { useState } from 'react';
import { database } from '../firebase';
import { ref, set } from 'firebase/database';

export default function CreateQuizForm() {
  const [sessionId, setSessionId] = useState('');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [questionId, setQuestionId] = useState('');

  const handleSubmit = async () => {
    if (!sessionId || !questionId || !question) return;
    await set(ref(database, `quizzes/${sessionId}/questionBank/${questionId}`), {
      question,
      options: options.filter(Boolean),
    });
    alert(`Saved as '${questionId}' under ${sessionId}`);
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <input className="border p-2 w-full" placeholder="Session ID" value={sessionId} onChange={e => setSessionId(e.target.value)} />
      <input className="border p-2 w-full" placeholder="Question ID (e.g., q1)" value={questionId} onChange={e => setQuestionId(e.target.value)} />
      <textarea className="border p-2 w-full" placeholder="Question" value={question} onChange={e => setQuestion(e.target.value)} />
      {options.map((opt, i) => (
        <input key={i} className="border p-2 w-full" placeholder={`Option ${i+1}`} value={opt} onChange={e => {
          const newOpts = [...options];
          newOpts[i] = e.target.value;
          setOptions(newOpts);
        }} />
      ))}
      <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">Save Quiz</button>
    </div>
  );
}
