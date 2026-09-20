import express from "express";
import { appendFile } from "node:fs/promises";

const app = express();
const PORT = 3000;

app.use(express.json());

app.post("/api/location", async (req, res) => {
  const { latitude, longitude, accuracy, timestamp } = req.body;

  if (
    typeof latitude !== "number" ||
    typeof longitude !== "number"
  ) {
    return res.status(400).json({
      error: "latitude and longitude are required",
    });
  }

  const entry = {
    latitude,
    longitude,
    accuracy: typeof accuracy === "number" ? accuracy : null,
    timestamp:
      typeof timestamp === "number"
        ? timestamp
        : Date.now(),
    receivedAt: new Date().toISOString(),
  };

  try {
    await appendFile(
      "locations.log",
      JSON.stringify(entry) + "\n",
      "utf8"
    );

    console.log("Location received:", entry);

    return res.status(201).json({
      success: true,
    });
  } catch (error) {
    console.error("Failed to write location:", error);

    return res.status(500).json({
      error: "Failed to save location",
    });
  }
});

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Location server running on http://0.0.0.0:${PORT}`);
});