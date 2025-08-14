import express from 'express';
import { z } from 'zod';
import { getPresignedPutUrl } from '../services/media/s3.js';

const router = express.Router();

const PresignBody = z.object({
  filename: z.string().min(1),
  contentType: z.string().min(1)
});

router.post('/presign', async (req, res, next) => {
  try {
    const { filename, contentType } = PresignBody.parse(req.body);
    const key = `uploads/${Date.now()}-${filename}`;
    const { uploadUrl, key: s3key, bucket } = await getPresignedPutUrl(key, contentType, 60);
    res.json({ uploadUrl, key: s3key, bucket, contentType });
  } catch (err) {
    next(err);
  }
});

export default router;
