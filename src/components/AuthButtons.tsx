import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const AuthButtons: React.FC = () => {
  const { user, logout } = useAuth();

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem', // roughly equivalent to Tailwind's gap-4
  };

  const buttonStyle: React.CSSProperties = {
    padding: '0.25rem 0.75rem',
    fontSize: '0.75rem',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    border: 'none',
  };

  if (user) {
    return (
      <div style={containerStyle}>
        <span style={{ fontSize: '0.875rem', fontStyle: 'italic', whiteSpace: 'nowrap' }}>
          {user.email} ({user.role})
        </span>
        <button
          onClick={logout}
          style={{
            ...buttonStyle,
            backgroundColor: '#ef4444', // Tailwind's red-500
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
          border: '1px solid #ccc',
          textDecoration: 'none',
          color: 'black',
        }}
      >
        Login
      </Link>
      <Link
        to="/register"
        style={{
          ...buttonStyle,
          backgroundColor: '#2563eb', // Tailwind's blue-600
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
