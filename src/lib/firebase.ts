import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBcS6S6rd4cxOP5U16bDx-ZqHy_D1xkWPc",
  authDomain: "desi-pixelio.firebaseapp.com",
  projectId: "desi-pixelio",
  storageBucket: "desi-pixelio.firebasestorage.app",
  messagingSenderId: "382248611699",
  appId: "1:382248611699:web:e1f7deb6ff8cac23129f06",
  
};


  

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { db, auth };
