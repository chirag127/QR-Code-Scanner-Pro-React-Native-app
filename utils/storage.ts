import { MMKV } from 'react-native-mmkv';
import uuid from 'react-native-uuid';
import { ScanHistoryItem } from './types';

// Initialize MMKV storage
const storage = new MMKV();

// Storage keys
const HISTORY_KEY = 'scan_history';

/**
 * Save a scan to history
 * @param item Scan item to save (without ID)
 * @returns The saved item with generated ID
 */
export const saveToHistory = async (item: Omit<ScanHistoryItem, 'id'>): Promise<ScanHistoryItem> => {
  try {
    // Get existing history
    const history = await getHistory();
    
    // Create new item with ID
    const newItem: ScanHistoryItem = {
      ...item,
      id: uuid.v4() as string
    };
    
    // Add to history (at the beginning)
    const updatedHistory = [newItem, ...history];
    
    // Save to storage
    storage.set(HISTORY_KEY, JSON.stringify(updatedHistory));
    
    return newItem;
  } catch (error) {
    console.error('Error saving to history:', error);
    throw error;
  }
};

/**
 * Get all scan history
 * @returns Array of scan history items
 */
export const getHistory = async (): Promise<ScanHistoryItem[]> => {
  try {
    const historyJson = storage.getString(HISTORY_KEY);
    
    if (!historyJson) {
      return [];
    }
    
    return JSON.parse(historyJson) as ScanHistoryItem[];
  } catch (error) {
    console.error('Error getting history:', error);
    return [];
  }
};

/**
 * Delete a specific history item
 * @param id ID of the item to delete
 */
export const deleteHistoryItem = async (id: string): Promise<void> => {
  try {
    const history = await getHistory();
    const updatedHistory = history.filter(item => item.id !== id);
    storage.set(HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Error deleting history item:', error);
    throw error;
  }
};

/**
 * Clear all scan history
 */
export const clearHistory = async (): Promise<void> => {
  try {
    storage.set(HISTORY_KEY, JSON.stringify([]));
  } catch (error) {
    console.error('Error clearing history:', error);
    throw error;
  }
};
