import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';
import GetLocation from 'react-native-get-location';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import {
  EmergencyLocation,
  RescueContact,
  getUserProfile,
  sendEmergencyAlert,
  signOutCurrentUser,
  updateRescueContacts,
} from '../firebase/firebase';

interface HomeScreenProps {
  user: FirebaseAuthTypes.User;
}

const HomeScreen = ({ user }: HomeScreenProps) => {
  const [status, setStatus] = useState('Ứng dụng sẵn sàng');
  const [contacts, setContacts] = useState<RescueContact[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    async function loadProfile() {
      const profile = await getUserProfile(user.uid);
      if (profile) {
        setContacts(profile.contacts || []);
      }
    }
    loadProfile();
  }, [user.uid]);

  const handleAddContact = async () => {
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    if (!trimmedName || !trimmedPhone) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên và số điện thoại.');
      return;
    }

    const newContact: RescueContact = {
      id: `${Date.now()}`,
      name: trimmedName,
      phone: trimmedPhone,
      note: note.trim() || undefined,
    };

    try {
      const updatedContacts = [...contacts, newContact];
      await updateRescueContacts(user.uid, updatedContacts);
      setContacts(updatedContacts);
      setName('');
      setPhone('');
      setNote('');
      Alert.alert('Thành công', 'Đã thêm liên hệ cứu hộ.');
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Không thể lưu liên hệ.');
    }
  };

  const handleSOS = async () => {
    try {
      setStatus('Đang lấy vị trí...');
      const location = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });

      const payload: EmergencyLocation = {
        latitude: location.latitude,
        longitude: location.longitude,
      };

      await sendEmergencyAlert(user.uid, user.email ?? 'unknown@example.com', payload);
      setStatus('Đã gửi SOS thành công.');
      Alert.alert('SOS', 'Tín hiệu khẩn cấp đã được gửi.');
    } catch (error: any) {
      setStatus('Gửi SOS thất bại.');
      Alert.alert('Lỗi', error.message || 'Không thể gửi SOS.');
    }
  };

  const handleSignOut = async () => {
    await signOutCurrentUser();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.heading}>Xin chào,</Text>
          <Text style={styles.userText}>{user.email ?? 'Người dùng'}</Text>
          <Text style={styles.idText}>UID: {user.uid}</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Trạng thái</Text>
            <Text style={styles.cardText}>{status}</Text>
          </View>

          <TouchableOpacity style={styles.sosButton} onPress={handleSOS}>
            <Text style={styles.sosText}>Gửi SOS</Text>
          </TouchableOpacity>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Danh bạ cứu hộ</Text>
            {contacts.length === 0 ? (
              <Text style={styles.emptyText}>Chưa có liên hệ cứu hộ nào.</Text>
            ) : (
              contacts.map(contact => (
                <View key={contact.id} style={styles.contactItem}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactPhone}>{contact.phone}</Text>
                  {contact.note ? <Text style={styles.contactNote}>{contact.note}</Text> : null}
                </View>
              ))
            )}

            <TextInput
              style={styles.input}
              placeholder="Tên liên hệ"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Số điện thoại"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="Ghi chú (ví dụ: hàng xóm, bố mẹ)"
              value={note}
              onChangeText={setNote}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddContact}>
              <Text style={styles.addButtonText}>Lưu liên hệ</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Text style={styles.signOutText}>Đăng xuất</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#eef2ff',
  },
  keyboardContainer: {
    flex: 1,
  },
  container: {
    padding: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
  },
  userText: {
    marginTop: 6,
    fontSize: 18,
    color: '#334155',
  },
  idText: {
    marginTop: 8,
    fontSize: 14,
    color: '#64748b',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginTop: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    color: '#475569',
  },
  sosButton: {
    marginTop: 28,
    backgroundColor: '#dc2626',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
  },
  sosText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  section: {
    marginTop: 28,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },
  emptyText: {
    color: '#64748b',
    marginBottom: 12,
  },
  contactItem: {
    marginBottom: 14,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  contactPhone: {
    marginTop: 6,
    color: '#334155',
  },
  contactNote: {
    marginTop: 4,
    color: '#475569',
  },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  addButton: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  signOutButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  signOutText: {
    color: '#334155',
    fontSize: 16,
  },
});

export default HomeScreen;
