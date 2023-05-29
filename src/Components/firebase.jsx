import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

// web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBFSOT4PADOEpqLwOTQZZgZHSwMeAQmrrg",
  authDomain: "sbtesting-7663e.firebaseapp.com",
  databaseURL: "https://sbtesting-7663e-default-rtdb.firebaseio.com",
  projectId: "sbtesting-7663e",
  storageBucket: "sbtesting-7663e.appspot.com",
  messagingSenderId: "585695351435",
  appId: "1:585695351435:web:6e41f477c876cff9593a8e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app)
export const database = getDatabase(app);