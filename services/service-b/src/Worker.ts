import { Worker, Job } from "bullmq";
import redisClient from "./redisClient";
import {
  jobsProcessedCounter,
  jobProcessingTimeHistogram,
  jobErrorsCounter,
} from "./metrics";

console.log("worker running!!!!");

const worker = new Worker(
  "job",
  async (job: Job) => {
    const endTimer = jobProcessingTimeHistogram.startTimer();
    console.log(`Processing job ${job.id} with data:`, job.data);

    try {
      if (job.name === "calculatePrimes") {
        const limit = job.data.limit;
        const primes: number[] = [2];

        for (let i = 3; i <= limit; i += 2) {
          if (primes.every((p: number) => i % p !== 0)) {
            primes.push(i);
          }
        }
        console.log(`Calculated ${primes.length} primes up to ${limit}`);

        jobsProcessedCounter.inc({ job_name: job.name });

        endTimer({ job_name: job.name });

        return primes.length;
      }
      return null;
    } catch (err) {
      jobErrorsCounter.inc({ job_name: job.name });
      throw err;
    }
  },
  { connection: redisClient }
);

worker.on("completed", (job, result) => {
  console.log(`Job ${job.id} completed with result: ${result}`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed: ${err}`);
});

export default worker;
