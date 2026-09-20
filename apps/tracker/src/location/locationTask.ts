import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";

export const LOCATION_TASK_NAME = "background-location-task";

TaskManager.defineTask(
  LOCATION_TASK_NAME,
  async ({ data, error }) => {
    if (error) {
      console.error("Location task error:", error);
      return;
    }

    if (!data) {
      return;
    }

    const { locations } = data as {
      locations: Location.LocationObject[];
    };

    for (const location of locations) {
      const { latitude, longitude, accuracy } = location.coords;

      console.log("Location:", {
        latitude,
        longitude,
        accuracy,
      });

      // Send location to your Node.js server
      try {
        await fetch("http://10.87.139.25:3000/api/location", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            latitude,
            longitude,
            accuracy,
            timestamp: location.timestamp,
          }),
        });

        console.log("Location sent to server");
      } catch (error) {
        console.error(
          "Failed to send location:",
          error
        );
      }
    }
  }
);