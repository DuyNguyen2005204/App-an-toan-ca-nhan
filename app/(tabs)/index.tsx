import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../src/services/firebaseConfig';
import HomeScreenComponent from '../../src/screens/HomeScreen';
import { View, ActivityIndicator } from 'react-native';

export default function TabsIndexPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
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

  return <HomeScreenComponent user={currentUser} />;
}