import express, { type Express, type Request, type Response } from "express";
import dotenv from "dotenv";
dotenv.config();

import { getContentType, getMetrics } from "./metrics";
import { getJobCounts, getQueueLength } from "./queueStats";

const app: Express = express();
const port = process.env.PORT;
const metricsPort = process.env.METRICS_PORT;

app.get("/stats", async (_req: Request, res: Response) => {
  try {
    const [counts, queueLength] = await Promise.all([
      getJobCounts(),
      getQueueLength(),
    ]);
    res.json({
      total_jobs_submitted: counts.waiting,
      total_jobs_completed: counts.completed,
      total_jobs_failed: counts.failed,
      queue_length: queueLength,
      message: "Queue statistics fetched successfully",
    });
  } catch (err) {
    console.error("Error fetching queue stats:", err);
    res.status(500).json({ error: "Failed to fetch queue statistics" });
  }
});

app.get("/metrics", async (_req: Request, res: Response) => {
  res.set("Content-Type", getContentType());
  res.end(await getMetrics());
});

app.listen(port, () => {
  console.log(`Service C stats server running on port ${port}`);
});

app.listen(metricsPort, () => {
  console.log(`Service C metrics server running on port ${metricsPort}`);
});
