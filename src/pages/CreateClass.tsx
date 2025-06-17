import React, { useState } from 'react';
import { ref, get, set } from 'firebase/database';
import { database } from '../firebase';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const cleanKey = (s: string) =>
  s.trim().replace(/[.$#[\]/]/g, '_').replace(/\s+/g, '_'); // safe for RTDB

const CreateClass: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    /* ── guards ───────────────────── */
    if (!user)            return setMsg('⚠️  Please log in first.');
    if (user.role !== 'teacher')
      return setMsg('❌ Only teachers can create classes.');

    const key = cleanKey(name);
    if (!key) return setMsg('Enter a valid class name');

    /* duplicate check */
    const exists = await get(ref(database, `classes/${key}`));
    if (exists.exists()) {
      setMsg('❌ A class with that name already exists');
      return;
    }

    /* create */
    await set(ref(database, `classes/${key}`), {
      name,
      teacherId: user.uid,
      students: {},
    });

    setMsg('✅ Class created!');
    setTimeout(() => navigate('/'), 800);
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create New Class</h1>
      <form onSubmit={handleSubmit}>
        <input
          className="border px-4 py-2 w-full mb-4"
          placeholder="e.g. Math Class"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="bg-purple-600 text-white px-4 py-2 rounded" type="submit">
          Create Class
        </button>
      </form>
      {msg && <p className="mt-3 text-sm">{msg}</p>}
    </div>
  );
};

export default CreateClass;
