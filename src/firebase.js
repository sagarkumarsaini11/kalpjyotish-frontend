// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDVCA5pgPKpVIB5sbIyRnmWEZXxXFYe2tw",
  authDomain: "kalpjyotish-bd41d.firebaseapp.com",
  projectId: "kalpjyotish-bd41d",
  storageBucket: "kalpjyotish-bd41d.firebasestorage.app",
  messagingSenderId: "5986978124",
  appId: "1:5986978124:web:e35bc407a14d46c482e7e9",
  measurementId: "G-MSG83VMCVR",
};

const app = initializeApp(firebaseConfig);

// ✅ THIS WAS MISSING
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
