# Firebase Config Templates

## Mục đích
Các file dưới đây là placeholder mẫu để bạn thay thế bằng cấu hình Firebase thật:
- `android/app/google-services.json`
- `ios/EmergSOS/GoogleService-Info.plist`

## Cách dùng
1. Tạo ứng dụng Android/iOS trên Firebase Console với bundle ID / package name `com.emergsos`.
2. Tải file cấu hình chính xác từ Firebase Console.
3. Thay toàn bộ nội dung placeholder trong hai file trên bằng nội dung file thật.

## Vì sao cần thay thế
- Các giá trị hiện tại như `YOUR_PROJECT_ID`, `YOUR_ANDROID_API_KEY`, `YOUR_IOS_API_KEY` chỉ là ví dụ.
- App sẽ kết nối đúng với Firebase chỉ khi bạn dùng file cấu hình được tạo cho dự án của bạn.

## Ghi chú
- Không chia sẻ `google-services.json` và `GoogleService-Info.plist` công khai nếu chứa thông tin nhạy cảm.
- Sau khi thay thế giá trị thật, chạy lại:
  - `npm run android`
  - hoặc `npm run ios`
