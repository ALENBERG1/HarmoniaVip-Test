// src/lib/firebase.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC89deKsChwQxZAT0vNCyt25zWadDzs4NI",
  authDomain: "calendarapp-9aedb.firebaseapp.com",
  projectId: "calendarapp-9aedb",
  storageBucket: "calendarapp-9aedb.appspot.com",
  messagingSenderId: "990018260933",
  appId: "1:990018260933:web:1857d0911d093db103c5ac"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Firebase Storage
const storage = getStorage(app);

export { db, auth, storage };