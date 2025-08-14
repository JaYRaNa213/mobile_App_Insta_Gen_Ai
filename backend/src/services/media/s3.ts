import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { fromEnv } from '@aws-sdk/credential-providers';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const REGION = process.env.AWS_REGION!;
const BUCKET = process.env.S3_BUCKET_NAME!;
if (!REGION || !BUCKET) {
  console.warn('[S3] AWS_REGION or S3_BUCKET_NAME env missing.');
}

export const s3 = new S3Client({
  region: REGION,
  credentials: fromEnv() // uses AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY
});

export async function getPresignedPutUrl(key: string, contentType: string, expiresSeconds = 60) {
  const cmd = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType
  });
  const uploadUrl = await getSignedUrl(s3, cmd, { expiresIn: expiresSeconds });
  return { uploadUrl, key, bucket: BUCKET };
}

export async function getPresignedGetUrl(key: string, expiresSeconds = 3600) {
  const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  const url = await getSignedUrl(s3, cmd, { expiresIn: expiresSeconds });
  return url;
}
