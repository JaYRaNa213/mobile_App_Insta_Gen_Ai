// src/workers/analyze.ts (simplified)
import { Queue, Worker } from 'bullmq';
import axios from 'axios';
const analyzeQueue = new Queue('analyze', { connection: { host: 'redis' } });

new Worker('analyze', async job => {
  const { s3Key, mediaType, mediaUrl, mediaId } = job.data;
  // 1) Call OpenAI Vision or Google Vision
  const visionResp = await callOpenAIVision(mediaUrl);
  // 2) call face/emotion API if needed
  const faceResp = await callFaceApi(mediaUrl);
  // 3) call music-reco API with detected mood
  const music = await recommendMusic({ mood: visionResp.mood });

  // Save results to DB
  await Media.updateOne({ _id: mediaId }, { $set: {
    status: 'done',
    meta: { vision: visionResp, faces: faceResp, musicRecommendation: music }
  }});
});
