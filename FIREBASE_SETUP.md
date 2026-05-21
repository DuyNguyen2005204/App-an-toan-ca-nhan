# Firebase Setup Guide

## 1. Thêm cấu hình native Firebase

### Android
1. Tạo project Firebase và thêm ứng dụng Android với `applicationId` là `com.emergsos`.
2. Tải file `google-services.json` từ Firebase Console.
3. Đặt file vào `android/app/google-services.json`.
4. Trong `android/build.gradle`, đã có plugin `com.google.gms:google-services`.
5. Trong `android/app/build.gradle`, plugin `com.google.gms.google-services` đã được áp dụng.

### iOS
1. Thêm ứng dụng iOS trong Firebase Console với Bundle ID tương ứng (`com.emergsos` hoặc bundle ID dự án).
2. Tải file `GoogleService-Info.plist`.
3. Thêm file vào `ios/EmergSOS/`.
4. Chạy:
   ```sh
   cd ios
   bundle exec pod install
   ```

## 2. Deploy Firestore rules
1. Mở Firebase Console → Firestore → Rules.
2. Dán nội dung trong `firestore.rules`.
3. Lưu và deploy.

## 3. Chạy app
### Android
```sh
npm run android
```

### iOS
```sh
npm run ios
```

## 4. Kiểm thử
- Đăng ký / đăng nhập tài khoản bằng Email/Password.
- Thêm liên hệ cứu hộ trong màn hình chính.
- Nhấn `Gửi SOS` để lưu alert vào `emergency_alerts`.
- Kiểm tra Firestore:
  - Collection `users` có document với `contacts` và `fcmTokens`.
  - Collection `emergency_alerts` có tài liệu với trường `location`.

## 5. Lưu ý bảo mật
- `firestore.rules` hiện đã hạn chế đọc/ghi chỉ với user đúng `uid`.
- Nếu cần mở rộng, thêm các rules với role hoặc nhóm người dùng.
