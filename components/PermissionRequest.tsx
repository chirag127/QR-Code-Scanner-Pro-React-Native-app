import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';

type PermissionRequestProps = {
  type: 'camera' | 'contacts';
};

/**
 * Component to display when permission is denied
 * Provides information and a button to open settings
 */
const PermissionRequest = ({ type }: PermissionRequestProps) => {
  // Open app settings
  const openSettings = async () => {
    await Linking.openSettings();
  };

  // Get permission-specific content
  const getContent = () => {
    switch (type) {
      case 'camera':
        return {
          title: 'Camera Access Required',
          description: 'We need access to your camera to scan QR codes. Please grant camera permission in your device settings.',
          icon: '📷'
        };
      case 'contacts':
        return {
          title: 'Contacts Access Required',
          description: 'We need access to your contacts to save contact information from QR codes. Please grant contacts permission in your device settings.',
          icon: '👤'
        };
      default:
        return {
          title: 'Permission Required',
          description: 'Please grant the required permission in your device settings.',
          icon: '⚙️'
        };
    }
  };

  const { title, description, icon } = getContent();

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <TouchableOpacity style={styles.button} onPress={openSettings}>
        <Text style={styles.buttonText}>Open Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 24,
  },
  icon: {
    fontSize: 64,
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PermissionRequest;
