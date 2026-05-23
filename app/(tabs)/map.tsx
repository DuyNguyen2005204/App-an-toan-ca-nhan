import React, { useState, useEffect } from 'react';
import { MapScreen } from '../../src/screens/MapScreen';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../src/services/firebaseConfig';

export default function MapPage() {
  const [dangerZones, setDangerZones] = useState<any[]>([]);

  useEffect(() => {
    // Sử dụng onSnapshot để cập nhật bản đồ thời gian thực (Real-time)
    const unsubscribe = onSnapshot(
      collection(db, 'dangerZones'),
      (snapshot) => {
        const zones = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDangerZones(zones);
      },
      (error) => {
        console.error("Lỗi khi tải điểm đen thời gian thực: ", error);
      }
    );
    
    return () => unsubscribe();
  }, []);

  return <MapScreen dangerZones={dangerZones} />;
}