import { Audio } from 'expo-av';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

export class RecordingService {
  private recording: Audio.Recording | null = null;

  /**
   * Bắt đầu ghi âm ngầm
   */
  async startRecording(): Promise<void> {
    try {
      // Yêu cầu quyền ghi âm
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        throw new Error('Quyền microphone bị từ chối. Vui lòng cấp quyền để sử dụng SOS.');
      }

      // Thiết lập âm thanh để hỗ trợ thu âm ở chế độ im lặng trên cả iOS và Android
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      this.recording = recording;
    } catch (error: any) {
      throw new Error(error.message || 'Không thể khởi động ghi âm nền.');
    }
  }

  /**
   * Dừng ghi âm, đẩy lên Firebase Storage và cập nhật doc trên Firestore
   */
  async stopAndUploadRecording(uid: string, alertId: string): Promise<string | null> {
    try {
      // Bỏ qua nếu chưa có tiến trình ghi âm nào
      if (!this.recording) return null;

      // Dừng ghi âm
      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      this.recording = null;

      if (!uri) throw new Error('Không tìm thấy tệp ghi âm (.m4a) trên thiết bị.');

      // Chuẩn bị Blob để upload
      const response = await fetch(uri);
      const blob = await response.blob();

      // Setup Firebase Storage reference
      const storage = getStorage();
      const timestamp = Date.now();
      const storageRef = ref(storage, `recordings/${uid}/${timestamp}.m4a`);

      // Tải file âm thanh lên Firebase
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      // Cập nhật URL vào document emergency_alerts tương ứng
      const db = getFirestore();
      const alertDocRef = doc(db, 'emergency_alerts', alertId);
      await updateDoc(alertDocRef, {
        audioUrl: downloadURL,
        updatedAt: timestamp
      });

      return downloadURL;
    } catch (error: any) {
      throw new Error(error.message || 'Xảy ra lỗi trong quá trình lưu và tải âm thanh lên hệ thống.');
    }
  }
}

export const recordingService = new RecordingService();
