import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { auth } from '../../src/services/firebaseConfig';
import { signOut } from 'firebase/auth';

// Component con cho các mục Accordion (Thanh thả xuống)
const AccordionItem = ({ title, children, isDark }: { title: string, children: React.ReactNode, isDark: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <View style={[styles.accordionCard, isDark && styles.darkCard]}>
      <TouchableOpacity 
        style={styles.accordionHeader} 
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
      >
        <Text style={[styles.accordionTitle, isDark && styles.darkText]}>{title}</Text>
        <Text style={[styles.accordionIcon, isDark && styles.darkSubText]}>{isOpen ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      {isOpen && (
        <View style={[styles.accordionContent, isDark && { borderTopColor: '#334155' }]}>
          {children}
        </View>
      )}
    </View>
  );
};

export default function ProfileScreen() {
  const router = useRouter();
  
  // State quản lý chế độ màu thực tế (Mặc định là Light)
  const [appearance, setAppearance] = useState('Light');
  const [sirenEnabled, setSirenEnabled] = useState(true);
  const [flashlightEnabled, setFlashlightEnabled] = useState(false);

  // Kiểm tra xem người dùng có đang chọn chế độ 'Dark' hay không
  const isDark = appearance === 'Dark';

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/authScreen');
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.darkContainer]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Text style={[styles.mainTitle, isDark && styles.darkText]}>Cài đặt</Text>

        {/* PHẦN 1: THÔNG TIN TÀI KHOẢN */}
        <View style={[styles.settingsIntroCard, isDark && styles.darkCard]}>
          <View style={[styles.iconCircleSettings, isDark && { backgroundColor: '#1e293b', borderColor: '#334155' }]}>
            <Text style={styles.iconText}>⚙️</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={[styles.settingsTitle, isDark && styles.darkText]}>Cấu hình hệ thống</Text>
            <Text style={[styles.settingsDesc, isDark && styles.darkSubText]}>
              Tùy chỉnh cách báo động SOS hoạt động: còi hú, âm lượng, đèn flash và rung.
            </Text>
          </View>
        </View>

        {/* PHẦN 2: CHỌN CHẾ ĐỘ HIỂN THỊ (SẼ ĐỔI MÀU KHI ẤN) */}
        <View style={[styles.sectionCard, isDark && styles.darkCard]}>
          <Text style={[styles.sectionLabel, isDark && styles.darkSubText]}>Giao diện (Appearance)</Text>
          <View style={[styles.appearanceContainer, isDark && { backgroundColor: '#1e293b' }]}>
            {['System', 'Light', 'Dark'].map((mode) => (
              <TouchableOpacity 
                key={mode}
                style={[
                  styles.appearanceButton, 
                  appearance === mode && (isDark ? styles.appearanceButtonActiveDark : styles.appearanceButtonActiveLight)
                ]}
                onPress={() => setAppearance(mode)}
              >
                <Text style={[
                  styles.appearanceText, 
                  appearance === mode && (isDark ? styles.appearanceTextActiveDark : styles.appearanceTextActiveLight),
                  appearance !== mode && isDark && { color: '#94a3b8' }
                ]}>
                  {mode === 'System' ? '🔄 System' : mode === 'Light' ? '☀️ Light' : '🌙 Dark'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* PHẦN 3: CÁC TÙY CHỌN THẢ XUỐNG */}
        <AccordionItem title="Tùy chọn SOS (SOS Options)" isDark={isDark}>
          <View style={[styles.row, isDark && { borderBottomColor: '#334155' }]}>
            <Text style={[styles.rowLabel, isDark && styles.darkText]}>Kích hoạt còi hú (Siren)</Text>
            <Switch value={sirenEnabled} onValueChange={setSirenEnabled} />
          </View>
          <View style={[styles.row, { borderBottomWidth: 0 }]}>
            <Text style={[styles.rowLabel, isDark && styles.darkText]}>Nháy đèn Flash (Strobe)</Text>
            <Switch value={flashlightEnabled} onValueChange={setFlashlightEnabled} />
          </View>
        </AccordionItem>

        <AccordionItem title="Phát hiện té ngã (Fall Detection)" isDark={isDark}>
          <Text style={[styles.infoText, isDark && styles.darkSubText]}>
            Sử dụng cảm biến gia tốc để tự động gửi SOS khi phát hiện va chạm mạnh hoặc té ngã đột ngột.
          </Text>
          <TouchableOpacity style={[styles.actionButton, isDark && { backgroundColor: '#1e293b' }]}>
            <Text style={[styles.actionButtonText, isDark && { color: '#38bdf8' }]}>Cấu hình cảm biến</Text>
          </TouchableOpacity>
        </AccordionItem>

        <AccordionItem title="Kiểm tra định kỳ (Timed Check-In)" isDark={isDark}>
          <Text style={[styles.infoText, isDark && styles.darkSubText]}>
            Tự động gửi thông báo cho người thân nếu bạn không phản hồi sau một khoảng thời gian nhất định (ví dụ: sau mỗi 4 giờ).
          </Text>
        </AccordionItem>

        {/* PHẦN 4: THÔNG TIN TÀI KHOẢN & ĐĂNG XUẤT */}
        <View style={styles.accountCard}>
          <Text style={styles.accountTitle}>Tài khoản hiện tại</Text>
          <Text style={[styles.accountEmail, isDark && styles.darkText]}>{auth.currentUser?.email || 'nguyendanh@gmail.com'}</Text>
          
          <TouchableOpacity style={[styles.logoutBtn, isDark && { backgroundColor: '#7f1d1d' }]} onPress={handleLogout}>
            <Text style={[styles.logoutBtnText, isDark && { color: '#fca5a5' }]}>Đăng xuất tài khoản</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.footerText, isDark && { color: '#475569' }]}>Phiên bản EmergSOS v1.0.4 - 2024</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Style chế độ Sáng (Mặc định)
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  scrollContent: {
    padding: 20,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 25,
  },
  settingsIntroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  iconCircleSettings: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  iconText: {
    fontSize: 24,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  settingsDesc: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    lineHeight: 18,
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 15,
  },
  appearanceContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 4,
  },
  appearanceButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  // Nút active chế độ Sáng
  appearanceButtonActiveLight: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  // Nút active chế độ Tối
  appearanceButtonActiveDark: {
    backgroundColor: '#334155',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  appearanceText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  appearanceTextActiveLight: {
    color: '#1e293b',
  },
  appearanceTextActiveDark: {
    color: '#ffffff',
  },
  accordionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 18,
    alignItems: 'center',
  },
  accordionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
  },
  accordionIcon: {
    fontSize: 10,
    color: '#94a3b8',
  },
  accordionContent: {
    padding: 18,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    marginTop: -5,
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  rowLabel: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  infoText: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 15,
  },
  actionButton: {
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4f46e5',
  },
  accountCard: {
    marginTop: 10,
    padding: 20,
    alignItems: 'center',
  },
  accountTitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 5,
  },
  accountEmail: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 20,
  },
  logoutBtn: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 12,
  },
  logoutBtnText: {
    color: '#ef4444',
    fontWeight: '700',
    fontSize: 14,
  },
  footerText: {
    textAlign: 'center',
    color: '#cbd5e1',
    fontSize: 11,
    marginTop: 10,
    marginBottom: 30,
  },

  // ==========================================
  // TOÀN BỘ CSS PHỤC VỤ CHẾ ĐỘ TỐI (DARK MODE)
  // ==========================================
  darkContainer: {
    backgroundColor: '#0f172a', // Nền đen sâu (Slate 900) cực chuẩn Apple
  },
  darkCard: {
    backgroundColor: '#1e293b', // Nền các ô Card là xám đen (Slate 800)
    borderColor: '#334155',    // Viền xám mờ
  },
  darkText: {
    color: '#f8fafc',          // Chữ màu trắng sáng
  },
  darkSubText: {
    color: '#94a3b8',          // Chữ mô tả màu xám nhạt
  },
});