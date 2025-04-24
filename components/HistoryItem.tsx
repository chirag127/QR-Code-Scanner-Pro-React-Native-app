import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// Utils
import { ScanHistoryItem } from '../utils/types';
import { getQRCodeTypeIcon } from '../utils/qrCodeParser';
import { formatDate, truncateText } from '../utils/helpers';

type HistoryItemProps = {
  item: ScanHistoryItem;
  onPress: () => void;
  onDelete: () => void;
};

/**
 * Component to display a single history item
 * Shows type icon, content snippet, and date
 */
const HistoryItem = ({ item, onPress, onDelete }: HistoryItemProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{getQRCodeTypeIcon(item.type)}</Text>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.contentText} numberOfLines={2}>
          {truncateText(item.content, 100)}
        </Text>
        <Text style={styles.dateText}>
          {formatDate(item.timestamp)}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={onDelete}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
      >
        <Text style={styles.deleteIcon}>🗑️</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  contentContainer: {
    flex: 1,
  },
  contentText: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#6B7280',
  },
  deleteButton: {
    padding: 8,
  },
  deleteIcon: {
    fontSize: 18,
    color: '#EF4444',
  },
});

export default HistoryItem;
