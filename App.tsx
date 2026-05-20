import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import { onMessageReceived, registerFCMToken, requestUserPermission } from './src/firebase/messaging';

function App() {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(currentUser => {
      setUser(currentUser);
      if (initializing) {
        setInitializing(false);
      }
    });
    return subscriber;
  }, [initializing]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function setupMessaging() {
      if (!user) {
        return;
      }

      const permissionGranted = await requestUserPermission();
      if (!permissionGranted) {
        console.warn('FCM permission not granted');
        return;
      }

      await registerFCMToken(user.uid);
      unsubscribe = onMessageReceived(message => {
        console.log('FCM foreground message:', message);
      });
    }

    setupMessaging();

    return () => {
      unsubscribe?.();
    };
  }, [user]);

  if (initializing) {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Đang khởi tạo...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {user ? <HomeScreen user={user} /> : <AuthScreen />}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    fontSize: 18,
    color: '#334155',
  },
});

export default App;
