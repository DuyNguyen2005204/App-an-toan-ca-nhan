import firestore from '@react-native-firebase/firestore';
import messaging, { AuthorizationStatus, FirebaseMessagingTypes } from '@react-native-firebase/messaging';

export async function requestUserPermission(): Promise<boolean> {
  await messaging().registerDeviceForRemoteMessages();
  const authStatus = await messaging().requestPermission({
    alert: true,
    badge: true,
    sound: true,
  });
  const enabled =
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL;

  return enabled;
}

export async function registerFCMToken(uid: string): Promise<string | null> {
  const token = await messaging().getToken();
  if (!token) {
    return null;
  }

  await firestore().collection('users').doc(uid).set(
    {
      fcmTokens: firestore.FieldValue.arrayUnion(token),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  return token;
}

export function onMessageReceived(
  callback: (message: FirebaseMessagingTypes.RemoteMessage) => void,
) {
  return messaging().onMessage(async remoteMessage => {
    if (remoteMessage) {
      callback(remoteMessage);
    }
  });
}
