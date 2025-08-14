import 'dotenv/config';
import mongoose from 'mongoose';
import { Worker } from 'bullmq';
import IORedis from 'ioredis';

import { analyzeQueueName } from '../services/queue.js';
import { Media } from '../models/Media.js';
import { analyzeMedia } from '../services/ai/analyze.js';

async function bootstrap() {
  // DB
  if (!process.env.MONGODB_URI) {
    console.error('[Worker] MONGODB_URI missing.');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('[Worker] DB connected');

  // Redis
  const redis = new IORedis({
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT || 6379)
  });

  // Worker
  const worker = new Worker(
    analyzeQueueName,
    async job => {
      const { mediaId } = job.data as { mediaId: string };
      const media = await Media.findById(mediaId);
      if (!media) {
        console.warn('[Worker] Media not found:', mediaId);
        return;
      }

      try {
        media.status = 'analyzing';
        await media.save();

        const result = await analyzeMedia(media.key, media.type); // <-- replace with real AI calls when ready

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

bootstrap().catch(err => {
  console.error('[Worker] Bootstrap error:', err);
  process.exit(1);
});
