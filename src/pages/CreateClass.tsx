// CreateClass.tsx — creates a Daily room via REST and links it to the class
import React, { useState } from 'react';
import { ref, get, set } from 'firebase/database';
import { database } from '../firebase';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

/* ───────── CONFIG ─────────
 * ① DAILY_SUBDOMAIN  e.g.  'your-team'
 * ② DAILY_API_KEY     found in https://dashboard.daily.co/developers
 *    (add these two to your Vite env:  VITE_DAILY_SUBDOMAIN / VITE_DAILY_API_KEY)
 */
const SUB = 'greenlight.daily.co';
const API_KEY = 'a6996420daac41a5ce1562edb41ec8b6b982ddceaad91fe32dc43ecd44a207b3';
const DAILY_API = 'https://api.daily.co/v1';

const cleanKey = (s: string) =>
  s.trim().replace(/[.$#[\]/]/g, '_').replace(/\s+/g, '_'); // safe for RTDB

const CreateClass: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  /* ───────── util: create a Daily room ───────── */
  const createDailyRoom = async () => {
    if (!API_KEY) return null; // no key configured
    const resp = await fetch(`${DAILY_API}/rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        name: `class_${uuid().slice(0, 8)}`,
        privacy: 'public',
      }),
    });

    if (!resp.ok) {
      console.warn('Daily API error', await resp.text());
      return null;
    }
    const data = await resp.json();
    return data.url as string;
  };

  /* ───────── submit ───────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return setMsg('⚠️  Please log in first.');
    if (user.role !== 'teacher') return setMsg('❌ Only teachers can create classes.');

    const key = cleanKey(name);
    if (!key) return setMsg('Enter a valid class name');

    const exists = await get(ref(database, `classes/${key}`));
    if (exists.exists()) {
      setMsg('❌ A class with that name already exists');
      return;
    }

    setBusy(true);
    let roomUrl = await createDailyRoom();

    // fallback: ad-hoc URL (works if sub-domain allows)
    if (!roomUrl && SUB) roomUrl = `https://${SUB}.daily.co/${uuid().slice(0, 8)}`;

    await set(ref(database, `classes/${key}`), {
      name,
      teacherId: user.uid,
      students: {},
      roomUrl,
    });

    setMsg('✅ Class + room created!');
    setTimeout(() => navigate(`/class/${key}`), 1000);
  };

  /* ───────── UI ───────── */
  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create New Class</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="border px-4 py-2 w-full"
          placeholder="e.g. Math Class"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button
          type="submit"
          disabled={busy}
          className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {busy ? 'Creating…' : 'Create Class'}
        </button>
      </form>

      {msg && <p className="mt-3 text-sm">{msg}</p>}
    </div>
  );
};

export default CreateClass;
