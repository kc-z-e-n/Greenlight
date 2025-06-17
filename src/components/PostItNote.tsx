import React, { useState } from 'react';
import './PostItNote.css';

type PostItNoteProps = {
  id: number;
  content: string;
};

const PostItNote: React.FC<PostItNoteProps> = ({ id, content }) => {
  const [replies, setReplies] = useState<string[]>([]);
  const [newReply, setNewReply] = useState('');

  const handleAddReply = () => {
    if (newReply.trim() !== '') {
      setReplies([...replies, newReply]);
      setNewReply('');
    }
  };

  return (
    <div className="post-it-note">
      <div className="note-content">
        <strong>Post #{id}</strong>
        <p>{content}</p>
      </div>

      <div className="replies">
        {replies.map((reply, index) => (
          <div className="reply" key={index}>
            ➤ {reply}
          </div>
        ))}
      </div>

      <div className="reply-input">
        <input
          type="text"
          placeholder="Write a remark..."
          value={newReply}
          onChange={(e) => setNewReply(e.target.value)}
        />
        <button onClick={handleAddReply}>Reply</button>
      </div>
    </div>
  );
};

export default PostItNote;
