"use client";

import { useCallback, useEffect, useState } from "react";
import imageCompression from "browser-image-compression";
import { useDropzone } from "react-dropzone";
import { ImagePlus, X } from "lucide-react";

import { cn } from "@/lib/utils";

export interface PhotoFile {
  id: string;
  file: File;
  preview: string;
}

const MAX_PHOTOS = 5;

interface PhotoUploadProps {
  value: PhotoFile[];
  onChange: (photos: PhotoFile[]) => void;
  error?: string;
}

async function compressFile(file: File): Promise<File> {
  try {
    return await imageCompression(file, {
      maxSizeMB: 0.8,
      maxWidthOrHeight: 1600,
      useWebWorker: true,
      fileType: file.type,
    });
  } catch {
    return file;
  }
}

export function PhotoUpload({ value, onChange, error }: PhotoUploadProps) {
  const [processing, setProcessing] = useState(false);

  const onDrop = useCallback(
    async (accepted: File[]) => {
      const remaining = MAX_PHOTOS - value.length;
      if (remaining <= 0) return;
      setProcessing(true);
      try {
        const slice = accepted.slice(0, remaining);
        const compressed = await Promise.all(slice.map(compressFile));
        const next: PhotoFile[] = compressed.map((file) => ({
          id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
          file,
          preview: URL.createObjectURL(file),
        }));
        onChange([...value, ...next]);
      } finally {
        setProcessing(false);
      }
    },
    [value, onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => void onDrop(files),
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    maxFiles: MAX_PHOTOS,
    disabled: value.length >= MAX_PHOTOS || processing,
  });

  const remove = (id: string) => {
    const item = value.find((p) => p.id === id);
    if (item) URL.revokeObjectURL(item.preview);
    onChange(value.filter((p) => p.id !== id));
  };

  useEffect(() => {
    return () => {
      value.forEach((p) => URL.revokeObjectURL(p.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/30",
          value.length >= MAX_PHOTOS && "pointer-events-none opacity-50",
        )}
      >
        <input {...getInputProps()} />
        <ImagePlus className="h-10 w-10 text-muted-foreground" />
        <p className="mt-2 text-sm font-medium text-navy">
          {processing ? "Compression…" : "Glissez vos photos ou cliquez"}
        </p>
        <p className="text-xs text-muted-foreground">
          JPEG, PNG, WebP — max {MAX_PHOTOS} photos
        </p>
      </div>

      {value.length > 0 && (
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {value.map((photo) => (
            <li key={photo.id} className="relative aspect-square overflow-hidden rounded-lg border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.preview} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                className="absolute right-1 top-1 rounded-full bg-navy/80 p-1 text-white hover:bg-navy"
                onClick={() => remove(photo.id)}
              >
                <X className="h-3 w-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
