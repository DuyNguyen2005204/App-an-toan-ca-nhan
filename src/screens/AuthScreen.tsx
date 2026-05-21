import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { signInWithEmail, signUpWithEmail } from '../firebase/firebase';
// TÍCH HỢP ROUTER ĐỂ ĐIỀU HƯỚNG TRANG CHỦ ĐỘNG
import { useRouter } from 'expo-router';

const AuthScreen = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Khởi tạo router điều hướng
  const router = useRouter();

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, fullName, phone);
      } else {
        await signInWithEmail(email, password);
      }
      
      // KHI THÀNH CÔNG: Điều hướng người dùng thẳng vào hệ thống Tab chính ((tabs))
      // Lệnh replace giúp chặn không cho người dùng bấm nút back quay lại màn hình Login
      router.replace('/(tabs)');
      
    } catch (err: any) {
      setError(err.message || 'Lỗi xác thực.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Text style={styles.title}>{isSignUp ? 'Đăng ký tài khoản' : 'Đăng nhập'}</Text>
        
        {isSignUp && (
          <TextInput
            style={styles.input}
            placeholder="Họ và tên"
            value={fullName}
            onChangeText={setFullName}
            placeholderTextColor="#9ca3af"
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#9ca3af"
        />

        <TextInput
          style={styles.input}
          placeholder="Mật khẩu (Từ 6 ký tự)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#9ca3af"
        />

        {isSignUp && (
          <TextInput
            style={styles.input}
            placeholder="Số điện thoại"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholderTextColor="#9ca3af"
          />
        )}

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.buttonText}>{isSignUp ? 'Đăng ký' : 'Đăng nhập'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => {
            setError(null);
            setIsSignUp(!isSignUp);
          }}
        >
          <Text style={styles.switchText}>
            {isSignUp ? 'Bạn đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký'}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f5f7',
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
    color: '#1e293b',
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#d1d5db',
    fontSize: 15,
    color: '#0f172a',
  },
  errorText: {
    color: '#dc2626',
    marginBottom: 14,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  switchButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchText: {
    color: '#2563eb',
    fontSize: 15,
    fontWeight: '600',
  },
});
// Cuối file bạn export default:
export default AuthScreen;