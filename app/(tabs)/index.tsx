import { StyleSheet, TouchableOpacity, Text, View, Alert } from 'react-native';

export default function HomeScreen() {
  const handleSOS = () => {
    Alert.alert("KHẨN CẤP", "Vị trí của bạn đang được gửi tới người thân!");
    // Sau này sẽ gọi hàm getCurrentLocation() và lưu vào Firestore ở đây
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.sosButton} onPress={handleSOS}>
        <Text style={styles.buttonText}>SOS</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  sosButton: { width: 200, height: 200, borderRadius: 100, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', elevation: 10 },
  buttonText: { color: 'white', fontSize: 40, fontWeight: 'bold' }
});