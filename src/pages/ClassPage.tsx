// ClassPage.tsx  — shows the single room for this class
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDatabase, ref, get, set } from 'firebase/database';
import RoomList from '../RoomList';
import { useAuth } from '../AuthContext';

const ClassPage: React.FC = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [className, setClassName] = useState('Loading…');
  const [error, setError] = useState<string | null>(null);
  const [newStudentId, setNewStudentId] = useState('');
  const [addStatus, setAddStatus] = useState('');
  const [studentList, setStudentList] = useState<string[]>([]);

  /* fetch class meta (name, etc.) */
  useEffect(() => {
    if (!classId) return;
    const fetch = async () => {
      try {
        const db = getDatabase();
        const snap = await get(ref(db, `classes/${classId}`));
        if (!snap.exists()) {
          setError('Class not found');
          return;
        }
        const data = snap.val();
        setClassName(data.name ?? `Class ${classId}`);
      } catch (e: any) {
        setError(e.message ?? 'Unknown error');
      }
    };
    fetch();
  }, [classId]);

  /* load student list */
  useEffect(() => {
    if (!classId) return;

    const db = getDatabase();
    const studentRef = ref(db, `classes/${classId}/students`);

    const fetchStudents = async () => {
      try {
        const snap = await get(studentRef);
        if (snap.exists()) {
          setStudentList(Object.keys(snap.val()));
        } else {
          setStudentList([]);
        }
      } catch (e) {
        console.error('Error fetching students:', e);
      }
    };

    fetchStudents();
  }, [classId, addStatus]);

  /* join handler reused by RoomList */
  const handleJoin = (url: string) => {
    navigate(`/video-call/${encodeURIComponent(url)}/${classId}`);
  };

  const handleAddStudent = async () => {
    if (!classId || !newStudentId.trim()) return;

    try {
      const db = getDatabase();
      const studentRef = ref(db, `classes/${classId}/students/${newStudentId.trim()}`);
      await set(studentRef, true);
      setAddStatus(`Added student: ${newStudentId.trim()}`);
      setNewStudentId('');
    } catch (error) {
      console.error('Error adding student:', error);
      setAddStatus('Failed to add student');
    }

    setTimeout(() => setAddStatus(''), 3000);
  };

  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{className}</h1>

      {/* one-room list scoped to this class */}
      <RoomList
        onSelectRoom={handleJoin}
        darkMode={false}
        classId={classId}
      />

      {/* optional teacher-only extras could go here */}
      {user?.role === 'teacher' && (
        <div className="space-y-6">
          <p className="text-sm text-gray-500">
            (Teacher view — you could add room-management here)
          </p>

          {/* Add student UI */}
          <div>
            <h2 className="text-lg font-semibold">Add Student by UUID</h2>
            <div className="flex items-center space-x-2 mt-2">
              <input
                className="border p-2 rounded w-64"
                placeholder="Enter UUID"
                value={newStudentId}
                onChange={(e) => setNewStudentId(e.target.value)}
              />
              <button
                onClick={handleAddStudent}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            </div>
            {addStatus && <p className="text-sm text-green-600 mt-1">{addStatus}</p>}
          </div>

          {/* Show student list */}
          <div>
            <h3 className="text-md font-semibold">Current Students</h3>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              {studentList.length === 0 ? (
                <li className="text-gray-400">No students added</li>
              ) : (
                studentList.map((id) => <li key={id}>{id}</li>)
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassPage;
