import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Dimensions, Alert } from 'react-native';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from '../../src/services/firebaseConfig';
import * as Location from 'expo-location';
import * as SMS from 'expo-sms';

interface Contact {
  name: string;
  phone: string;
  note: string;
}

export default function HomeScreenComponent({ user }: { user: any }) {
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    if (!user?.uid) return;
    const contactsRef = collection(db, 'users', user.uid, 'contacts');
    const unsubscribe = onSnapshot(contactsRef, (snapshot) => {
      const fetchedContacts = snapshot.docs.map(doc => doc.data() as Contact);
      setContacts(fetchedContacts);
    });
    return () => unsubscribe();
  }, [user?.uid]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('Hệ thống hoạt động ổn định');

  const handleAddContact = async () => {
    if (!name || !phone) return;
    if (!user?.uid) {
      Alert.alert('Lỗi', 'Vui lòng đăng nhập để lưu danh bạ.');
      return;
    }
    try {
      const contactsRef = collection(db, 'users', user.uid, 'contacts');
      await addDoc(contactsRef, { name, phone, note });
      setName('');
      setPhone('');
      setNote('');
      Alert.alert('Thành công', 'Đã lưu liên hệ khẩn cấp.');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lưu liên hệ.');
    }
  };

  const handleSendSOS = async () => {
    setStatus('Đang lấy vị trí GPS...');
    let { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
    if (locationStatus !== 'granted') {
      setStatus('Cảnh báo: Không có quyền truy cập Vị trí!');
      Alert.alert('Lỗi', 'Cần cấp quyền vị trí để gửi tọa độ.');
      return;
    }

    try {
      let location = await Location.getCurrentPositionAsync({});
      const gpsLink = `https://www.google.com/maps/search/?api=1&query=${location.coords.latitude},${location.coords.longitude}`;
      const message = `SOS! TÔI ĐANG GẶP NGUY HIỂM. Hãy đến giúp tôi tại: ${gpsLink}`;
      
      const phoneNumbers = contacts.map(c => c.phone);
      if (phoneNumbers.length === 0) {
        Alert.alert('Thiếu thông tin', 'Vui lòng thêm ít nhất 1 số điện thoại liên hệ khẩn cấp trước khi gửi SOS.');
        setStatus('Hệ thống hoạt động ổn định');
        return;
      }

      const isAvailable = await SMS.isAvailableAsync();
      if (isAvailable) {
        await SMS.sendSMSAsync(phoneNumbers, message);
        setStatus('🔴 Đã phát tín hiệu khẩn cấp & gửi GPS!');
      } else {
        Alert.alert('Lỗi', 'Thiết bị này không hỗ trợ gửi tin nhắn SMS.');
        setStatus('Lỗi: Thiết bị không hỗ trợ SMS');
      }
    } catch (error) {
      console.error(error);
      setStatus('Lỗi khi lấy vị trí');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* HEADER: THÔNG TIN TÀI KHOẢN (THIẾT KẾ BO TRÒN SANG TRỌNG) */}
        <View style={styles.headerCard}>
          <View style={styles.avatarUser}>
            <Text style={styles.avatarUserText}>{user?.email ? user.email[0].toUpperCase() : 'U'}</Text>
          </View>
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.headerWelcome}>Xin chào,</Text>
            <Text style={styles.headerEmail} numberOfLines={1}>{user?.email || 'nguyendanh@gmail.com'}</Text>
            <Text style={styles.headerUid} numberOfLines={1}>UID: {user?.uid || 'x47vfShD5jNm7NRiz0O2nv0PkmR2'}</Text>
          </View>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>

        {/* TRẠNG THÁI HỆ THỐNG */}
        <View style={styles.statusBox}>
          <Text style={styles.statusLabel}>Trạng thái:</Text>
          <Text style={[styles.statusValue, { color: status.includes('🔴') ? '#ef4444' : '#10b981' }]}>{status}</Text>
        </View>

        {/* ==========================================================
            BẮT ĐẦU GRID Ô VUÔNG CỨU HỘ 2 CỘT (GIỐNG 100% ẢNH MẪU CỦA BẠN)
            ========================================================== */}
        <Text style={styles.menuTitle}>Bảng điều khiển khẩn cấp</Text>
        
        <View style={styles.gridContainer}>
          
          {/* Ô VUÔNG 1: NÚT BẤM SOS SIÊU CẤP */}
          <TouchableOpacity 
            style={[styles.gridItem, { backgroundColor: '#fee2e2', borderColor: '#fca5a5' }]} 
            activeOpacity={0.8}
            onPress={handleSendSOS}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#ef4444' }]}>
              <Text style={styles.gridIcon}>🚨</Text>
            </View>
            <Text style={[styles.gridTitle, { color: '#991b1b' }]}>Gửi SOS</Text>
            <Text style={styles.gridDesc}>Phát tín hiệu cứu hộ khẩn cấp ngay lập tức</Text>
          </TouchableOpacity>

          {/* Ô VUÔNG 2: DANH BẠ LIÊN HỆ */}
          <View style={[styles.gridItem, { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }]}>
            <View style={[styles.iconCircle, { backgroundColor: '#3b82f6' }]}>
              <Text style={styles.gridIcon}>📋</Text>
            </View>
            <Text style={[styles.gridTitle, { color: '#1e3a8a' }]}>Người thân</Text>
            
            {/* List mini hiển thị danh bạ bên trong ô vuông */}
            <ScrollView style={styles.miniContactScroll} nestedScrollEnabled={true}>
              {contacts.map((item, index) => (
                <View key={index} style={styles.miniContactItem}>
                  <Text style={styles.miniContactName} numberOfLines={1}>{item.name} ({item.note})</Text>
                  <Text style={styles.miniContactPhone}>{item.phone}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Ô VUÔNG 3: HƯỚNG DẪN Y TẾ / SƠ CỨU */}
          <TouchableOpacity 
            style={[styles.gridItem, { backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }]}
            activeOpacity={0.8}
            onPress={() => alert('Đang tải cẩm nang sơ cứu chấn thương...')}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#10b981' }]}>
              <Text style={styles.gridIcon}>🏥</Text>
            </View>
            <Text style={[styles.gridTitle, { color: '#065f46' }]}>Cẩm nang y tế</Text>
            <Text style={styles.gridDesc}>Xem nhanh các bước sơ cứu tai nạn tại chỗ</Text>
          </TouchableOpacity>

          {/* Ô VUÔNG 4: ĐƯỜNG DÂY NÓNG CHÍNH PHỦ */}
          <TouchableOpacity 
            style={[styles.gridItem, { backgroundColor: '#fff7ed', borderColor: '#ffedd5' }]}
            activeOpacity={0.8}
            onPress={() => alert('Tổng đài Công an: 113 | Cứu hỏa: 114 | Cứu thương: 115')}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#f97316' }]}>
              <Text style={styles.gridIcon}>📞</Text>
            </View>
            <Text style={[styles.gridTitle, { color: '#9a3412' }]}>Hotline 113/115</Text>
            <Text style={styles.gridDesc}>Danh sách đường dây nóng cơ quan chức năng</Text>
          </TouchableOpacity>

        </View>

        {/* ==========================================================
            KHU VỰC THÊM LIÊN HỆ MỚI (ĐƯỢC ĐẨY XUỐNG DƯỚI GỌN GÀNG)
            ========================================================== */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>➕ Thêm liên hệ khẩn cấp</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Họ và tên..." 
            placeholderTextColor="#94a3b8"
            value={name}
            onChangeText={setName}
          />
          <TextInput 
            style={styles.input} 
            placeholder="Số điện thoại..." 
            placeholderTextColor="#94a3b8"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <TextInput 
            style={styles.input} 
            placeholder="Quan hệ (Ví dụ: Bố mẹ, Bạn thân...)" 
            placeholderTextColor="#94a3b8"
            value={note}
            onChangeText={setNote}
          />
          <TouchableOpacity style={styles.submitButton} activeOpacity={0.8} onPress={handleAddContact}>
            <Text style={styles.submitButtonText}>Lưu vào hệ thống</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// Tính toán độ rộng của ô vuông để tự động co giãn đẹp mắt trên cả Web và Điện thoại
const { width } = Dimensions.get('window');
const isWeb = width > 650;
const itemWidth = isWeb ? 290 : (width - 50) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 16,
    maxWidth: 650,
    width: '100%',
    alignSelf: 'center',
  },
  // Style Header Tài Khoản
  headerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
  },
  avatarUser: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarUserText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  headerWelcome: {
    color: '#64748b',
    fontSize: 13,
  },
  headerEmail: {
    color: '#1e293b',
    fontSize: 16,
    fontWeight: '700',
  },
  headerUid: {
    color: '#94a3b8',
    fontSize: 11,
    fontFamily: 'monospace',
    marginTop: 2,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ef4444',
    marginRight: 4,
  },
  liveText: {
    color: '#ef4444',
    fontSize: 10,
    fontWeight: '800',
  },
  // Trạng thái hệ thống
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  statusLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  statusValue: {
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // ==========================================
  // CONFIG CSS HỆ THỐNG GRID Ô VUÔNG CỦA BẠN
  // ==========================================
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gridItem: {
    width: itemWidth,
    height: 160,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    marginBottom: 14,
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 1,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  gridIcon: {
    fontSize: 18,
    color: '#fff',
  },
  gridTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  gridDesc: {
    fontSize: 11,
    color: '#64748b',
    lineHeight: 15,
  },
  // Mini ScrollView phục vụ việc hiển thị danh bạ lồng trong ô vuông
  miniContactScroll: {
    flex: 1,
    marginTop: 2,
  },
  miniContactItem: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 6,
    padding: 6,
    marginBottom: 4,
  },
  miniContactName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1e293b',
  },
  miniContactPhone: {
    fontSize: 10,
    color: '#475569',
  },
  // Cấu trúc Form Nhập Liệu phía dưới
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 30,
  },
  formTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#334155',
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});