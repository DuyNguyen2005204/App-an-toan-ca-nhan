import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import MapView, { Region } from 'react-native-maps';
import { getCurrentLocation } from '../services/locationService';

export const MapScreen = () => {
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region | undefined>(undefined);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        // Lấy tọa độ hiện tại qua service
        const location = await getCurrentLocation();
        
        if (location) {
          const newRegion = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };
          
          setRegion(newRegion);
          
          // Tự động animate bản đồ focus vào vị trí hiện tại của người dùng
          mapRef.current?.animateToRegion(newRegion, 1000);
        }
      } catch (error: any) {
        // Hiển thị popup tiếng Việt cảnh báo nếu lỗi
        Alert.alert('Lỗi Vị Trí', error.message);
      }
    };

    fetchLocation();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={true} // Hiển thị chấm xanh dương mặc định
        showsMyLocationButton={true}
        initialRegion={region}
      />
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
});
