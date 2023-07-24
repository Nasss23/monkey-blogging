import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyAWotAhBf6GxhS2sXvIChVEqZQbfLAfafE",
  authDomain: "monkey-blogging-eabe0.firebaseapp.com",
  projectId: "monkey-blogging-eabe0",
  storageBucket: "monkey-blogging-eabe0.appspot.com",
  messagingSenderId: "532389126285",
  appId: "1:532389126285:web:2cb7fa1742fcc2d62482c4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);