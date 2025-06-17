import React, { createContext, useContext, useEffect, useState } from 'react';
import { database } from './firebase';
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { ref, get, set } from 'firebase/database';

interface AuthCtx {
  user: { uid: string; email: string | null; role: 'student' | 'teacher' } | null;
  login: (email: string, pw: string) => Promise<void>;
  register: (email: string, pw: string, role: 'student' | 'teacher') => Promise<void>;
  logout: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | undefined>(undefined);
export const useAuth = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth outside provider');
  return v;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = getAuth();
  const [user, setUser] = useState<AuthCtx['user']>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) return setUser(null);
      const roleSnap = await get(ref(database, `users/${fbUser.uid}/role`));
      setUser({ uid: fbUser.uid, email: fbUser.email, role: roleSnap.val() });
    });
    return unsub;
  }, []);

  const login = async (email: string, pw: string) => {
    await signInWithEmailAndPassword(auth, email, pw);
  };

  const register = async (email: string, pw: string, role: 'student' | 'teacher') => {
    const cred = await createUserWithEmailAndPassword(auth, email, pw);
    await set(ref(database, `users/${cred.user.uid}/role`), role);
  };

  const logout = async () => signOut(auth);

  return <Ctx.Provider value={{ user, login, register, logout }}>{children}</Ctx.Provider>;
};