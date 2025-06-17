import React, { useEffect, useState } from 'react';
import { ref, get, set } from 'firebase/database';
import { database } from '../firebase';
import { useAuth } from '../AuthContext';

interface TeacherClass { id: string; name: string; }

const AddStudentToClass: React.FC = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  /* load teacher’s classes */
  useEffect(() => {
    if (!user) return;
    (async () => {
      const snap = await get(ref(database, 'classes'));
      const list: TeacherClass[] = [];
      snap.forEach((c) => {
        const v = c.val();
        if (v.teacherId === user.uid) list.push({ id: c.key!, name: v.name });
      });
      setClasses(list);
      if (list[0]) setSelectedId(list[0].id);
    })();
  }, [user]);

  const handleAdd = async () => {
    setMsg('');

    /* ── guards ─────────── */
    if (!user)            return setMsg('⚠️  Please log in.');
    if (user.role !== 'teacher')
      return setMsg('❌ Only teachers can add students.');
    if (!selectedId)      return setMsg('Pick a class');

    /* find student uid by email */
    const allStud = await get(ref(database, 'students'));
    let stuUid: string | null = null;
    allStud.forEach((c) => {
      if (c.val().email === email) stuUid = c.key;
    });
    if (!stuUid) return setMsg('Student not found');

    await set(ref(database, `classes/${selectedId}/students/${stuUid}`), true);
    setMsg('✅ Student added');
  };

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add Student to Class</h1>

      <label className="block mb-2 font-semibold">Class</label>
      <select
        className="border px-3 py-2 w-full mb-4"
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
      >
        {classes.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <label className="block mb-2 font-semibold">Student e-mail</label>
      <input
        className="border px-3 py-2 w-full mb-4"
        placeholder="student@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleAdd}>
        Add Student
      </button>

      {msg && <p className="mt-3 text-sm">{msg}</p>}
    </div>
  );
};

export default AddStudentToClass;
