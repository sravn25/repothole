import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import dotenv from 'dotenv';

dotenv.config();

// web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "repothole-6308b.firebaseapp.com",
  databaseURL: "https://repothole-6308b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "repothole-6308b",
  storageBucket: "repothole-6308b.appspot.com",
  messagingSenderId: "9708429306",
  appId: "1:9708429306:web:43e406e46c8640881d0e43",
  measurementId: "G-J5QN1EXQLS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app)
export const database = getDatabase(app);