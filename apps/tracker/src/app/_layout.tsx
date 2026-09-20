import { Tabs } from 'expo-router';
import { useEffect } from 'react';

// IMPORTANT: Import location service at the very top
// This defines the background task BEFORE anything renders
// import '../services/locationService';

export default function RootLayout() {
  useEffect(() => {
    console.log('[RootLayout] App initialized');
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Location Tracker',
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore Background Task',
        }}
      />
    </Tabs>
  );
}