import { auth, db } from '../services/firebaseConfig';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  addDoc, 
  collection, 
  serverTimestamp, 
  GeoPoint 
} from 'firebase/firestore';

export type EmergencyLocation = {
  latitude: number;
  longitude: number;
};

export type RescueContact = {
  id: string;
  name: string;
  phone: string;
  note?: string;
};

export type UserProfile = {
  uid: string;
  email: string;
  fullName?: string | null;
  phone?: string | null;
  contacts: RescueContact[];
  fcmTokens?: string[];
  updatedAt?: any;
};

const authErrorMap: Record<string, string> = {
  'auth/weak-password': 'Mật khẩu quá yếu. Vui lòng dùng ít nhất 6 ký tự.',
  'auth/email-already-in-use': 'Email đã được sử dụng.',
  'auth/invalid-email': 'Email không hợp lệ.',
  'auth/user-not-found': 'Không tìm thấy tài khoản.',
  'auth/wrong-password': 'Mật khẩu không đúng.',
  'auth/invalid-credential': 'Email hoặc mật khẩu không chính xác.',
  'auth/network-request-failed': 'Lỗi mạng, kiểm tra kết nối Internet.',
};

function formatError(error: any): Error {
  const message = authErrorMap[error.code] || error.message || 'Có lỗi xảy ra. Vui lòng thử lại.';
  return new Error(message);
}

export async function signUpWithEmail(
  email: string,
  password: string,
  fullName?: string,
  phone?: string,
) {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const { uid } = credential.user;
    await saveUserProfile(uid, email.trim(), fullName, phone);
    return credential.user;
  } catch (error: any) {
    throw formatError(error);
  }
}

export async function signInWithEmail(email: string, password: string) {
  try {
    return await signInWithEmailAndPassword(auth, email.trim(), password);
  } catch (error: any) {
    throw formatError(error);
  }
}

export async function signOutCurrentUser() {
  return signOut(auth);
}

export async function saveUserProfile(
  uid: string,
  email: string,
  fullName?: string,
  phone?: string,
  contacts: RescueContact[] = [],
  fcmTokens: string[] = [],
) {
  const userDoc = doc(db, 'users', uid);
  return setDoc(
    userDoc,
    {
      uid,
      email,
      fullName: fullName || null,
      phone: phone || null,
      contacts,
      fcmTokens,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

// Hàm lấy dữ liệu đã được cập nhật bọc bộ lọc tránh crash undefined
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userDoc = doc(db, 'users', uid);
    const docSnap = await getDoc(userDoc);
    
    // Nếu tài khoản tồn tại bên Auth nhưng chưa có dữ liệu bên Firestore Database
    if (!docSnap.exists()) {
      return {
        uid: uid,
        email: auth.currentUser?.email || 'unknown@example.com',
        fullName: 'Người dùng mới', // Giá trị an toàn tránh lỗi đọc 'fullName'
        phone: '',
        contacts: [],
        fcmTokens: [],
        updatedAt: null
      };
    }

    const data = docSnap.data();
    return {
      uid: uid,
      email: data?.email || '',
      fullName: data?.fullName || 'Người dùng mới',
      phone: data?.phone || '',
      contacts: Array.isArray(data?.contacts) ? data.contacts : [],
      fcmTokens: Array.isArray(data?.fcmTokens) ? data.fcmTokens : [],
      updatedAt: data?.updatedAt ?? null,
    };
  } catch (error) {
    console.error("Lỗi đọc thông tin cấu hình User:", error);
    return null;
  }
}

export async function updateRescueContacts(uid: string, contacts: RescueContact[]) {
  const userDoc = doc(db, 'users', uid);
  return setDoc(
    userDoc,
    {
      contacts,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function sendEmergencyAlert(
  uid: string,
  email: string,
  location: EmergencyLocation,
) {
  if (!uid) {
    throw new Error('Người dùng chưa đăng nhập.');
  }
  if (
    location.latitude === undefined ||
    location.longitude === undefined ||
    Number.isNaN(location.latitude) ||
    Number.isNaN(location.longitude)
  ) {
    throw new Error('Vị trí SOS không hợp lệ.');
  }

  return addDoc(collection(db, 'emergency_alerts'), {
    uid,
    email,
    location: new GeoPoint(location.latitude, location.longitude),
    status: 'sent',
    createdAt: serverTimestamp(),
  });
}