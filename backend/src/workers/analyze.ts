// src/workers/analyze.ts
import 'dotenv/config';
import mongoose from 'mongoose';
import { Worker } from 'bullmq';
import IORedis from 'ioredis';

import { analyzeQueueName } from '../services/queue';
import { Media } from '../models/Media';
import { analyzeMedia } from '../services/ai/analyze';

async function bootstrap() {
  // DB
  if (!process.env.MONGODB_URI) {
    console.error('[Worker] MONGODB_URI missing.');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('[Worker] DB connected');

  // Redis (Cloud or local via REDIS_URL)
  if (!process.env.REDIS_URL) {
    console.error('[Worker] REDIS_URL missing.');
    process.exit(1);
  }
  // Required for BullMQ v5 when using remote hosts
  const redis = new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null
  });

  // Worker
  const worker = new Worker(
    analyzeQueueName,
    async (job) => {
      const { mediaId } = job.data as { mediaId: string };
      const media = await Media.findById(mediaId);
      if (!media) {
        console.warn('[Worker] Media not found:', mediaId);
        return;
      }

      try {
        media.status = 'analyzing';
        await media.save();

        const result = await analyzeMedia(media.key, media.type);

        media.meta = result;
        media.status = 'done';
        await media.save();

        console.log(`[Worker] Analysis complete for media ${media._id}`);
      } catch (err) {
        console.error('[Worker] Analysis error:', err);
        media.status = 'failed';
        await media.save();
      }
    },
    { connection: redis }
  );

  worker.on('failed', (job, err) => {
    console.error(`[Worker] Job ${job?.id} failed:`, err);
  });

  console.log(`[Worker] Listening on queue "${analyzeQueueName}"`);
}

bootstrap().catch((err) => {
  console.error('[Worker] Bootstrap error:', err);
  process.exit(1);
});
