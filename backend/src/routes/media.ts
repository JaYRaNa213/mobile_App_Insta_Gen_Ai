import express from 'express';
import { z } from 'zod';
import { Media } from '../models/Media';
import { analyzeQueue } from '../services/queue';

const router = express.Router();

const CreateMediaBody = z.object({
  key: z.string().min(1),
  type: z.enum(['image', 'video'])
});

router.post('/create', async (req, res, next) => {
  try {
    const { key, type } = CreateMediaBody.parse(req.body);
    const bucket = process.env.S3_BUCKET_NAME!;
    if (!bucket) throw new Error('S3_BUCKET_NAME not configured');

    // Create or upsert media record
    const media = await Media.findOneAndUpdate(
      { key },
      { key, type, bucket, status: 'uploaded_pending_analysis' },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Enqueue analysis job
    await analyzeQueue.add('analyze-media', { mediaId: media._id.toString() });

    res.json(media);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ error: 'Not found' });
    res.json(media);
  } catch (err) {
    next(err);
  }
});

export default router;
