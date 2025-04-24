// Mock the react-native-mmkv module
jest.mock('react-native-mmkv', () => {
  class MockMMKV {
    set = jest.fn();
    getString = jest.fn();
    delete = jest.fn();
  }
  
  return {
    MMKV: MockMMKV,
  };
});

// Mock the react-native-uuid module
jest.mock('react-native-uuid', () => ({
  v4: jest.fn(() => 'test-uuid'),
}));

// Mock the expo-clipboard module
jest.mock('expo-clipboard', () => ({
  setStringAsync: jest.fn(),
}));

// Mock the expo-haptics module
jest.mock('expo-haptics', () => ({
  notificationAsync: jest.fn(),
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
  },
}));

// Mock the expo-contacts module
jest.mock('expo-contacts', () => ({
  requestPermissionsAsync: jest.fn(),
  addContactAsync: jest.fn(),
  Fields: {
    FirstName: 'firstName',
    PhoneNumbers: 'phoneNumbers',
    Emails: 'emails',
  },
}));

// Mock the react-native-vision-camera module
jest.mock('react-native-vision-camera', () => ({
  Camera: {
    requestCameraPermission: jest.fn(),
  },
  useCameraDevice: jest.fn(),
  useCodeScanner: jest.fn(),
}));

// Mock the react-navigation modules
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(() => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  })),
  useRoute: jest.fn(() => ({
    params: {
      content: 'test-content',
      type: 'TEXT',
    },
  })),
  useFocusEffect: jest.fn(),
}));
