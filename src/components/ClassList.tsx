import React, { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../firebase';
import { useAuth } from '../AuthContext';

interface ClassItem { id: string; name: string; }

const ClassList: React.FC = () => {
  const { user } = useAuth();
  const [list, setList] = useState<ClassItem[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const snap = await get(ref(database, 'classes'));
      const arr: ClassItem[] = [];
      snap.forEach((c) => {
        const v = c.val();
        if (
          (user.role === 'teacher' && v.teacherId === user.uid) ||
          (user.role === 'student' && v.students && v.students[user.uid])
        ) {
          arr.push({ id: c.key!, name: v.name });
        }
      });
      setList(arr);
    })();
  }, [user]);

  if (!user) return null;
  if (!list.length) return <p className="mb-4 italic">No classes assigned.</p>;

  return (
    <div className="mb-6">
      <h2 className="font-semibold mb-2">Your classes</h2>
      <ul className="list-disc list-inside">
        {list.map((c) => (
          <li key={c.id}>{c.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ClassList;
