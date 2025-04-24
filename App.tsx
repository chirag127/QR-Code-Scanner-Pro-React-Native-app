import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Sentry from '@sentry/react-native';
import { Text } from 'react-native';

// Screens
import ScanScreen from './app/scan';
import HistoryScreen from './app/history';
import ResultScreen from './app/result';

// Initialize Sentry
Sentry.init({
  dsn: "", // Add your Sentry DSN here
  enableAutoSessionTracking: true,
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring
  tracesSampleRate: 1.0,
});

// Define the tab navigator params
type TabParamList = {
  Scan: undefined;
  History: undefined;
};

// Define the stack navigator params
type RootStackParamList = {
  Main: undefined;
  Result: { content: string; type: string };
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

// Tab Navigator
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          tabBarLabel: 'Scan',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="qrcode" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="history" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// TabBarIcon component
const TabBarIcon = ({ name, color, size }: { name: string; color: string; size: number }) => {
  // This is a placeholder. We'll implement proper icons later
  return (
    <Text style={{ color, fontSize: size }}>
      {name === 'qrcode' ? '📷' : '📋'}
    </Text>
  );
};

// Root Stack Navigator
const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Main"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Result"
            component={ResultScreen}
            options={{
              title: 'Scan Result',
              headerStyle: {
                backgroundColor: '#3B82F6',
              },
              headerTintColor: '#FFFFFF',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
};

export default Sentry.wrap(App);
