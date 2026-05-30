import { NextResponse } from 'next/server';
import { uploadBuffer } from '@/lib/cloudinary';
import { requireAdmin } from '@/lib/auth';

export const runtime = 'nodejs';

// Accepts multipart/form-data with one or more `file` fields.
// Returns { data: { url } } for a single file, or { data: { urls: [...] } }.
export async function POST(req) {
  const { error } = requireAdmin();
  if (error) return error;

  try {
    const form = await req.formData();
    const files = form.getAll('file').filter(Boolean);
    if (!files.length) {
      return NextResponse.json({ message: 'No file provided' }, { status: 400 });
    }

    const urls = [];
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const isVideo = (file.type || '').startsWith('video');
      const result = await uploadBuffer(buffer, { resourceType: isVideo ? 'video' : 'image' });
      urls.push({ url: result.secure_url, mediaType: isVideo ? 'video' : 'image' });
    }

    if (urls.length === 1) {
      return NextResponse.json({ data: { url: urls[0].url, mediaType: urls[0].mediaType } });
    }
    return NextResponse.json({ data: { urls } });
  } catch (e) {
    return NextResponse.json({ message: e.message || 'Upload failed' }, { status: 500 });
  }
}
