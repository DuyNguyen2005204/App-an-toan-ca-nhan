import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

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

let auth: any;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
}

export { auth };
export const db = getFirestore(app);
export const storage = getStorage(app);