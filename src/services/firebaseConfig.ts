import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Lấy thông tin này từ mục "Project Settings" -> "Web App" trên Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDXfGSll1Ua689sxJg8gWjHAcUyhhFwyIg",
  authDomain: "emergsos-46840.firebaseapp.com",
  projectId: "emergsos-46840",
  storageBucket: "emergsos-46840.firebasestorage.app",
  messagingSenderId: "322552753854",
  appId: "1:322552753854:web:b38087073b9aa64400f8ef",
  measurementId: "G-KQS9ZCMGVM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);