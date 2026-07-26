import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "untoque-app",
  appId: "1:26612172397:web:33c9a2a88e8ef49825a164",
  storageBucket: "untoque-app.firebasestorage.app",
  apiKey: "AIzaSyCQOM6KAJLbinHBwcAJXOESNnXhUur6PjM",
  authDomain: "untoque-app.firebaseapp.com",
  messagingSenderId: "26612172397"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
