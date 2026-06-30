"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { Close, Upload01Icon } from "@hugeicons/core-free-icons";

interface ProductImagesProps {
  selectedFiles: File[];
  previewUrls: string[];
  onFilesAdd: (files: File[]) => void;
  onFileRemove: (index: number) => void;
}

export default function ProductImages({
  selectedFiles,
  previewUrls,
  onFilesAdd,
  onFileRemove,
}: ProductImagesProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).slice(
        0,
        10 - selectedFiles.length,
      );
      onFilesAdd(newFiles);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).slice(
        0,
        10 - selectedFiles.length,
      );
      onFilesAdd(newFiles);
    }
  };

  return (
    <div className="grid gap-2">
      <label className="text-xs font-bold text-zinc-500 uppercase">
        Product Images ({previewUrls.length}/10)
      </label>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`grid grid-cols-4 gap-2 border-2 rounded-2xl p-3 transition-all ${
          dragActive
            ? "border-[var(--brand-pink)] bg-pink-50"
            : "border-zinc-200 bg-zinc-50"
        }`}
      >
        {previewUrls.map((url, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-lg overflow-hidden border border-zinc-200"
          >
            <Image
              src={url}
              alt={`Preview ${index + 1}`}
              fill
              className="object-cover"
            />
            <button
              onClick={() => onFileRemove(index)}
              type="button"
              className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
            >
              <HugeiconsIcon icon={Close} size={12} />
            </button>
          </div>
        ))}
        {previewUrls.length < 10 && (
          <button
            onClick={() => fileInputRef.current?.click()}
            type="button"
            className="aspect-square rounded-lg border-2 border-dashed border-zinc-300 flex flex-col items-center justify-center text-zinc-500 hover:border-[var(--brand-pink)] hover:text-[var(--brand-pink)] transition-all"
          >
            <HugeiconsIcon icon={Upload01Icon} size={24} />
            <span className="text-xs mt-1">Upload</span>
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
      <p className="text-xs text-zinc-500">
        Drag and drop images or click to upload. Max 10 images.
      </p>
    </div>
  );
}
