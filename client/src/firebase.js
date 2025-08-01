// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "campusnotes-f6c10.firebaseapp.com",
  projectId: "campusnotes-f6c10",
  storageBucket: "campusnotes-f6c10.firebasestorage.app",
  messagingSenderId: "180474257890",
  appId: "1:180474257890:web:1b8d206284e26b0944d9bb",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
