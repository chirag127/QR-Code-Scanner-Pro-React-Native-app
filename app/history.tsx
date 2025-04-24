import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

// Components
import SearchBar from '../components/SearchBar';
import HistoryItem from '../components/HistoryItem';

// Utils
import { getHistory, clearHistory, deleteHistoryItem } from '../utils/storage';
import { ScanHistoryItem } from '../utils/types';

// Types
type RootStackParamList = {
  Result: { content: string; type: string };
};

type HistoryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Result'>;

const HistoryScreen = () => {
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<ScanHistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation<HistoryScreenNavigationProp>();

  // Load history when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadHistory();
      return () => {};
    }, [])
  );

  // Load history from storage
  const loadHistory = async () => {
    try {
      setIsLoading(true);
      const historyData = await getHistory();
      setHistory(historyData);
      setFilteredHistory(historyData);
    } catch (error) {
      console.error('Error loading history:', error);
      Alert.alert('Error', 'Failed to load scan history.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredHistory(history);
    } else {
      const filtered = history.filter(item => 
        item.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredHistory(filtered);
    }
  }, [searchQuery, history]);

  // Handle item press
  const handleItemPress = (item: ScanHistoryItem) => {
    navigation.navigate('Result', {
      content: item.content,
      type: item.type
    });
  };

  // Handle item delete
  const handleItemDelete = async (id: string) => {
    try {
      await deleteHistoryItem(id);
      setHistory(prevHistory => prevHistory.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting history item:', error);
      Alert.alert('Error', 'Failed to delete history item.');
    }
  };

  // Handle clear all history
  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all scan history?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: async () => {
            try {
              await clearHistory();
              setHistory([]);
              setFilteredHistory([]);
            } catch (error) {
              console.error('Error clearing history:', error);
              Alert.alert('Error', 'Failed to clear scan history.');
            }
          }
        }
      ]
    );
  };

  // Render empty state
  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.emptyText}>Loading history...</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No scan history yet</Text>
        <Text style={styles.emptySubtext}>
          Scanned QR codes will appear here
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Scan History</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={handleClearHistory}>
            <Text style={styles.clearButton}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      <SearchBar 
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search scan history"
      />

      <FlatList
        data={filteredHistory}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <HistoryItem
            item={item}
            onPress={() => handleItemPress(item)}
            onDelete={() => handleItemDelete(item.id)}
          />
        )}
        contentContainerStyle={filteredHistory.length === 0 ? { flex: 1 } : null}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  clearButton: {
    fontSize: 16,
    color: '#EF4444',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6B7280',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default HistoryScreen;
