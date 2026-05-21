import auth from '@react-native-firebase/auth';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

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
  updatedAt?: FirebaseFirestoreTypes.Timestamp | null;
};

const authErrorMap: Record<string, string> = {
  'auth/weak-password': 'Mật khẩu quá yếu. Vui lòng dùng ít nhất 6 ký tự.',
  'auth/email-already-in-use': 'Email đã được sử dụng.',
  'auth/invalid-email': 'Email không hợp lệ.',
  'auth/user-not-found': 'Không tìm thấy tài khoản.',
  'auth/wrong-password': 'Mật khẩu không đúng.',
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
    const credential = await auth().createUserWithEmailAndPassword(email.trim(), password);
    const { uid } = credential.user;
    await saveUserProfile(uid, email.trim(), fullName, phone);
    return credential.user;
  } catch (error: any) {
    throw formatError(error);
  }
}

export async function signInWithEmail(email: string, password: string) {
  try {
    return await auth().signInWithEmailAndPassword(email.trim(), password);
  } catch (error: any) {
    throw formatError(error);
  }
}

export async function signOutCurrentUser() {
  return auth().signOut();
}

export async function saveUserProfile(
  uid: string,
  email: string,
  fullName?: string,
  phone?: string,
  contacts: RescueContact[] = [],
  fcmTokens: string[] = [],
) {
  const userDoc = firestore().collection('users').doc(uid);
  return userDoc.set(
    {
      uid,
      email,
      fullName: fullName || null,
      phone: phone || null,
      contacts,
      fcmTokens,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const doc = await firestore().collection('users').doc(uid).get();
  if (!doc.exists) {
    return null;
  }

  const data = doc.data() as UserProfile;
  return {
    uid: data.uid,
    email: data.email,
    fullName: data.fullName ?? null,
    phone: data.phone ?? null,
    contacts: Array.isArray(data.contacts) ? data.contacts : [],
    fcmTokens: Array.isArray(data.fcmTokens) ? data.fcmTokens : [],
    updatedAt: data.updatedAt ?? null,
  };
}

export async function updateRescueContacts(uid: string, contacts: RescueContact[]) {
  const userDoc = firestore().collection('users').doc(uid);
  return userDoc.set(
    {
      contacts,
      updatedAt: firestore.FieldValue.serverTimestamp(),
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

  return firestore().collection('emergency_alerts').add({
    uid,
    email,
    location: new firestore.GeoPoint(location.latitude, location.longitude),
    status: 'sent',
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
}
