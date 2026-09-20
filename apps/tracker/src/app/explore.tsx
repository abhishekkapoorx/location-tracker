import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

const BACKGROUND_TASK_IDENTIFIER = 'background-task';

// Register and create the task so that it is available also when the background task screen
// (a React component defined later in this example) is not visible.
// Note: This needs to be called in the global scope, not in a React component.
TaskManager.defineTask(BACKGROUND_TASK_IDENTIFIER, async () => {
  console.log('[BackgroundTask] Running background task...');
  try {
    const now = Date.now();

    let res = await fetch("http://10.87.139.25:3000/api/location", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        latitude: 37.7749,
        longitude: -122.4194,
        accuracy: 5,
        altitude: 10,
        speed: 1,
        heading: 90,
        timestamp: now,
      }),
    });
    console.log(`Got background task call at date: ${new Date(now).toISOString()}`);
  } catch (error) {
    console.error('Failed to execute the background task:', error);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
  console.log('[BackgroundTask] Background task completed successfully.');
  return BackgroundTask.BackgroundTaskResult.Success;
});

// 2. Register the task at some point in your app by providing the same name
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
async function registerBackgroundTaskAsync() {
  console.log('[BackgroundTask] Registering background task...');
  return BackgroundTask.registerTaskAsync(BACKGROUND_TASK_IDENTIFIER);
}

// 3. (Optional) Unregister tasks by specifying the task name
// This will cancel any future background task calls that match the given name
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
async function unregisterBackgroundTaskAsync() {
  console.log('[BackgroundTask] Unregistering background task...');
  return BackgroundTask.unregisterTaskAsync(BACKGROUND_TASK_IDENTIFIER);
}

export default function BackgroundTaskScreen() {
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [status, setStatus] = useState<BackgroundTask.BackgroundTaskStatus | null>(null);

  useEffect(() => {
    updateAsync();
  }, []);

  const updateAsync = async () => {
    console.log('[BackgroundTask] Updating background task status...');

    const status = await BackgroundTask.getStatusAsync();
    setStatus(status);
    console.log(`[BackgroundTask] Current status: ${status}`);

    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_TASK_IDENTIFIER);
    setIsRegistered(isRegistered);
    console.log(`[BackgroundTask] Is task registered: ${isRegistered}`);
  };

  const toggle = async () => {
    if (!isRegistered) {
      await registerBackgroundTaskAsync();
    } else {
      await unregisterBackgroundTaskAsync();
    }
    await updateAsync();
  };

  return (
    <View style={styles.screen}>
      <View style={styles.textContainer}>
        <Text>
          Background Task Service Availability:{' '}
          <Text style={styles.boldText}>
            {status ? BackgroundTask.BackgroundTaskStatus[status] : "not available"}
          </Text>
        </Text>
      </View>
      <Button
        disabled={status === BackgroundTask.BackgroundTaskStatus.Restricted}
        title={isRegistered ? 'Cancel background task' : 'Schedule background task'}
        onPress={toggle}
      />
      <Button title="Check background task status" onPress={updateAsync} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    margin: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
});
