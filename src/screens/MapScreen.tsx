import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Alert, Text, Platform } from 'react-native';
import { getCurrentLocation } from '../services/locationService';

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
      </View>
    );
  }

  // =========================================================================
  // GIAO DIỆN CHUẨN KHI CHẠY TRÊN THIẾT BỊ DI ĐỘNG (Bản đồ gốc + Chấm ghim đỏ)
  // =========================================================================
  return (
    <View style={styles.container}>
      {MapView && (
        <MapView
          ref={mapRef}
          style={styles.map}
          showsUserLocation={true} // Hiển thị chấm xanh dương vị trí hiện tại
          showsMyLocationButton={true}
          initialRegion={region}
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
});