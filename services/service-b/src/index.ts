import "./Worker";
import express from "express";
import { getMetrics, getContentType, testCounter } from "./metrics";
import dotenv from "dotenv";

dotenv.config();
console.log("Service-B Worker is running...");

const app = express();
const metricsPort = process.env.METRICS_PORT;

app.get("/metrics", async (req, res) => {
  testCounter.inc();
  res.set("Content-Type", getContentType());
  res.end(await getMetrics());
});

app.listen(metricsPort, () => {
  console.log(`Metrics server listening on port ${metricsPort}`);
});
