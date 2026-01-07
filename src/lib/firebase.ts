import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAMocms2Zp1CdMBgW4XhvcHzaLwI_hSWQg",
  authDomain: "purpose-aec15.firebaseapp.com",
  projectId: "purpose-aec15",
  storageBucket: "purpose-aec15.firebasestorage.app",
  messagingSenderId: "971703720450",
  appId: "1:971703720450:web:eaddf23a15d6bbf4cf651b",
  measurementId: "G-P3CTJ8J5RF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export default app;