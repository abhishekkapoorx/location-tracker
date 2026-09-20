import * as Location from "expo-location";
import { LOCATION_TASK_NAME } from "./locationTask";

export async function startLocationTracking() {
  const foregroundPermission =
    await Location.requestForegroundPermissionsAsync();

  if (foregroundPermission.status !== "granted") {
    throw new Error("Foreground location permission denied");
  }

  const backgroundPermission =
    await Location.requestBackgroundPermissionsAsync();

  if (backgroundPermission.status !== "granted") {
    throw new Error("Background location permission denied");
  }

  const alreadyRunning =
    await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TASK_NAME
    );

  if (alreadyRunning) {
    return;
  }

  await Location.startLocationUpdatesAsync(
    LOCATION_TASK_NAME,
    {
      accuracy: Location.Accuracy.High,

      // Requested interval: 5 seconds
      timeInterval: 5000,

      // Don't require movement to generate an update
      distanceInterval: 0,

      // Android foreground service
      foregroundService: {
        notificationTitle: "Location tracking",
        notificationBody: "Location tracking is active.",
      },

      pausesUpdatesAutomatically: false,
    }
  );
}