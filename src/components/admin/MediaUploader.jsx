'use client';

import { useRef, useState } from 'react';
import { UploadCloud, X, Loader2, GripVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadFiles } from '@/lib/adminApi';

// Single image uploader. value = url string, onChange(url).
export function ImageUpload({ value, onChange, accept = 'image/*', label = 'Drag & drop or click to upload' }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const handle = async (files) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      const [m] = await uploadFiles([files[0]]);
      onChange(m.url);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handle(e.dataTransfer.files); }}
        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-line bg-cloud py-8 text-center transition hover:border-brand"
      >
        {busy ? <Loader2 className="animate-spin text-brand" /> : <UploadCloud className="text-brand" />}
        <p className="mt-2 text-sm text-muted">{label}</p>
        <input ref={inputRef} type="file" accept={accept} className="hidden"
          onChange={(e) => { handle(e.target.files); e.target.value = ''; }} />
      </div>
      {value && (
        <div className="relative mt-3 inline-block">
          {value.match(/\.(mp4|webm|mov)/i) ? (
            <video src={value} className="h-24 rounded-lg border border-line" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-24 rounded-lg border border-line object-cover" />
          )}
          <button type="button" onClick={() => onChange('')}
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white">
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

// Multi media uploader. value = array of { url, mediaType, ... }, onChange(arr).
export function MediaListUpload({ value = [], onChange, accept = 'image/*,video/*', label = 'Add images / videos' }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const handle = async (files) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      const uploaded = await uploadFiles(files);
      onChange([...value, ...uploaded.map((u) => ({ url: u.url, mediaType: u.mediaType }))]);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = (i) => onChange(value.filter((_, idx) => idx !== i));
  const move = (i, dir) => {
    const arr = [...value];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    onChange(arr);
  };

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handle(e.dataTransfer.files); }}
        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-line bg-cloud py-6 text-center transition hover:border-brand"
      >
        {busy ? <Loader2 className="animate-spin text-brand" /> : <UploadCloud className="text-brand" />}
        <p className="mt-2 text-sm text-muted">{label}</p>
        <input ref={inputRef} type="file" accept={accept} multiple className="hidden"
          onChange={(e) => { handle(e.target.files); e.target.value = ''; }} />
      </div>
      {value.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {value.map((m, i) => (
            <div key={i} className="relative">
              {m.mediaType === 'video' ? (
                <video src={m.url} className="h-24 w-full rounded-lg border border-line object-cover" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.url} alt="" className="h-24 w-full rounded-lg border border-line object-cover" />
              )}
              <button type="button" onClick={() => remove(i)}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white">
                <X size={13} />
              </button>
              <div className="absolute bottom-1 left-1 flex gap-0.5">
                <button type="button" onClick={() => move(i, -1)} className="rounded bg-ink/70 px-1 text-xs text-white">←</button>
                <button type="button" onClick={() => move(i, 1)} className="rounded bg-ink/70 px-1 text-xs text-white">→</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
