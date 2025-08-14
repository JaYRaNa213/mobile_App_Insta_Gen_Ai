
// =============================
// FILE: mobile/src/services/api.ts
// =============================

import Constants from 'expo-constants';
export const API_BASE_URL =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL || 'http://10.107.105.43:5000';

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }
  // try json, fall back to text
  const contentType = res.headers.get('content-type') || '';
  return contentType.includes('application/json') ? res.json() : res.text();
}

export const api = {
  presign: (body: { filename: string; contentType: string }) =>
    request('/presign', { method: 'POST', body: JSON.stringify(body) }),

  createMedia: (body: { key: string; type: 'image' | 'video' }) =>
    request('/media/create', { method: 'POST', body: JSON.stringify(body) }),

  getMedia: (id: string) => request(`/media/${id}`),
};
