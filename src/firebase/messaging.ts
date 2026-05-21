import { db } from '../services/firebaseConfig';
import { doc, setDoc, serverTimestamp, arrayUnion } from 'firebase/firestore';

// Giả lập cấp quyền trên môi trường Expo Go
export async function requestUserPermission(): Promise<boolean> {
  console.log("Expo Go Environment: Permission requested");
  return true;
}

// Giả lập lưu trữ thông báo token cục bộ
export async function registerFCMToken(uid: string): Promise<string | null> {
  const mockToken = "expo-mock-fcm-token-" + uid;

  const userDoc = doc(db, 'users', uid);
  await setDoc(
    userDoc,
    {
      fcmTokens: arrayUnion(mockToken),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  return mockToken;
}

export function onMessageReceived(callback: (message: any) => void) {
  console.log("Listening for global safety messages...");
  return () => {};
}