// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRlPTOcK6ECFQVAJKqAufKQO9CQAsFeEM",
  authDomain: "coolant-dashboard.firebaseapp.com",
  projectId: "coolant-dashboard",
  storageBucket: "coolant-dashboard.appspot.com",
  messagingSenderId: "711229515615",
  appId: "1:711229515615:web:b3083a77bc42d1a2b178ea",
  measurementId: "G-JG9H6DDHDV"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = firebase.auth();
const db = getFirestore(app);

export { app, auth, db }