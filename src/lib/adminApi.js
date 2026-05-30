'use client';

// Thin client-side fetch wrapper for the admin panel. Always sends/receives
// JSON, surfaces server error messages, and returns the `data` payload.
export async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  let json = {};
  try { json = await res.json(); } catch { /* empty */ }
  if (!res.ok) throw new Error(json.message || `Request failed (${res.status})`);
  return json.data;
}

export const apiGet = (p) => api(p);
export const apiPost = (p, body) => api(p, { method: 'POST', body });
export const apiPut = (p, body) => api(p, { method: 'PUT', body });
export const apiDelete = (p) => api(p, { method: 'DELETE' });

// Upload one or many files to Cloudinary via /api/uploads.
export async function uploadFiles(files) {
  const list = Array.from(files);
  const fd = new FormData();
  list.forEach((f) => fd.append('file', f));
  const res = await fetch('/api/uploads', { method: 'POST', body: fd });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Upload failed');
  if (json.data.urls) return json.data.urls; // [{url, mediaType}]
  return [{ url: json.data.url, mediaType: json.data.mediaType }];
}
