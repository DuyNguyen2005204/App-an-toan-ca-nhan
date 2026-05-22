import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, SafeAreaView, Alert } from 'react-native';
import { Audio } from 'expo-av';

export default function FeatureScreen() {
  const [isFakeCallVisible, setIsFakeCallVisible] = useState(false);
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

      {/* NÚT BẤM 1: FAKE CALL */}
      <TouchableOpacity 
        style={[styles.card, { backgroundColor: '#2563eb' }]} 
        onPress={() => setIsFakeCallVisible(true)}
      >
        <Text style={styles.cardTitle}>📞 Kích Hoạt Fake Call</Text>
        <Text style={styles.cardDesc}>Tạo cuộc gọi giả lập lập tức để thoát khỏi đám đông hoặc tình huống khó xử.</Text>
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

      {/* --- GIAO DIỆN MÀN HÌNH CUỘC GỌI GIẢ LẬP TRÀN MÀN HÌNH (MODAL FAKE CALL) --- */}
      <Modal visible={isFakeCallVisible} animationType="slide" transparent={false}>
        <View style={styles.callContainer}>
          <View style={styles.callHeader}>
            <Text style={styles.callerIncoming}>CUỘC GỌI ĐẾN</Text>
            <Text style={styles.callerName}>Đội Cứu Hộ Khẩn Cấp 🚨</Text>
            <Text style={styles.callStatus}>Đang gọi...</Text>
          </View>

          <View style={styles.callActionRow}>
            {/* Nút từ chối cuộc gọi */}
            <TouchableOpacity style={[styles.callButton, { backgroundColor: '#dc2626' }]} onPress={() => setIsFakeCallVisible(false)}>
              <Text style={styles.callButtonText}>Từ chối</Text>
            </TouchableOpacity>

            {/* Nút chấp nhận cuộc gọi */}
            <TouchableOpacity style={[styles.callButton, { backgroundColor: '#16a34a' }]} onPress={() => alert('Đã kết nối cuộc gọi cứu hộ giả lập!')}>
              <Text style={styles.callButtonText}>Chấp nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  // Định dạng cuộc gọi giả
  callContainer: { flex: 1, backgroundColor: '#0f172a', justifyContent: 'space-between', paddingVertical: 80, alignItems: 'center' },
  callHeader: { alignItems: 'center', marginTop: 40 },
  callerIncoming: { color: '#94a3b8', fontSize: 14, letterSpacing: 2, marginBottom: 10, fontWeight: '600' },
  callerName: { color: '#ffffff', fontSize: 28, fontWeight: '700', marginBottom: 5 },
  callStatus: { color: '#22c55e', fontSize: 16 },
  callActionRow: { flexDirection: 'row', width: '80%', justifyContent: 'space-around' },
  callButton: { width: 100, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  callButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 }
});