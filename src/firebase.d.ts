// src/firebase.d.ts
import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Database } from "firebase/database";

declare const app: FirebaseApp;
declare const auth: Auth;
declare const database: Database;

export { auth, database };
export default app;
