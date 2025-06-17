import React, { useState } from 'react';
import PostItNote from '../components/PostItNote';
import WhiteboardCanvas from '../components/WhiteboardCanvas';

type Note = {
  id: number;
  content: string;
};

const Whiteboard: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteContent, setNewNoteContent] = useState('');

  const handleAddNote = () => {
    if (newNoteContent.trim() !== '') {
      const newNote: Note = {
        id: notes.length + 1,
        content: newNoteContent.trim(),
      };
      setNotes([...notes, newNote]);
      setNewNoteContent('');
    }
  };

  return (
    <div className="whiteboard">
      <h1>Whiteboard</h1>

      <WhiteboardCanvas />

      <div className="new-note-input">
        <input
          type="text"
          placeholder="Write a new comment..."
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
        />
        <button onClick={handleAddNote}>Add Note</button>
      </div>

      <div className="notes-grid">
        {notes.map((note) => (
          <PostItNote key={note.id} id={note.id} content={note.content} />
        ))}
      </div>
    </div>
  );
};

export default Whiteboard;
