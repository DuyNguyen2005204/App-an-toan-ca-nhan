import { useEffect, useState } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Text, View, ActivityIndicator } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';

// Trỏ chuẩn xác bằng đường dẫn tương đối lùi 2 tầng thư mục
import { auth } from '../../src/services/firebaseConfig';

export default function TabsLayout() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Nếu chưa đăng nhập -> Đẩy thẳng ra màn hình authScreen
        router.replace('/authScreen');
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#FF3B30" />
      </View>
    );
  }

  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: '#FF3B30',
      tabBarInactiveTintColor: '#8E8E93',
      headerShown: true,
      headerTitleAlign: 'center',
      headerStyle: { backgroundColor: '#FFF' },
      headerTitleStyle: { fontWeight: 'bold', color: '#333' }
    }}>
      {/* 1. TAB CỨU HỘ */}
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: "Báo Động SOS",
          tabBarLabel: "Cứu Hộ",
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🚨</Text>
        }} 
      />

      {/* 2. TAB BẢN ĐỒ */}
      <Tabs.Screen 
        name="map" 
        options={{ 
          title: "Bản Đồ An Toàn",
          tabBarLabel: "Bản Đồ",
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🗺️</Text>
        }} 
      />
      
      {/* 3. TAB TÍNH NĂNG MỞ RỘNG (Vừa được bổ sung) */}
      <Tabs.Screen 
        name="featureScreen" 
        options={{ 
          title: "Tính Năng Mở Rộng",
          tabBarLabel: "Mở Rộng",
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🛠️</Text>
        }} 
      />
      
      {/* 4. TAB CÁ NHÂN */}
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: "Hồ Sơ Cá Nhân",
          tabBarLabel: "Cá Nhân",
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>👤</Text>
        }} 
      />
      
    </Tabs>
  );
}