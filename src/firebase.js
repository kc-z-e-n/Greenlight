// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // if using auth
import { getDatabase, ref, get } from "firebase/database";
import { useEffect } from "react";


const firebaseConfig = {
  apiKey: "AIzaSyBudntLto0z_wWhVwNJlzCVeK7BN1bZGjU",
  authDomain: "greenlight-c9b3e.firebaseapp.com",
  projectId: "greenlight-c9b3e",
  storageBucket: "greenlight-c9b3e.firebasestorage.app",
  messagingSenderId: "814210917189",
  appId: "1:814210917189:web:99d9bf6f06c1da64c2942c",
  databaseURL: "https://greenlight-c9b3e-default-rtdb.asia-southeast1.firebasedatabase.app/",
  measurementId: "G-HVEDZXEP1C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);           // optional
// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);



export default app;
