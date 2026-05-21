import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../src/services/firebaseConfig';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

export default function Page() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      if (user) {
        router.replace('/(tabs)');
      } else {
        router.replace('/authScreen');
      }
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#eef2ff' }}>
        <ActivityIndicator size="large" color="#dc2626" />
      </View>
    );
  }

  return null;
}