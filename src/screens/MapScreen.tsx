import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Text,
  Platform,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { getCurrentLocation } from '../services/locationService';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../services/firebaseConfig';

// Định nghĩa cấu trúc dữ liệu cho Điểm Nguy Hiểm chuẩn TypeScript
interface DangerZone {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
}

// Khai báo cổng nhận dữ liệu Props từ file router ngoài truyền vào
interface MapScreenProps {
  dangerZones?: DangerZone[];
}

// CHỈ IMPORT THƯ VIỆN BẢN ĐỒ VÀ MARKER GỐC NẾU KHÔNG PHẢI MÔI TRƯỜNG WEB
let MapView: any;
let Marker: any;
if (Platform.OS !== 'web') {
  const MapModule = require('react-native-maps');
  MapView = MapModule.default;
  Marker = MapModule.Marker;
}

export const MapScreen = ({ dangerZones = [] }: MapScreenProps) => {
  const mapRef = useRef<any>(null);
  const [region, setRegion] = useState<any>(null);

  // States cho tính năng đóng góp điểm đen nguy hiểm
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [latStr, setLatStr] = useState('');
  const [lngStr, setLngStr] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        // Lấy tọa độ hiện tại qua service chuẩn Expo
        const location = await getCurrentLocation();
        
        if (location) {
          const newRegion = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.05, // Mở rộng góc nhìn một chút để thấy các điểm xung quanh
            longitudeDelta: 0.05,
          };
          
          setRegion(newRegion);
          
          // Chỉ chạy hiệu ứng animate focus nếu không phải môi trường Web
          if (Platform.OS !== 'web') {
            mapRef.current?.animateToRegion(newRegion, 1000);
          }
        }
      } catch (error: any) {
        // Hiển thị popup tiếng Việt cảnh báo nếu lỗi
        Alert.alert('Lỗi Vị Trí', error.message);
      }
    };

    fetchLocation();
  }, []);

  // Mở Modal đóng góp trên Web
  const handleOpenWebModal = () => {
    setTitle('');
    setDescription('');
    if (region) {
      setLatStr(region.latitude.toFixed(6));
      setLngStr(region.longitude.toFixed(6));
    } else {
      setLatStr('');
      setLngStr('');
    }
    setModalVisible(true);
  };

  // Mở Modal khi Nhấn giữ bản đồ trên Mobile (Nhận tọa độ trực tiếp)
  const handleMapLongPress = (event: any) => {
    const { coordinate } = event.nativeEvent;
    setTitle('');
    setDescription('');
    setLatStr(coordinate.latitude.toFixed(6));
    setLngStr(coordinate.longitude.toFixed(6));
    setModalVisible(true);
  };

  // Lưu điểm đen nguy hiểm lên Firestore
  const handleSaveDangerZone = async () => {
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      Alert.alert('Lỗi dữ liệu', 'Tọa độ Vĩ độ và Kinh độ phải là chữ số hợp lệ.');
      return;
    }

    if (!title.trim() || !description.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập đầy đủ Tiêu đề và Mô tả chi tiết.');
      return;
    }

    // Kiểm tra đăng nhập
    if (!auth.currentUser) {
      Alert.alert('Yêu cầu đăng nhập', 'Bạn phải đăng nhập hệ thống để sử dụng tính năng đóng góp điểm đen.');
      return;
    }

    setSaving(true);
    try {
      await addDoc(collection(db, 'dangerZones'), {
        latitude: lat,
        longitude: lng,
        title: title.trim(),
        description: description.trim(),
        creatorUid: auth.currentUser.uid,
        creatorEmail: auth.currentUser.email,
        createdAt: Date.now()
      });

      Alert.alert('Đóng góp thành công', 'Cảm ơn bạn đã chung tay bảo vệ cộng đồng! Điểm đen đã được ghim lên bản đồ.');
      setModalVisible(false);
      setTitle('');
      setDescription('');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Lỗi hệ thống', error.message || 'Không thể lưu điểm đen nguy hiểm.');
    } finally {
      setSaving(false);
    }
  };

  // Giao diện Modal nhập liệu điểm đen đẹp mắt
  const renderModal = () => (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalHeaderTitle}>🛡️ Đóng Góp Điểm Đen Cảnh Báo</Text>
          <View style={styles.modalDivider} />
          
          <ScrollView contentContainerStyle={{ paddingBottom: 10 }} showsVerticalScrollIndicator={false}>
            {/* Input Vĩ độ */}
            <Text style={styles.inputLabel}>Vĩ độ (Latitude)</Text>
            <TextInput
              style={[styles.modalInput, Platform.OS !== 'web' && styles.modalInputDisabled]}
              value={latStr}
              onChangeText={setLatStr}
              placeholder="Ví dụ: 10.762622"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
              editable={Platform.OS === 'web'} // Trên di động khóa input tránh gõ nhầm tọa độ
            />

            {/* Input Kinh độ */}
            <Text style={styles.inputLabel}>Kinh độ (Longitude)</Text>
            <TextInput
              style={[styles.modalInput, Platform.OS !== 'web' && styles.modalInputDisabled]}
              value={lngStr}
              onChangeText={setLngStr}
              placeholder="Ví dụ: 106.660172"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
              editable={Platform.OS === 'web'}
            />

            {/* Input Tiêu đề */}
            <Text style={styles.inputLabel}>Tiêu đề cảnh báo</Text>
            <TextInput
              style={styles.modalInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Ví dụ: Hẻm vắng hay xảy ra cướp giật"
              placeholderTextColor="#94a3b8"
            />

            {/* Input Mô tả */}
            <Text style={styles.inputLabel}>Mô tả chi tiết mối nguy hiểm</Text>
            <TextInput
              style={[styles.modalInput, styles.modalTextArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Ví dụ: Đoạn hẻm này tối, thiếu đèn đường, thường xuyên có đối tượng lạ tụ tập..."
              placeholderTextColor="#94a3b8"
              multiline={true}
              numberOfLines={3}
            />
          </ScrollView>

          <View style={styles.modalActionRow}>
            <TouchableOpacity 
              style={[styles.modalBtn, styles.modalBtnCancel]} 
              onPress={() => setModalVisible(false)}
              disabled={saving}
            >
              <Text style={styles.modalBtnCancelText}>Hủy bỏ</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.modalBtn, styles.modalBtnSave]} 
              onPress={handleSaveDangerZone}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.modalBtnSaveText}>Lưu Lại</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // =========================================================================
  // GIAO DIỆN DÀNH RIÊNG CHO MÔI TRƯỜNG WEB (Hiển thị tọa độ + Danh sách điểm đen từ Cộng đồng)
  // =========================================================================
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, styles.webContainer]}>
        <View style={styles.webCard}>
          <Text style={styles.webTitle}>🛡️ HỆ THỐNG ĐỊNH VỊ SOS & ĐIỂM ĐEN NGUY HIỂM</Text>
          <View style={styles.divider} />
          
          <Text style={styles.webSubText}>
            {region 
              ? `📍 Vị trí hiện tại của bạn:\nLat: ${region.latitude.toFixed(6)} | Lng: ${region.longitude.toFixed(6)}`
              : '📡 Đang quét tín hiệu vệ tinh GPS...'}
          </Text>

          {/* NÚT BẤM ĐỒNG GÓP ĐIỂM ĐEN (DÀNH RIÊNG WEB) */}
          <TouchableOpacity style={styles.webAddBtn} onPress={handleOpenWebModal}>
            <Text style={styles.webAddBtnText}>➕ ĐÓNG GÓP ĐIỂM ĐEN MỚI</Text>
          </TouchableOpacity>

          {/* HIỂN THỊ CÁC ĐIỂM ĐEN NGUY HIỂM TRÊN WEB */}
          <View style={styles.webDangerSection}>
            <Text style={styles.webDangerHeader}>🚨 Cảnh báo điểm đen gần bạn (Web Demo):</Text>
            {dangerZones.map((zone) => (
              <View key={zone.id} style={styles.webDangerItem}>
                <Text style={styles.webDangerTitle}>{zone.title}</Text>
                <Text style={styles.webDangerDesc}>{zone.description}</Text>
                <Text style={styles.webDangerCoords}>Tọa độ: {zone.latitude}, {zone.longitude}</Text>
              </View>
            ))}
          </View>
          
          <Text style={styles.webNote}>
            * Lưu ý: Tính năng bản đồ đồ họa trực quan chạy tốt nhất trên thiết bị di động thật hoặc Emulator (Android/iOS) để tương thích với SDK bản đồ gốc.
          </Text>
        </View>
        {renderModal()}
      </View>
    );
  }

  // =========================================================================
  // GIAO DIỆN CHUẨN KHI CHẠY TRÊN THIẾT BỊ DI ĐỘNG (Bản đồ gốc + Chấm ghim đỏ)
  // =========================================================================
  return (
    <View style={styles.container}>
      {/* FLOATING BANNER GỢI Ý NGƯỜI DÙNG */}
      <View style={styles.floatingBanner}>
        <Text style={styles.floatingBannerText}>💡 Mẹo: Nhấn giữ 2 giây vào bất kỳ điểm nào trên bản đồ để Đóng góp điểm đen nguy hiểm.</Text>
      </View>

      {MapView && (
        <MapView
          ref={mapRef}
          style={styles.map}
          showsUserLocation={true} // Hiển thị chấm xanh dương vị trí hiện tại
          showsMyLocationButton={true}
          initialRegion={region}
          onLongPress={handleMapLongPress} // Bắt sự kiện Nhấn giữ bản đồ
        >
          {/* Vẽ các ghim Marker cảnh báo màu đỏ lên bản đồ di động */}
          {Marker && dangerZones.map((zone) => (
            <Marker
              key={zone.id}
              coordinate={{ latitude: zone.latitude, longitude: zone.longitude }}
              pinColor="red" // Ép ghim chuyển màu đỏ cảnh báo nguy hiểm
              title={zone.title}
              description={zone.description}
            />
          ))}
        </MapView>
      )}
      {renderModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  // Toàn bộ style giao diện đẹp mắt phục vụ môi trường Web
  webContainer: {
    flex: 1,
    backgroundColor: '#eef2ff', 
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  webCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  webTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 12,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#cbd5e1',
    marginBottom: 16,
  },
  webSubText: {
    fontSize: 14,
    color: '#2563eb',
    lineHeight: 22,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 16,
  },
  // Style cho danh sách điểm đen khẩn cấp trên giao diện Web
  webDangerSection: {
    backgroundColor: '#fff5f5',
    borderColor: '#fee2e2',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  webDangerHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#991b1b',
    marginBottom: 8,
  },
  webDangerItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#fca5a5',
    paddingVertical: 8,
  },
  webDangerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#dc2626',
  },
  webDangerDesc: {
    fontSize: 12,
    color: '#451a03',
    marginTop: 2,
  },
  webDangerCoords: {
    fontSize: 11,
    color: '#7f1d1d',
    fontStyle: 'italic',
    marginTop: 2,
  },
  webNote: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 18,
    marginTop: 8,
  },
  
  // ==========================================
  // STYLES CHO MODAL ĐÓNG GÓP ĐIỂM ĐEN ĐẸP MẮT
  // ==========================================
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)', // Phủ mờ tối slate
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 450,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#991b1b',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
    marginTop: 8,
  },
  modalInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 8,
  },
  modalInputDisabled: {
    backgroundColor: '#e2e8f0',
    color: '#64748b',
    borderColor: '#cbd5e1',
  },
  modalTextArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  modalActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnCancel: {
    backgroundColor: '#f1f5f9',
    marginRight: 12,
  },
  modalBtnCancelText: {
    color: '#475569',
    fontWeight: '700',
    fontSize: 14,
  },
  modalBtnSave: {
    backgroundColor: '#dc2626',
  },
  modalBtnSaveText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  
  // Banner nổi hướng dẫn di động
  floatingBanner: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 99,
  },
  floatingBannerText: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 18,
  },

  // Nút đóng góp điểm đen trên Web
  webAddBtn: {
    backgroundColor: '#dc2626',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginVertical: 14,
    shadowColor: '#dc2626',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  webAddBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.5,
  },
});