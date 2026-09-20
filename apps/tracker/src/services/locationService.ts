/**
 * Location Service - Defines background location task
 * This MUST be imported at app root level before anything else
 */

import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

export const LOCATION_TASK_NAME = 'background-location-task';

// Define the task BEFORE any component renders
console.log('[LocationService] Defining background task...');

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    try {
        if (error) {
            console.error('[LocationTask] Error received:', error);
            return;
        }

        if (!data) {
            console.warn('[LocationTask] No data received');
            return;
        }

        const { locations } = data as any;

        if (!locations || locations.length === 0) {
            console.warn('[LocationTask] No locations in data');
            return;
        }

        const location = locations[0];
        const lat = location.coords.latitude;
        const lng = location.coords.longitude;
        const accuracy = location.coords.accuracy;

        console.log(
            `[LocationTask] Received: (${lat.toFixed(6)}, ${lng.toFixed(6)}) ` +
            `Accuracy: ${accuracy?.toFixed(2)}m`
        );

        // Send to backend
        try {
            const backendUrl: string = 'http://10.87.139.25:3000/api/location';

            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    latitude: lat,
                    longitude: lng,
                    accuracy: accuracy,
                    altitude: location.coords.altitude,
                    speed: location.coords.speed,
                    heading: location.coords.heading,
                    timestamp: location.timestamp,
                }),
            });

            if (!response.ok) {
                console.warn(`[LocationTask] Backend returned ${response.status}`);
            } else {
                console.log('[LocationTask] Location sent to backend successfully');
            }
        } catch (fetchError) {
            console.warn('[LocationTask] Failed to send to backend:', fetchError);
        }
    } catch (err) {
        console.error('[LocationTask] Unexpected error:', err);
    }
});

console.log('[LocationService] Background task defined');

// Export helper functions
export async function startLocationTracking() {
    try {
        console.log('[LocationService] Starting location updates...');
        console.log('[LocationService] Requesting location permissions...');

        const options: Location.LocationTaskOptions = {
            accuracy: Location.Accuracy.High,
            distanceInterval: 0,
            timeInterval: 5000,
            foregroundService: {
                notificationTitle: 'Location Tracking',
                notificationBody: 'Sending location every 5 seconds',
                notificationColor: '#007AFF',
            },
        };

        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, options);
        console.log('[LocationService] Location updates started successfully');
    } catch (err) {
        console.error('[LocationService] Error starting location updates:', err);
        throw err;
    }
}

export async function stopLocationTracking() {
    try {
        console.log('[LocationService] Stopping location updates...');
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
        console.log('[LocationService] Location updates stopped');
    } catch (err) {
        console.error('[LocationService] Error stopping location updates:', err);
        throw err;
    }
}

export async function checkLocationTracking() {
    try {
        const isRunning = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
        console.log('[LocationService] Tracking status:', isRunning);
        return isRunning;
    } catch (err) {
        console.error('[LocationService] Error checking tracking status:', err);
        return false;
    }
}