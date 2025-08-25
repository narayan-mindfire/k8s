import { Redis } from "ioredis";

console.log("host: ", process.env.REDIS_HOST);
const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  maxRetriesPerRequest: null,
});

export default redisClient;
