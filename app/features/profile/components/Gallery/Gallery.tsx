"use client";

import { useRef } from "react";
import Image from "next/image";
import type { ProfilePhoto } from "../../../../lib/types";

function CloseIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  );
}

function AddIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
    </svg>
  );
}

function AddPhotoIcon() {
  return (
    <svg className="w-8 h-8 text-on-surface-variant/40 group-hover:text-on-surface-variant/60" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  );
}

interface GalleryProps {
  photos: ProfilePhoto[];
  isEditing: boolean;
  onToggleEdit: () => void;
  onRemove: (photoId: string) => void;
  onUpload: (files: File[]) => void;
  maxPhotos?: number;
}

export function Gallery({ photos, isEditing, onToggleEdit, onRemove, onUpload, maxPhotos = 6 }: GalleryProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emptySlots = maxPhotos - photos.length;

  return (
    <section className="backdrop-blur-[20px] bg-surface/60 rounded-xl p-6 border border-white/40 shadow-[0_10px_30px_rgba(255,117,140,0.05)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-on-surface">Gallery</h2>
        <button
          onClick={onToggleEdit}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            isEditing
              ? "bg-primary text-on-primary shadow-md"
              : "bg-surface-container-high/60 text-on-surface-variant hover:bg-primary-container/30 hover:text-primary"
          }`}
        >
          {isEditing ? <CheckIcon /> : <EditIcon />}
        </button>
      </div>
      <div
        className={`grid gap-3 md:gap-4 ${
          isEditing
            ? "grid-cols-2 sm:grid-cols-3"
            : photos.length === 0
              ? "grid-cols-1"
              : photos.length === 1
                ? "grid-cols-1"
                : photos.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-3"
        }`}
      >
        {photos.map((photo, i) => {
          // First photo spans 2 cols + 2 rows when 3+ photos
          const isHero = i === 0 && photos.length >= 3;
          return (
            <div
              key={photo.id}
              className={`relative rounded-lg overflow-hidden border border-outline-variant/20 shadow-sm ${
                isHero ? "col-span-2 row-span-2 aspect-[3/4]" : "aspect-[3/4]"
              }`}
            >
              <Image src={photo.url} alt={photo.alt} fill className="object-cover" />
              {isEditing && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <button
                    onClick={() => onRemove(photo.id)}
                    className={`bg-surface/80 backdrop-blur-sm text-on-surface rounded-full flex items-center justify-center hover:bg-error-container hover:text-error transition-colors shadow-lg cursor-pointer ${
                      isHero ? "w-10 h-10" : "w-8 h-8"
                    }`}
                  >
                    <CloseIcon />
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Add photo button — only in edit mode and if under limit */}
        {isEditing && emptySlots > 0 && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files || []).slice(0, emptySlots);
                if (files.length > 0) onUpload(files);
                e.target.value = "";
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="relative aspect-[3/4] rounded-lg overflow-hidden border-2 border-dashed border-primary/30 bg-primary/5 flex flex-col items-center justify-center gap-2 hover:bg-primary/10 hover:border-primary/50 transition-colors cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center group-hover:scale-110 transition-transform">
                <AddIcon />
              </div>
              <span className="text-xs text-primary/60 font-medium">Add Photo</span>
            </button>
          </>
        )}
      </div>
    </section>
  );
}
