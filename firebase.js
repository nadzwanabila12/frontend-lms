import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD1KPyytSW9r6eEipBZu1DT11ULKvMhRLM",
  authDomain: "lms-matematika-pgl.firebaseapp.com",
  projectId: "lms-matematika-pgl",
  storageBucket: "lms-matematika-pgl.firebasestorage.app",
  messagingSenderId: "159438755610",
  appId: "1:159438755610:web:deaae641cdef3947a47ea3"
};

// Cek apakah Firebase sudah menyala sebelumnya agar tidak bertabrakan
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);