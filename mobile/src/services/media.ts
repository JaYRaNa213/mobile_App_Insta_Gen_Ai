
// =============================
// FILE: mobile/src/services/media.ts
// =============================
import * as FileSystem from 'expo-file-system';
import { api } from './api';
import { mimeFromUri } from '../utils/mime';

export async function uploadMedia(localUri: string) {
  const filename = localUri.split('/').pop() || `upload_${Date.now()}`;
  const contentType = mimeFromUri(localUri);

  // 1) Ask backend for a presigned PUT URL
  const { uploadUrl, key }: { uploadUrl: string; key: string } = await api.presign({
    filename,
    contentType,
  });

  // 2) Upload the file directly to S3 using PUT
  const putRes = await FileSystem.uploadAsync(uploadUrl, localUri, {
    httpMethod: 'PUT',
    headers: { 'Content-Type': contentType },
    uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
  });

  if (putRes.status !== 200) {
    throw new Error(`S3 upload failed: ${putRes.status}`);
  }

  // 3) Tell backend to create media record and start analysis
  const type = contentType.startsWith('video') ? 'video' : 'image';
  const media = await api.createMedia({ key, type: type as 'image' | 'video' });
  return media; // { _id, status, ... }
}
