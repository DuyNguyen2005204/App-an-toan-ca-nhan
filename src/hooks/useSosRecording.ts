import { useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { recordingService } from '../services/recordingService';

const MAX_RECORDING_DURATION = 60000; // 60 giây

export const useSosRecording = (sosActivated: boolean, uid: string, alertId: string) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleSosTrigger = async () => {
      if (sosActivated) {
        try {
          // Khởi động microphone khi bấm SOS
          await recordingService.startRecording();
          
          // Hẹn giờ tự động tắt và upload lên Firebase sau thời gian quy định
          timeoutRef.current = setTimeout(async () => {
            await stopAndUpload();
          }, MAX_RECORDING_DURATION);

        } catch (error: any) {
          Alert.alert('Lỗi Thu Âm', error.message);
        }
      } else {
        // Nếu user nhấn hủy SOS trước khi hết 60s, cũng dừng ngay lập tức
        await stopAndUpload();
      }
    };

    const stopAndUpload = async () => {
      // Clear timeout tránh memory leak
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      try {
        await recordingService.stopAndUploadRecording(uid, alertId);
      } catch (error: any) {
        Alert.alert('Lỗi Tải Lên', error.message);
      }
    };

    handleSosTrigger();

    return () => {
      // Cleanup effect
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [sosActivated, uid, alertId]);
};
