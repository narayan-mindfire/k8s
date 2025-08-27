import client, { Gauge } from "prom-client";
import { Queue } from "bullmq";
import redisClient from "./redisClient";

export const register = new client.Registry();

client.collectDefaultMetrics({ register });

const jobQueue = new Queue("job", { connection: redisClient });

const queueLengthGauge = new Gauge({
  name: "queue_length",
  help: "Number of jobs waiting in the queue",
  registers: [register],
  async collect() {
    const count = await jobQueue.count();
    this.set(count);
  },
});

const jobCountsGauge = new Gauge({
  name: "total_jobs_by_state",
  help: "Total number of jobs by state (waiting, completed, failed, etc.)",
  labelNames: ["state"],
  registers: [register],
  async collect() {
    const counts = await jobQueue.getJobCounts(
      "waiting",
      "completed",
      "failed"
    );
    this.set({ state: "waiting" }, counts.waiting);
    this.set({ state: "completed" }, counts.completed);
    this.set({ state: "failed" }, counts.failed);
  },
});

export const getMetrics = async () => {
  return await register.metrics();
};

export const getContentType = () => {
  return register.contentType;
};
