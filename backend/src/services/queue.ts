import { Queue, Worker, QueueScheduler } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT || 6379)
});

export const analyzeQueueName = 'analyze';

export const analyzeQueue = new Queue(analyzeQueueName, {
  connection
});

export const analyzeQueueScheduler = new QueueScheduler(analyzeQueueName, {
  connection
});

// Worker will be created in src/workers/analyze.ts (separate process)
