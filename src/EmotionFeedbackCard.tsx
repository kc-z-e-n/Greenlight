// EmotionFeedbackCard.tsx
import React, { useState } from 'react';

const emojis = [
  { symbol: '😄', label: 'Happy' },
  { symbol: '🤩', label: 'Excited' },
  { symbol: '😐', label: 'Neutral' },
  { symbol: '😞', label: 'Sad' },
  { symbol: '😤', label: 'Frustrated' }
];

interface EmotionFeedbackCardProps {
  darkMode: boolean;
}

const EmotionFeedbackCard: React.FC<EmotionFeedbackCardProps> = ({ darkMode }) => {
  const [selected, setSelected] = useState<string | null>(null);

  const cardStyle: React.CSSProperties = {
    padding: '1.5rem',
    borderRadius: '0.75rem',
    backgroundColor: darkMode ? '#1f2937' : '#ffffff',
    color: darkMode ? '#f9fafb' : '#111827',
    border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
    boxShadow: darkMode 
      ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' 
      : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  };

  const backBtnStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: darkMode ? '#9ca3af' : '#6b7280',
    cursor: 'pointer',
    fontSize: '0.875rem',
    marginBottom: '1rem',
    padding: '0.5rem 0',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '1.5rem',
    color: darkMode ? '#f9fafb' : '#111827',
  };

  const optionsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  };

  const getChoiceBtnStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1rem',
    borderRadius: '0.5rem',
    border: `2px solid ${
      isActive 
        ? '#3b82f6' 
        : darkMode ? '#4b5563' : '#d1d5db'
    }`,
    backgroundColor: isActive 
      ? (darkMode ? '#1e40af' : '#dbeafe')
      : (darkMode ? '#374151' : '#ffffff'),
    color: isActive 
      ? (darkMode ? '#ffffff' : '#1e40af')
      : (darkMode ? '#e5e7eb' : '#374151'),
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  });

  const nextBtnStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    border: 'none',
    backgroundColor: selected ? '#3b82f6' : (darkMode ? '#4b5563' : '#d1d5db'),
    color: selected ? '#ffffff' : (darkMode ? '#9ca3af' : '#6b7280'),
    fontSize: '1rem',
    fontWeight: '500',
    cursor: selected ? 'pointer' : 'not-allowed',
    transition: 'all 0.2s ease',
  };

  return (
    <div style={cardStyle}>
      <button style={backBtnStyle}>← Peer Feedback</button>
      <h2 style={titleStyle}>How did you feel about the lesson content?</h2>

      <div style={optionsGridStyle}>
        {emojis.map(({ symbol, label }) => (
          <button
            key={label}
            style={getChoiceBtnStyle(selected === label)}
            onClick={() => setSelected(label)}
            onMouseEnter={(e) => {
              if (selected !== label) {
                e.currentTarget.style.backgroundColor = darkMode ? '#4b5563' : '#f3f4f6';
              }
            }}
            onMouseLeave={(e) => {
              if (selected !== label) {
                e.currentTarget.style.backgroundColor = darkMode ? '#374151' : '#ffffff';
              }
            }}
          >
            <span style={{ fontSize: '1.8rem' }}>{symbol}</span>
            <div style={{ marginTop: '4px', fontWeight: '500' }}>{label}</div>
          </button>
        ))}
      </div>

      <button style={nextBtnStyle} disabled={selected === null}>
        Submit Feedback
      </button>
    </div>
  );
};

export default EmotionFeedbackCard;