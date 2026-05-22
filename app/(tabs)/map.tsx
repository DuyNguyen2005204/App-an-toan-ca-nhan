import React, { useState, useEffect } from 'react';
import { MapScreen } from '../../src/screens/MapScreen';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../src/services/firebaseConfig';

export default function MapPage() {
  const [dangerZones, setDangerZones] = useState<any[]>([]);

  useEffect(() => {
    const fetchDangerZones = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'dangerZones'));
        const zones = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDangerZones(zones);
      } catch (error) {
        console.error("Lỗi khi tải điểm đen: ", error);
      }
    };
    
    fetchDangerZones();
  }, []);

  return <MapScreen dangerZones={dangerZones} />;
}