const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// 1. Chỉ ép ưu tiên file Web nếu môi trường build nhận diện là Web
config.resolver.sourceExts = ['ts', 'tsx', 'js', 'jsx', 'json', ...config.resolver.sourceExts];

// 2. Hàm chặn thông minh: Chỉ bẻ hướng sang Web-Web nếu biến platform thực sự là 'web'
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && (moduleName === 'react-native' || moduleName.startsWith('react-native/'))) {
    return context.resolveRequest(context, 'react-native-web', platform);
  }
  // Nếu quét trên điện thoại (platform là android/ios), giữ nguyên mặc định không can thiệp
  return context.resolveRequest(context, moduleName, platform);
};

// 3. Sửa lỗi Firebase "Component auth has not been registered yet" trên bản Expo mới
if (!config.resolver.sourceExts.includes('cjs')) {
  config.resolver.sourceExts.push('cjs');
}
config.resolver.unstable_enablePackageExports = false;

module.exports = config;