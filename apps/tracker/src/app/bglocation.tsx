import React from 'react';
import { Button, View, StyleSheet, Text } from 'react-native';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';

const LOCATION_TASK_NAME = 'background-location-task-new';

const requestPermissions = async () => {
    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    if (foregroundStatus === 'granted') {
        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus === 'granted') {
            await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
                accuracy: Location.Accuracy.Highest,
                deferredUpdatesInterval: 1000, // 2 seconds

                foregroundService: {
                    notificationTitle: 'Location tracking',
                    notificationBody: 'Your location is being tracked',
                    notificationColor: '#000000',
                    killServiceOnDestroy: false,
                },
            });
        }
    }
};

const PermissionsButton = () => {
    const [currentStatus, setCurrentStatus] = React.useState<string | null>(null);
    const [currentTasksList, setCurrentTasksList] = React.useState<string | null>(null);

    const currentTasks = async () => {
        const tasks = await TaskManager.getRegisteredTasksAsync();
        console.log('[LocationService] Current registered tasks:', tasks);
        setCurrentTasksList(JSON.stringify(tasks));
    }

    React.useEffect(() => {
        const checkPermissions = async () => {
            const { status: foregroundStatus } = await Location.getForegroundPermissionsAsync();
            const { status: backgroundStatus } = await Location.getBackgroundPermissionsAsync();
            const isRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
            console.log(`[LocationService] Background task registered: ${isRegistered}`);
            setCurrentStatus(`Foreground: ${foregroundStatus}, Background: ${backgroundStatus}`);
        }
        checkPermissions();
    }, []);

    return (
        <View style={styles.container}>
            <Text>Status: {currentStatus}</Text>
            <Text>Current tasks: {currentTasksList}</Text>
            <Button onPress={currentTasks} title="Check current tasks" />
            <Button onPress={requestPermissions} title="Enable background location" />
        </View>
    )
};

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }: { data: any; error: any }) => {
    if (error) {
        // Error occurred - check `error.message` for more details.
        console.error('Error in background location task:', error);
        return;
    }
    if (data) {
        const { locations } = data;

        for (const location of locations) {
            console.log('Received new location in background:', location);
            let res = await fetch('http://10.87.139.25:3000/api/location', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(location.coords),
            });

            console.log(`Sent location to server, response status: ${res.status}`);
        }

        console.log('Received new locations in background:', locations);
        // do something with the locations captured in the background
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default PermissionsButton;
