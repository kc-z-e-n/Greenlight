import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const AuthButtons: React.FC = () => {
  const { user, logout } = useAuth();
  if (user)
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm italic">{user.email} ({user.role})</span>
        <button onClick={logout} className="px-3 py-1 bg-red-500 text-white rounded text-xs">
          Logout
        </button>
      </div>
    );
  return (
    <div className="space-x-2">
      <Link to="/login" className="px-3 py-1 border rounded text-xs">Login</Link>
      <Link to="/register" className="px-3 py-1 bg-blue-600 text-white rounded text-xs">Register</Link>
    </div>
  );
};
export default AuthButtons;
