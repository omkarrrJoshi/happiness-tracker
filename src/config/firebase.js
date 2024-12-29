// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_bHcfwszqzPcNa8zSWCKxfBSor25Rk-I",
  authDomain: "happinesstracker-dev.firebaseapp.com",
  projectId: "happinesstracker-dev",
  storageBucket: "happinesstracker-dev.firebasestorage.app",
  messagingSenderId: "68471822353",
  appId: "1:68471822353:web:76a41a84bebca3eae3f9b0",
  measurementId: "G-5NH6TJ7XEB"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);
// export const storage = getStorage(app);