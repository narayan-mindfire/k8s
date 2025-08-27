import { Queue } from "bullmq";
import redisClient from "./redisClient";

const jobQueue = new Queue("job", { connection: redisClient });

export const getJobCounts = async () => {
  const counts = await jobQueue.getJobCounts(
    "waiting",
    "active",
    "completed",
    "failed"
  );
  return counts;
};

export const getQueueLength = async () => {
  const queueLength = await jobQueue.count();
  return queueLength;
};
