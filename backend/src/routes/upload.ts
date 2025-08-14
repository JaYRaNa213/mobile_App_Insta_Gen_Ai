// src/routes/upload.ts
import express from 'express';
import AWS from 'aws-sdk';
const router = express.Router();
const s3 = new AWS.S3({
  region: process.env.AWS_REGION || 'us-east-1',
});


router.post('/presign', async (req, res) => {
  const { filename, contentType } = req.body;
  const key = `uploads/${Date.now()}-${filename}`;
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: key,
    ContentType: contentType,
    ACL: 'private',
  };
  const url = await s3.getSignedUrlPromise('putObject', { ...params, Expires: 60 });
  // create media doc with status 'uploaded_pending_analysis'
  // return url and key
  res.json({ uploadUrl: url, key });
});
export default router;
