// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtncsormRD9JaNxZ_yhr8GBEcjLDpsbfg",
  authDomain: "inventory-management-8153e.firebaseapp.com",
  projectId: "inventory-management-8153e",
  storageBucket: "inventory-management-8153e.appspot.com",
  messagingSenderId: "136338398833",
  appId: "1:136338398833:web:271f87a8521169cd3485d0",
  measurementId: "G-1W2L125WP5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };
