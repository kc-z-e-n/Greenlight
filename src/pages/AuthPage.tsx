import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function AuthPage() {
  const { pathname } = useLocation();
  const isRegister = pathname === '/register';
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const handle = async () => {
    if (isRegister) {
      await register(email, pw, role);
    } else {
      await login(email, pw);
    }
    navigate('/');
  };
  return (
    <div className="p-8 max-w-xs mx-auto space-y-4">
      <h1 className="text-2xl font-bold">{isRegister ? 'Register' : 'Login'}</h1>
      <input className="border p-2 w-full" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="border p-2 w-full" placeholder="password" type="password" value={pw} onChange={e=>setPw(e.target.value)} />
      {isRegister && (
        <select className="border p-2 w-full" value={role} onChange={e=>setRole(e.target.value as any)}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
      )}
      <button onClick={handle} className="w-full bg-green-600 text-white py-2 rounded">
        {isRegister ? 'Create account' : 'Sign in'}
      </button>
    </div>
  );
}