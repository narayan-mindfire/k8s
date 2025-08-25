import "./Worker";
import express from "express";
import client from "prom-client";
import { getMetrics, getContentType, testCounter } from "./metrics";

console.log("Service-B Worker is running...");

const app = express();
const metricsPort = 9091;

app.get("/metrics", async (req, res) => {
  testCounter.inc();
  res.set("Content-Type", getContentType());
  res.end(await getMetrics());
});

app.listen(metricsPort, () => {
  console.log(`Metrics server listening on port ${metricsPort}`);
});
