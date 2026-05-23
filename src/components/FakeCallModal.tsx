import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  StatusBar,
  Platform,
} from 'react-native';

export interface CallerInfo {
  name: string;       // Tên người gọi hiển thị (VD: "Cảnh sát 113")
  subtitle: string;   // Dòng phụ (VD: "Công An Nhân Dân")
  emoji: string;      // Biểu tượng (VD: "🚨")
  color: string;      // Màu nhấn mạnh (VD: "#ef4444")
}

interface FakeCallModalProps {
  visible: boolean;
  caller: CallerInfo;
  onClose: () => void;
}

// Danh sách các nút chức năng giả lập trên giao diện đàm thoại
const CALL_FEATURES = [
  { icon: '🔇', label: 'Im lặng' },
  { icon: '⌨️', label: 'Bàn phím' },
  { icon: '🔊', label: 'Loa ngoài' },
  { icon: '➕', label: 'Thêm cuộc' },
  { icon: '📹', label: 'FaceTime' },
  { icon: '👤', label: 'Danh bạ' },
];

export default function FakeCallModal({ visible, caller, onClose }: FakeCallModalProps) {
  // Trạng thái cuộc gọi: 'ringing' (đổ chuông) hoặc 'active' (đang nói)
  const [callState, setCallState] = useState<'ringing' | 'active'>('ringing');
  // Bộ đếm giây đàm thoại
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset mỗi khi Modal mở ra
  useEffect(() => {
    if (visible) {
      setCallState('ringing');
      setSeconds(0);
    } else {
      // Dọn dẹp khi đóng
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setCallState('ringing');
      setSeconds(0);
    }
  }, [visible]);

  // Bật / tắt timer khi chuyển sang trạng thái active
  useEffect(() => {
    if (callState === 'active') {
      timerRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [callState]);

  // Chấp nhận cuộc gọi → chuyển sang trạng thái đàm thoại
  const handleAccept = () => {
    setCallState('active');
    setSeconds(0);
  };

  // Gác máy → tắt Modal
  const handleHangUp = () => {
    onClose();
  };

  // Format giây → MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const secs = (totalSeconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      statusBarTranslucent={true}
      onRequestClose={handleHangUp}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <View style={styles.fullScreen}>

        {/* ================================================================
            TRẠNG THÁI 1: ĐANG ĐỔ CHUÔNG (INCOMING CALL)
            ================================================================ */}
        {callState === 'ringing' && (
          <View style={styles.container}>
            {/* Đầu màn hình: Thông tin người gọi */}
            <View style={styles.topSection}>
              <Text style={styles.incomingLabel}>CUỘC GỌI KHẨN CẤP ĐẾN</Text>

              {/* Avatar cơ quan */}
              <View style={[styles.callerAvatar, { borderColor: caller.color }]}>
                <Text style={styles.callerAvatarEmoji}>{caller.emoji}</Text>
              </View>

              <Text style={styles.callerName}>{caller.name}</Text>
              <Text style={styles.callerSubtitle}>{caller.subtitle}</Text>
              <Text style={styles.callerRinging}>Đang đổ chuông...</Text>
            </View>

            {/* Cuối màn hình: Nút Từ chối / Chấp nhận */}
            <View style={styles.actionRow}>
              {/* Từ chối */}
              <View style={styles.actionItem}>
                <TouchableOpacity
                  style={[styles.actionCircle, styles.declineCircle]}
                  onPress={handleHangUp}
                  activeOpacity={0.8}
                >
                  <Text style={styles.actionCircleIcon}>📵</Text>
                </TouchableOpacity>
                <Text style={styles.actionLabel}>Từ chối</Text>
              </View>

              {/* Chấp nhận */}
              <View style={styles.actionItem}>
                <TouchableOpacity
                  style={[styles.actionCircle, styles.acceptCircle]}
                  onPress={handleAccept}
                  activeOpacity={0.8}
                >
                  <Text style={styles.actionCircleIcon}>📞</Text>
                </TouchableOpacity>
                <Text style={styles.actionLabel}>Chấp nhận</Text>
              </View>
            </View>
          </View>
        )}

        {/* ================================================================
            TRẠNG THÁI 2: ĐANG ĐÀM THOẠI (ACTIVE CALL)
            ================================================================ */}
        {callState === 'active' && (
          <View style={styles.container}>
            {/* Thông tin người gọi + đồng hồ */}
            <View style={styles.topSection}>
              <Text style={styles.activeCallerName}>{caller.name}</Text>
              <Text style={styles.activeCallerSubtitle}>{caller.subtitle}</Text>
              <Text style={styles.callTimer}>{formatTime(seconds)}</Text>
            </View>

            {/* Bảng nút chức năng giả lập (2 hàng × 3 nút) */}
            <View style={styles.featureGrid}>
              {CALL_FEATURES.map((feat, idx) => (
                <View key={idx} style={styles.featureItem}>
                  <View style={styles.featureCircle}>
                    <Text style={styles.featureIcon}>{feat.icon}</Text>
                  </View>
                  <Text style={styles.featureLabel}>{feat.label}</Text>
                </View>
              ))}
            </View>

            {/* Nút Gác máy */}
            <View style={styles.hangUpRow}>
              <View style={styles.actionItem}>
                <TouchableOpacity
                  style={[styles.actionCircle, styles.declineCircle]}
                  onPress={handleHangUp}
                  activeOpacity={0.8}
                >
                  <Text style={styles.actionCircleIcon}>📵</Text>
                </TouchableOpacity>
                <Text style={styles.actionLabel}>Gác máy</Text>
              </View>
            </View>
          </View>
        )}

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? 50 : 60,
    paddingBottom: 50,
    paddingHorizontal: 24,
  },

  // ─── Phần thông tin người gọi ───────────────────────────────────────────────
  topSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  incomingLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2.5,
    marginBottom: 28,
    textTransform: 'uppercase',
  },
  callerAvatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  callerAvatarEmoji: {
    fontSize: 50,
  },
  callerName: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  callerSubtitle: {
    color: '#94a3b8',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 14,
  },
  callerRinging: {
    color: '#22c55e',
    fontSize: 15,
    fontWeight: '600',
  },

  // ─── Active call info ───────────────────────────────────────────────────────
  activeCallerName: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  activeCallerSubtitle: {
    color: '#94a3b8',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 12,
  },
  callTimer: {
    color: '#22c55e',
    fontSize: 18,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
    letterSpacing: 2,
  },

  // ─── Bảng nút chức năng giả lập ────────────────────────────────────────────
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    rowGap: 20,
  },
  featureItem: {
    width: '30%',
    alignItems: 'center',
  },
  featureCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureIcon: {
    fontSize: 26,
  },
  featureLabel: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },

  // ─── Hàng nút hành động (Từ chối / Chấp nhận / Gác máy) ──────────────────
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  hangUpRow: {
    alignItems: 'center',
  },
  actionItem: {
    alignItems: 'center',
  },
  actionCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 10,
  },
  declineCircle: {
    backgroundColor: '#dc2626',
  },
  acceptCircle: {
    backgroundColor: '#16a34a',
  },
  actionCircleIcon: {
    fontSize: 30,
  },
  actionLabel: {
    color: '#e2e8f0',
    fontSize: 13,
    fontWeight: '600',
  },
});
