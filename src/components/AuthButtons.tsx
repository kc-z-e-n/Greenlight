// AuthButtons.tsx
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

interface AuthButtonsProps {
  darkMode: boolean;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ darkMode }) => {
  const { user, logout } = useAuth();

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '0.25rem 0.75rem',
    fontSize: '0.75rem',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    border: 'none',
  };

  const textStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    fontStyle: 'italic',
    whiteSpace: 'nowrap',
    color: darkMode ? '#e5e7eb' : '#374151', // gray-200 : gray-700
  };

  if (user) {
    return (
      <div style={containerStyle}>
        <span style={textStyle}>
          {user.email} ({user.role})
        </span>
        <button
          onClick={logout}
          style={{
            ...buttonStyle,
            backgroundColor: '#ef4444', // red-500
            color: 'white',
          }}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <Link
        to="/login"
        style={{
          ...buttonStyle,
          border: `1px solid ${darkMode ? '#4b5563' : '#ccc'}`, // gray-600 : #ccc
          textDecoration: 'none',
          color: darkMode ? '#f9fafb' : '#000000', // gray-50 : black
          backgroundColor: darkMode ? '#374151' : 'transparent', // gray-700 : transparent
        }}
      >
        Login
      </Link>
      <Link
        to="/register"
        style={{
          ...buttonStyle,
          backgroundColor: '#2563eb', // blue-600
          color: 'white',
          textDecoration: 'none',
        }}
      >
        Register
      </Link>
    </div>
  );
};

export default AuthButtons;