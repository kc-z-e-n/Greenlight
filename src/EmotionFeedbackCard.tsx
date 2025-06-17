import React, { useState } from 'react';
import './PeerFeedbackCard.css';

const emojis = [
  { symbol: '😄', label: 'Happy' },
  { symbol: '🤩', label: 'Excited' },
  { symbol: '😐', label: 'Neutral' },
  { symbol: '😞', label: 'Sad' },
  { symbol: '😤', label: 'Frustrated' }
];

const EmotionFeedbackCard: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="card">
      <button className="back-btn">← Peer Feedback</button>
      <h2 className="title">How did you feel about the lesson content?</h2>

      <div className="options-grid">
        {emojis.map(({ symbol, label }) => (
          <button
            key={label}
            className={`choice-btn ${selected === label ? 'active' : ''}`}
            onClick={() => setSelected(label)}
          >
            <span style={{ fontSize: '1.8rem' }}>{symbol}</span>
            <div style={{ marginTop: '4px', fontWeight: 500 }}>{label}</div>
          </button>
        ))}
      </div>

      <button className="next-btn" disabled={selected === null}>
        Submit Feedback
      </button>
    </div>
  );
};

export default EmotionFeedbackCard;
