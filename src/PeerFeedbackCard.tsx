import React, { useState } from 'react';
import './PeerFeedbackCard.css';

const options = [100, 75, 50, 25];

const PeerFeedbackCard: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="card">
      <button className="back-btn">← Peer Feedback</button>
      <h2 className="title">How satisfied are you with the previous assignment?</h2>

      <div className="options-grid">
        {options.map((value) => (
          <button
            key={value}
            className={`choice-btn ${selected === value ? 'active' : ''}`}
            onClick={() => setSelected(value)}
          >
            <span>{value}%</span>
            <div className="bar-container">
              <div className="bar fill" style={{ width: `${selected === value ? value : 0}%` }} />
            </div>
          </button>
        ))}
      </div>

      <button className="next-btn" disabled={selected === null}>
        Next Question
      </button>
    </div>
  );
};

export default PeerFeedbackCard;
