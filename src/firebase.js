import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDR57tTe4VBLBT8lnIaP4sz2aHHxS96850",
  authDomain: "fmp-production.firebaseapp.com",
  projectId: "fmp-production",
  storageBucket: "fmp-production.appspot.com",
  messagingSenderId: "242440917417",
  appId: "1:242440917417:web:15203daf6517d754f8b4b8",
  measurementId: "G-35FR09Q0NV"
 };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
const logInWithEmailAndPassword = async (email, password) => {
  try {
   const res = await signInWithEmailAndPassword(auth, email, password);
   console.log(res.user.accessToken);
   localStorage.setItem('Token', "uid "+ res.user.accessToken);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

export {
  auth,
  db,
  // signInWithGoogle,
  logInWithEmailAndPassword,

};
