import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Audio } from 'expo-av';
import FakeCallModal, { CallerInfo } from '../../src/components/FakeCallModal';

// Thông tin cơ quan chức năng mặc định cho tab Mở Rộng
const DEFAULT_CALLER: CallerInfo = {
  name: 'Đội Cứu Hộ Khẩn Cấp',
  subtitle: 'Lực lượng Phản ứng Nhanh 113',
  emoji: '🚨',
  color: '#dc2626',
};

export default function FeatureScreen() {
  const [fakeCallVisible, setFakeCallVisible] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  async function startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Lỗi', 'Cần cấp quyền Microphone để ghi âm.');
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Lỗi khi bắt đầu ghi âm', err);
    }
  }

  async function stopRecording() {
    if (!recording) return;
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log('Ghi âm hoàn tất, file lưu tại:', uri);
      Alert.alert('Ghi âm hoàn tất', `File đã lưu tạm tại: ${uri}`);
      // TODO: Thêm logic upload file uri này lên Firebase Storage ở đây
    } catch (err) {
      console.error('Lỗi khi dừng ghi âm', err);
    }
    setRecording(null);
    setIsRecording(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Tính Năng Mở Rộng</Text>
      <Text style={styles.subtitle}>Bảo vệ bạn trong mọi tình huống khẩn cấp</Text>

      {/* NÚT BẤM 1: FAKE CALL (dùng FakeCallModal dùng chung) */}
      <TouchableOpacity 
        style={[styles.card, { backgroundColor: '#2563eb' }]} 
        onPress={() => setFakeCallVisible(true)}
      >
        <Text style={styles.cardTitle}>📞 Kích Hoạt Fake Call</Text>
        <Text style={styles.cardDesc}>Tạo cuộc gọi giả lập tức thì từ đội cứu hộ để thoát khỏi tình huống khó xử.</Text>
      </TouchableOpacity>

      {/* NÚT BẤM 2: GHI ÂM KHẨN CẤP */}
      <TouchableOpacity 
        style={[styles.card, { backgroundColor: isRecording ? '#dc2626' : '#16a34a' }]} 
        onPress={isRecording ? stopRecording : startRecording}
      >
        <Text style={styles.cardTitle}>
          {isRecording ? '🛑 Đang Ghi Âm Khẩn Cấp...' : '🎙️ Bật Ghi Âm Môi Trường'}
        </Text>
        <Text style={styles.cardDesc}>
          {isRecording 
            ? 'Hệ thống đang bí mật thu âm âm thanh xung quanh và đồng bộ trực tuyến lên Firebase DB.' 
            : 'Tự động ghi âm ngầm môi trường xung quanh khi có nguy hiểm cận kề.'}
        </Text>
      </TouchableOpacity>

      {/* MODAL CUỘC GỌI GIẢ LẬP DÙNG CHUNG */}
      <FakeCallModal
        visible={fakeCallVisible}
        caller={DEFAULT_CALLER}
        onClose={() => setFakeCallVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 20, justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: '700', color: '#1e293b', textAlign: 'center', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 30 },
  card: { padding: 20, borderRadius: 12, marginBottom: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 8 },
  cardDesc: { fontSize: 13, color: '#f1f5f9', lineHeight: 18 },
});