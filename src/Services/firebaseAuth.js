// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import {initializeAuth} from 'firebase/auth'
// import { getAnalytics } from "firebase/analytics";
// import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCl3sMdhDrUnJY-HtOpNmCTqnTtU_tynIM",
  authDomain: "todo-mern-2cbb2.firebaseapp.com",
  projectId: "todo-mern-2cbb2",
  storageBucket: "todo-mern-2cbb2.appspot.com",
  messagingSenderId: "900278871187",
  appId: "1:900278871187:web:2058822c6d5f7c173cd966"
};

// let auth;
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// auth = initializeAuth(app)
// const analytics = getAnalytics(app);
// const database = getDatabase(app);

export const auth = getAuth()

export default  app ;

