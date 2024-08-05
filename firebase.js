// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const firestore = getFirestore(app);
export {firestore}