import { Queue } from "bullmq";
import redisClient from "./redisClient";

export const queue = new Queue("job", {
  connection: redisClient,
});
