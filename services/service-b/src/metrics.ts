import client, { Counter, Histogram } from "prom-client";

export const register = new client.Registry();

client.collectDefaultMetrics({ register });

// Counter for total jobs processed
export const jobsProcessedCounter = new Counter({
  name: "job_processed_total",
  help: "Total number of jobs processed by this worker",
  labelNames: ["job_name"],
  registers: [register],
});

// Histogram for job processing time
export const jobProcessingTimeHistogram = new Histogram({
  name: "job_processing_time_seconds",
  help: "Histogram of job processing times in seconds",
  labelNames: ["job_name"],
  buckets: [0.1, 0.5, 1, 5, 10, 30, 60],
  registers: [register],
});

// Counter for total job errors
export const jobErrorsCounter = new Counter({
  name: "job_errors_total",
  help: "Total number of jobs that failed",
  labelNames: ["job_name"],
  registers: [register],
});

export const getMetrics = async () => {
  return await register.metrics();
};

export const getContentType = () => {
  return register.contentType;
};

export const testCounter = new client.Counter({
  name: "test_hits_total",
  help: "A test counter for the metrics endpoint",
  registers: [register],
});
