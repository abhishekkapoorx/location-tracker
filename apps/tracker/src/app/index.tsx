// import { View, Text, Button, Alert, StyleSheet, ScrollView } from 'react-native';
// import { useEffect, useState } from 'react';
// import * as Location from 'expo-location';
// import {
//   LOCATION_TASK_NAME,
//   startLocationTracking,
//   stopLocationTracking,
//   checkLocationTracking,
// } from '../services/locationService';

// export default function HomeScreen() {
//   const [isTracking, setIsTracking] = useState(false);
//   const [currentLocation, setCurrentLocation] = useState<any>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

//   // Check tracking status on mount
//   useEffect(() => {
//     checkTrackingStatus();
//   }, []);

//   const checkTrackingStatus = async () => {
//     try {
//       const isRunning = await checkLocationTracking();
//       setIsTracking(isRunning);
//     } catch (err) {
//       console.error('Error checking tracking status:', err);
//     }
//   };

//   const requestPermissions = async () => {
//     try {
//       setError(null);

//       console.log('[App] Requesting foreground permission...');
//       const foreground = await Location.requestForegroundPermissionsAsync();

//       if (foreground.status !== 'granted') {
//         const msg = 'Foreground location permission required';
//         setError(msg);
//         Alert.alert('Permission Denied', msg);
//         return false;
//       }

//       console.log('[App] Foreground permission granted, status:', foreground.status);

//       // Wait before requesting background
//       await new Promise(resolve => setTimeout(resolve, 500));

//       console.log('[App] Requesting background permission...');
//       const background = await Location.requestBackgroundPermissionsAsync();

//       console.log('[App] Background permission status:', background.status);

//       setError(null);
//       return true;
//     } catch (err) {
//       const message = err instanceof Error ? err.message : 'Permission request failed';
//       console.error('[App] Permission error:', err);
//       setError(message);
//       Alert.alert('Error', message);
//       return false;
//     }
//   };

//   const startTracking = async () => {
//     try {
//       console.log('[App] Start tracking clicked');
//       setError(null);

//       const hasPermission = await requestPermissions();
//       if (!hasPermission) {
//         console.log('[App] Permissions not granted');
//         return;
//       }

//       console.log('[App] Calling startLocationTracking...');
//       await startLocationTracking();

//       console.log('[App] Verifying tracking status...');
//       await new Promise(resolve => setTimeout(resolve, 1000));

//       const isRunning = await checkLocationTracking();
//       console.log('[App] Tracking verification result:', isRunning);

//       setIsTracking(true);
//       setError(null);

//       Alert.alert(
//         'Success',
//         'Background location tracking started\n\nLocation will be sent every 5 seconds'
//       );
//     } catch (err) {
//       console.error('[App] Start tracking error:', err);
//       const message = err instanceof Error ? err.message : 'Failed to start tracking';
//       setError(message);
//       setIsTracking(false);

//       Alert.alert(
//         'Error Starting Tracking',
//         `${message}\n\nCheck console logs for details`
//       );
//     }
//   };

//   const stopTracking = async () => {
//     try {
//       console.log('[App] Stop tracking clicked');
//       await stopLocationTracking();
//       setIsTracking(false);
//       setError(null);
//       Alert.alert('Stopped', 'Location tracking stopped');
//     } catch (err) {
//       const message = err instanceof Error ? err.message : 'Failed to stop tracking';
//       setError(message);
//       Alert.alert('Error', message);
//     }
//   };

//   const getCurrentLocation = async () => {
//     try {
//       setError(null);
//       console.log('[App] Getting current location...');

//       const location = await Location.getCurrentPositionAsync({
//         accuracy: Location.Accuracy.High,
//       });

//       console.log('[App] Current location:', location);
//       setCurrentLocation(location);
//       setLastUpdate(new Date());

//       // Send to backend
//       try {
//         const response = await fetch('http://10.0.2.2:3000/api/location', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             latitude: location.coords.latitude,
//             longitude: location.coords.longitude,
//             accuracy: location.coords.accuracy,
//             altitude: location.coords.altitude,
//             speed: location.coords.speed,
//             heading: location.coords.heading,
//             timestamp: location.timestamp,
//           }),
//         });

//         if (response.ok) {
//           console.log('[App] Location sent to backend');
//         }
//       } catch (backendErr) {
//         console.warn('[App] Could not send to backend:', backendErr);
//       }
//     } catch (err) {
//       const message = err instanceof Error ? err.message : 'Failed to get location';
//       setError(message);
//       Alert.alert('Error', message);
//     }
//   };

//   return (
//     <ScrollView style={styles.container}>
//       {/* Status Card */}
//       <View style={styles.card}>
//         <Text style={styles.cardTitle}>Tracking Status</Text>
//         <View style={styles.statusRow}>
//           <Text style={styles.label}>Status:</Text>
//           <View
//             style={[
//               styles.statusBadge,
//               isTracking ? styles.statusActive : styles.statusInactive,
//             ]}
//           >
//             <Text style={styles.statusText}>
//               {isTracking ? '🟢 Active' : '🔴 Inactive'}
//             </Text>
//           </View>
//         </View>
//         {lastUpdate && (
//           <Text style={styles.lastUpdate}>
//             Last update: {lastUpdate.toLocaleTimeString()}
//           </Text>
//         )}
//       </View>

//       {/* Error Display */}
//       {error && (
//         <View style={styles.errorCard}>
//           <Text style={styles.errorText}>⚠️ {error}</Text>
//         </View>
//       )}

//       {/* Current Location Card */}
//       {currentLocation && (
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Current Location</Text>
//           <Text style={styles.locationData}>
//             📍 Latitude: {currentLocation.coords.latitude.toFixed(6)}
//           </Text>
//           <Text style={styles.locationData}>
//             📍 Longitude: {currentLocation.coords.longitude.toFixed(6)}
//           </Text>
//           {currentLocation.coords.accuracy && (
//             <Text style={styles.locationData}>
//               📏 Accuracy: {currentLocation.coords.accuracy.toFixed(2)} m
//             </Text>
//           )}
//           {currentLocation.coords.altitude && (
//             <Text style={styles.locationData}>
//               📈 Altitude: {currentLocation.coords.altitude.toFixed(2)} m
//             </Text>
//           )}
//           {currentLocation.coords.speed && (
//             <Text style={styles.locationData}>
//               🏃 Speed: {(currentLocation.coords.speed * 3.6).toFixed(2)} km/h
//             </Text>
//           )}
//           <Text style={styles.timestamp}>
//             {new Date(currentLocation.timestamp).toLocaleString()}
//           </Text>
//         </View>
//       )}

//       {/* Controls */}
//       <View style={styles.buttonContainer}>
//         <Button
//           title="Start Tracking (5s interval)"
//           onPress={startTracking}
//           disabled={isTracking}
//           color={isTracking ? '#ccc' : '#007AFF'}
//         />
//       </View>

//       <View style={styles.buttonContainer}>
//         <Button
//           title="Stop Tracking"
//           onPress={stopTracking}
//           disabled={!isTracking}
//           color={!isTracking ? '#ccc' : '#FF3B30'}
//         />
//       </View>

//       <View style={styles.buttonContainer}>
//         <Button
//           title="Get Current Location"
//           onPress={getCurrentLocation}
//           color="#34C759"
//         />
//       </View>

//       {/* Debug Info */}
//       <View style={styles.debugCard}>
//         <Text style={styles.debugTitle}>🐛 Debug Info</Text>
//         <Text style={styles.debugText}>
//           Task Name: {LOCATION_TASK_NAME}
//         </Text>
//         <Text style={styles.debugText}>
//           Backend: http://10.0.2.2:3000
//         </Text>
//         <Text style={styles.debugHint}>
//           Check console logs (Ctrl+Shift+K) for detailed tracking info
//         </Text>
//       </View>

//       {/* Info */}
//       <View style={styles.infoCard}>
//         <Text style={styles.infoTitle}>ℹ️ How it works</Text>
//         <Text style={styles.infoText}>
//           1. Click "Start Tracking"{'\n'}
//           2. Grant location permissions{'\n'}
//           3. Location sent to backend every 5 seconds{'\n'}
//           4. Check backend logs to see incoming data{'\n'}
//           5. Check console logs for detailed info
//         </Text>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//     padding: 16,
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   cardTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 12,
//     color: '#333',
//   },
//   statusRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//   },
//   label: {
//     fontSize: 14,
//     color: '#666',
//     fontWeight: '500',
//   },
//   statusBadge: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//   },
//   statusActive: {
//     backgroundColor: '#d4edda',
//   },
//   statusInactive: {
//     backgroundColor: '#f8d7da',
//   },
//   statusText: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#333',
//   },
//   lastUpdate: {
//     fontSize: 12,
//     color: '#999',
//     marginTop: 8,
//     fontStyle: 'italic',
//   },
//   errorCard: {
//     backgroundColor: '#fff3cd',
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 12,
//     borderLeftWidth: 4,
//     borderLeftColor: '#ff9800',
//   },
//   errorText: {
//     fontSize: 14,
//     color: '#856404',
//     fontWeight: '500',
//   },
//   locationData: {
//     fontSize: 13,
//     color: '#555',
//     marginBottom: 6,
//     fontFamily: 'Courier New',
//   },
//   timestamp: {
//     fontSize: 12,
//     color: '#999',
//     marginTop: 8,
//     fontStyle: 'italic',
//   },
//   buttonContainer: {
//     marginBottom: 10,
//     borderRadius: 8,
//     overflow: 'hidden',
//   },
//   debugCard: {
//     backgroundColor: '#e8eaf6',
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 12,
//     borderLeftWidth: 4,
//     borderLeftColor: '#673ab7',
//   },
//   debugTitle: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#512da8',
//     marginBottom: 6,
//   },
//   debugText: {
//     fontSize: 11,
//     color: '#4a148c',
//     marginBottom: 4,
//     fontFamily: 'Courier New',
//   },
//   debugHint: {
//     fontSize: 11,
//     color: '#673ab7',
//     fontStyle: 'italic',
//     marginTop: 6,
//   },
//   infoCard: {
//     backgroundColor: '#e3f2fd',
//     borderRadius: 12,
//     padding: 16,
//     marginTop: 16,
//     marginBottom: 20,
//     borderLeftWidth: 4,
//     borderLeftColor: '#2196f3',
//   },
//   infoTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#1976d2',
//     marginBottom: 8,
//   },
//   infoText: {
//     fontSize: 13,
//     color: '#0d47a1',
//     lineHeight: 20,
//   },
// });


import { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';

import * as Device from 'expo-device';

import * as Location from 'expo-location';
import { Button } from 'expo-router/build/react-navigation';

export default function App() {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    async function getCurrentLocation() {
        console.log('[App] Requesting location permissions...');
        if (Platform.OS === 'android' && !Device.isDevice) {
            setErrorMsg(
                'Oops, this will not work on Snack in an Android Emulator. Try it on your device!'
            );
            return;
        }
        let foregroundPermission = await Location.requestForegroundPermissionsAsync();
        if (foregroundPermission.status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            console.warn('[App] Foreground permission denied');
            return;
        }

        let backgroundPermission = await Location.requestBackgroundPermissionsAsync();
        if (backgroundPermission.status !== 'granted') {
            setErrorMsg('Permission to access background location was denied');
            console.warn('[App] Background permission denied');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);

        console.log('[App] Current location:', location);
    }

    async function getLocationString() {
        console.log('[App] Requesting location...');
        let location = await Location.getCurrentPositionAsync({});
        console.log('[App] Refreshed location:', location);
        return `(${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)})`;
    }

    useEffect(() => {
        getCurrentLocation();
    }, []);

    let text = 'Waiting...';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.paragraph}>{text}</Text>
            <Button onPress={getLocationString}>Refresh Location</Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    paragraph: {
        fontSize: 18,
        textAlign: 'center',
    },
});
