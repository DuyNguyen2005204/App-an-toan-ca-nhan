import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Chỉ định rõ luồng điều hướng giữa màn hình đăng nhập và cụm Tab */}
      <Stack.Screen name="authScreen" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}