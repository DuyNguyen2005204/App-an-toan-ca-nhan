import React from 'react';
import { MapScreen } from '../../src/screens/MapScreen';

// Tạo danh sách các điểm đen nguy hiểm giả lập xung quanh khu vực Biên Hòa / Đồng Nai
const mockDangerZones = [
  { 
    id: 'zone-1', 
    latitude: 10.9574, 
    longitude: 106.8123, 
    title: '⚠️ Điểm Đen Trộm Cướp', 
    description: 'Cảnh báo từ cộng đồng: Khu vực hay xảy ra giật điện thoại ban đêm.' 
  },
  { 
    id: 'zone-2', 
    latitude: 10.9415, 
    longitude: 106.8250, 
    title: '🚨 Đoạn Đường Nguy Hiểm', 
    description: 'Cảnh báo: Đoạn đường vắng, thiếu đèn chiếu sáng công cộng.' 
  }
];

export default function MapPage() {
  // Truyền mảng điểm nguy hiểm qua thuộc tính (props) dangerZones vào component gốc
  return <MapScreen dangerZones={mockDangerZones} />;
}