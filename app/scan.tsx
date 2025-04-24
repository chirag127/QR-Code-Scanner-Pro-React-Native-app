import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import { useIsFocused } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Utils
import { parseQRCode } from '../utils/qrCodeParser';
import { saveToHistory } from '../utils/storage';

// Components
import PermissionRequest from '../components/PermissionRequest';

// Types
type RootStackParamList = {
  Result: { content: string; type: string };
};

type ScanScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Result'>;

const ScanScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const isFocused = useIsFocused();
  const navigation = useNavigation<ScanScreenNavigationProp>();
  const camera = useRef<Camera>(null);
  const device = useCameraDevice('back');

  // Request camera permission
  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermission();
      setHasPermission(cameraPermission === 'granted');
    })();
  }, []);

  // Code scanner setup
  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      if (codes.length > 0 && isScanning && !isProcessing) {
        handleCodeScanned(codes[0].value);
      }
    }
  });

  // Handle scanned QR code
  const handleCodeScanned = async (data: string) => {
    try {
      setIsProcessing(true);
      setIsScanning(false);
      
      // Provide haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Parse QR code content
      const { type, content } = parseQRCode(data);
      
      // Save to history
      await saveToHistory({
        content: data,
        type,
        timestamp: Date.now()
      });
      
      // Navigate to result screen
      navigation.navigate('Result', {
        content: data,
        type
      });
    } catch (error) {
      console.error('Error processing QR code:', error);
      Alert.alert('Error', 'Failed to process QR code. Please try again.');
    } finally {
      // Reset after a delay to prevent multiple scans
      setTimeout(() => {
        setIsProcessing(false);
        setIsScanning(true);
      }, 1000);
    }
  };

  // Show permission request if permission is denied
  if (hasPermission === false) {
    return <PermissionRequest type="camera" />;
  }

  // Show loading indicator while checking permission
  if (hasPermission === null || !device) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.text}>Initializing camera...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isFocused && (
        <Camera
          ref={camera}
          style={styles.camera}
          device={device}
          isActive={isFocused}
          codeScanner={codeScanner}
        />
      )}
      
      {/* Scanning overlay */}
      <View style={styles.overlay}>
        <View style={styles.scanArea} />
        <Text style={styles.instructions}>
          Position a QR code within the frame to scan
        </Text>
      </View>
      
      {/* Processing indicator */}
      {isProcessing && (
        <View style={styles.processingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.processingText}>Processing...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  instructions: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 16,
  },
  processingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginTop: 16,
  },
});

export default ScanScreen;
