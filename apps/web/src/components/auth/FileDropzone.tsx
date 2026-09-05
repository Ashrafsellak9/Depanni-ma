"use client";

import { FileText, Upload, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";

import {
  ACCEPTED_FILE_TYPES,
  MAX_FILE_SIZE,
} from "@/components/auth/artisanRegisterConstants";
import { cn } from "@/lib/utils";

type FileDropzoneProps = {
  id: string;
  label: string;
  hint?: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  error?: string;
};

function validateFile(file: File): string | null {
  if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
    return "Format non accepté. Utilisez PDF, JPG ou PNG.";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "Le fichier dépasse 5 Mo.";
  }
  return null;
}

export function FileDropzone({ id, label, hint, file, onFileChange, error }: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleFile = useCallback(
    (next: File | null) => {
      setLocalError("");
      if (!next) {
        onFileChange(null);
        return;
      }
      const validationError = validateFile(next);
      if (validationError) {
        setLocalError(validationError);
        return;
      }
      onFileChange(next);
    },
    [onFileChange],
  );

  const displayError = error || localError;

  return (
    <div className="space-y-2">
      <span id={`${id}-label`} className="block text-sm font-semibold text-navy">
        {label}
      </span>
      {hint && <p className="text-xs text-dep-gray">{hint}</p>}

      {!file ? (
        <div
          role="button"
          tabIndex={0}
          aria-labelledby={`${id}-label`}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const dropped = e.dataTransfer.files[0];
            if (dropped) handleFile(dropped);
          }}
          className={cn(
            "flex min-h-[120px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2",
            dragOver
              ? "border-orange bg-orange/[0.04]"
              : displayError
                ? "border-dep-red bg-dep-red/[0.04]"
                : "border-dep-border bg-white hover:border-orange hover:bg-orange/[0.02]",
          )}
        >
          <Upload className="h-6 w-6 text-dep-gray" aria-hidden />
          <p className="text-sm text-navy">
            Glissez votre fichier ici ou{" "}
            <span className="font-semibold text-orange">cliquez pour parcourir</span>
          </p>
          <p className="text-xs text-dep-gray">PDF, JPG ou PNG, 5 Mo max</p>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-dep-border bg-white px-4 py-3">
          <FileText className="h-5 w-5 shrink-0 text-orange" aria-hidden />
          <span className="min-w-0 flex-1 truncate text-sm text-navy">{file.name}</span>
          <button
            type="button"
            onClick={() => {
              handleFile(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-dep-gray transition-colors duration-200 hover:text-dep-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
            aria-label={`Supprimer ${file.name}`}
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />

      {displayError && (
        <p role="alert" className="text-sm text-dep-red">
          {displayError}
        </p>
      )}
    </div>
  );
}
