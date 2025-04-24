import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

type ActionButtonProps = {
  icon: string;
  label: string;
  onPress: () => void;
};

/**
 * Reusable action button component for scan results
 * Displays an icon and label, and handles press events
 */
const ActionButton = ({ icon, label, onPress }: ActionButtonProps) => {
  // Map icon names to emoji icons (temporary solution)
  const getIconEmoji = (iconName: string) => {
    switch (iconName) {
      case 'open': return '🔗';
      case 'copy': return '📋';
      case 'wifi': return '📶';
      case 'contact': return '👤';
      case 'map': return '🗺️';
      case 'sms': return '💬';
      case 'phone': return '📞';
      case 'email': return '✉️';
      case 'search': return '🔍';
      default: return '📱';
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View style={styles.content}>
        <Text style={styles.icon}>{getIconEmoji(icon)}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    marginBottom: 12,
    minWidth: 100,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  content: {
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default ActionButton;
