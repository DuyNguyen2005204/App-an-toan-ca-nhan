import * as Location from 'expo-location';

/**
 * Xin quyền truy cập vị trí của người dùng
 */
export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Lỗi khi xin quyền vị trí:', error);
    return false;
  }
};

/**
 * Lấy tọa độ GPS hiện tại của người dùng
 */
export const getCurrentLocation = async (): Promise<Location.LocationObject | null> => {
  try {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      // Báo lỗi bằng tiếng Việt nếu bị từ chối
      throw new Error('Quyền truy cập vị trí bị từ chối. Vui lòng cấp quyền trong cài đặt để sử dụng bản đồ.');
    }

    // Lấy vị trí với độ chính xác cao
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High
    });
    return location;
  } catch (error: any) {
    // Bắt lỗi và thông báo bằng tiếng Việt
    throw new Error(error.message || 'Đã xảy ra lỗi không xác định khi lấy vị trí hiện tại.');
  }
};
