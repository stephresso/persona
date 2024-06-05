// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA0VA--ntu5ddl49tHUx8Wt8g--ekeoeO0",
  authDomain: "persona-e0490.firebaseapp.com",
  projectId: "persona-e0490",
  storageBucket: "persona-e0490.appspot.com",
  messagingSenderId: "268983029633",
  appId: "1:268983029633:web:1a18806f1b975e0395e280",
  measurementId: "G-2KR1HEY902"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth }
