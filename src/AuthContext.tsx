// src/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { database } from './firebase';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { ref, get, set } from 'firebase/database';

/* ── Types ────────────────────────────────────────── */
type Role = 'student' | 'teacher';

interface BaseProfile {
  email: string;
  name: string;
}
interface StudentProfile extends BaseProfile {
  grade?: string;
  age?: number | null;
}
interface TeacherProfile extends BaseProfile {
  subject?: string;
  phone?: string;
}
type AnyProfile = StudentProfile | TeacherProfile;

interface AuthCtx {
  user:
    | {
        uid: string;
        email: string | null;
        role: Role;
        profile: AnyProfile | null;
      }
    | null;
  login: (email: string, pw: string) => Promise<void>;
  register: (email: string, pw: string, role: Role) => Promise<void>;
  logout: () => Promise<void>;
}

/* ── Context helpers ──────────────────────────────── */
const Ctx = createContext<AuthCtx | undefined>(undefined);
export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAuth outside provider');
  return c;
};

/* ── Provider ─────────────────────────────────────── */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = getAuth();
  const [user, setUser] = useState<AuthCtx['user']>(null);

  /* Listen for login / logout */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) return setUser(null);

      /* 1️⃣  role */
      const roleSnap = await get(ref(database, `users/${fbUser.uid}/role`));
      const role = roleSnap.val() as Role;

      /* 2️⃣  profile */
      const profSnap = await get(
        ref(database, `${role === 'teacher' ? 'teachers' : 'students'}/${fbUser.uid}`)
      );
      const profile = (profSnap.val() || null) as AnyProfile | null;

      setUser({ uid: fbUser.uid, email: fbUser.email, role, profile });
    });
    return unsub;
  }, []);

  /* Login */
  const login = async (email: string, pw: string) => {
    await signInWithEmailAndPassword(auth, email, pw);
  };

  /* Register & write profile */
  const register = async (email: string, pw: string, role: Role) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pw);
    const uid = cred.user.uid;

    /* minimal profile */
    const profile: AnyProfile =
      role === 'teacher'
        ? { email, name: '', subject: '', phone: '' }
        : { email, name: '', grade: '', age: null };

    await set(ref(database, `${role === 'teacher' ? 'teachers' : 'students'}/${uid}`), profile);
    await set(ref(database, `users/${uid}`), { role });
  };

  const logout = () => signOut(auth);

  return <Ctx.Provider value={{ user, login, register, logout }}>{children}</Ctx.Provider>;
};
