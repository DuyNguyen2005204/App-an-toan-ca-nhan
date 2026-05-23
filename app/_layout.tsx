import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Chỉ định rõ luồng điều hướng giữa màn hình đăng nhập và cụm Tab */}
      <Stack.Screen name="authScreen" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen 
        name="medicalHandbook" 
        options={{ 
          headerShown: true, 
          title: 'Cẩm Nang Sơ Cứu Khẩn Cấp',
          headerStyle: { backgroundColor: '#10b981' }, // Màu xanh lá Emerald chuẩn y tế
          headerTintColor: '#ffffff', // Chữ trắng sang trọng
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
    </Stack>
  );
}