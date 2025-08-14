// =============================
// FILE: mobile/src/utils/mime.ts
// =============================
export function mimeFromUri(uri: string): string {
  const lc = uri.toLowerCase();
  if (lc.endsWith('.jpg') || lc.endsWith('.jpeg')) return 'image/jpeg';
  if (lc.endsWith('.png')) return 'image/png';
  if (lc.endsWith('.heic')) return 'image/heic';
  if (lc.endsWith('.mp4')) return 'video/mp4';
  if (lc.endsWith('.mov')) return 'video/quicktime';
  // Fallbacks for camera-roll URIs without extensions
  if (uri.startsWith('file:')) return 'application/octet-stream';
  return 'application/octet-stream';
}