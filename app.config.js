export default {
  name: 'QR Code Scanner Pro',
  slug: 'qr-code-scanner-pro',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.chirag127.qrcodescannerproreactnativeapp',
    infoPlist: {
      NSCameraUsageDescription: 'We need access to your camera to scan QR codes',
      NSContactsUsageDescription: 'We need access to your contacts to save contact information from QR codes'
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    package: 'com.chirag127.qrcodescannerproreactnativeapp',
    permissions: [
      'CAMERA',
      'READ_CONTACTS',
      'WRITE_CONTACTS'
    ]
  },
  web: {
    favicon: './assets/favicon.png'
  },
  plugins: [
    [
      'react-native-vision-camera',
      {
        cameraPermissionText: 'We need access to your camera to scan QR codes'
      }
    ]
  ],
  extra: {
    eas: {
      projectId: 'qr-code-scanner-pro'
    }
  }
};
