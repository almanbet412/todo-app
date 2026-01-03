import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAmQ5XigCKt-G4CGLAOO3htKsnbpN40qKM",
  authDomain: "todo-app-bbae9.firebaseapp.com",
  projectId: "todo-app-bbae9",
  storageBucket: "todo-app-bbae9.firebasestorage.app",
  messagingSenderId: "371553244950",
  appId: "1:371553244950:web:2baa7de42ea362332ea237",
  measurementId: "G-XMK7LYK3EV",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
