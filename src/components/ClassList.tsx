import React, { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../firebase';
import { useAuth } from '../AuthContext';

interface ClassItem { 
  id: string; 
  name: string; 
}

interface ClassListProps {
  darkMode: boolean;
}

const ClassList: React.FC<ClassListProps> = ({ darkMode }) => {
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
  if (!list.length) return (
    <p 
      className="mb-4 italic" 
      style={{ color: darkMode ? '#9ca3af' : '#6b7280' }} // gray-400 : gray-500
    >
      No classes assigned.
    </p>
  );

  return (
    <div className="mb-6">
      <h2 
        className="font-semibold mb-2"
        style={{ color: darkMode ? '#f9fafb' : '#111827' }} // gray-50 : gray-900
      >
        Your classes
      </h2>
      <ul className="list-disc list-inside">
        {list.map((c) => (
          <li 
            key={c.id}
            style={{ color: darkMode ? '#d1d5db' : '#374151' }} // gray-300 : gray-700
          >
            {c.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClassList;