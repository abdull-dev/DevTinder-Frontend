"use client";

import { useRef } from "react";
import Image from "next/image";
import type { ProfileData } from "../../../../lib/types";

function EditIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-4 h-4"} viewBox="0 0 24 24" fill="currentColor">
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

function LocationIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
  );
}

function PremiumBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-4 py-1.5 rounded-full shadow-lg border border-amber-300/50">
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
      </svg>
      <span className="font-mono text-xs font-bold tracking-wider">PREMIUM</span>
    </div>
  );
}

interface ProfileHeroProps {
  profile: ProfileData;
  isEditing: boolean;
  onToggleEdit: () => void;
  onUpdate: (fields: Partial<ProfileData>) => void;
  onAvatarUpload: (file: File) => void;
  uploading?: boolean;
}

export function ProfileHero({ profile, isEditing, onToggleEdit, onUpdate, onAvatarUpload, uploading }: ProfileHeroProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <section className="backdrop-blur-[20px] bg-surface/60 rounded-xl p-6 border border-white/40 shadow-[0_10px_30px_rgba(255,117,140,0.15)] flex flex-col items-center relative overflow-hidden">
      {/* Edit / Save toggle */}
      <button
        onClick={onToggleEdit}
        className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer z-10 ${
          isEditing
            ? "bg-primary text-on-primary shadow-lg"
            : "bg-surface-container-high/60 text-on-surface-variant hover:bg-primary-container/30 hover:text-primary"
        }`}
      >
        {isEditing ? <CheckIcon /> : <EditIcon />}
      </button>

      {/* Avatar */}
      <div className="relative w-36 h-36 mb-5">
        <div className="absolute inset-0 rounded-full gradient-border-glow p-[3px]">
          <div className="w-full h-full rounded-full bg-surface" />
        </div>
        <Image
          src={profile.avatarUrl}
          alt={profile.name}
          width={144}
          height={144}
          className="absolute inset-[3px] w-[calc(100%-6px)] h-[calc(100%-6px)] object-cover rounded-full"
        />
        {uploading && (
          <div className="absolute inset-[3px] rounded-full bg-black/40 flex items-center justify-center">
            <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
        {isEditing && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onAvatarUpload(file);
                e.target.value = "";
              }}
            />
            <button
              aria-label="Edit Profile Picture"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-lg border-2 border-surface hover:scale-105 transition-transform z-10 cursor-pointer"
            >
              <EditIcon className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Name */}
      <div className="w-full text-center space-y-1.5">
        {isEditing ? (
          <input
            className="w-full text-center text-[28px] leading-[1.2] font-bold bg-surface-container-low border border-outline-variant/30 rounded-xl p-2 focus:ring-0 text-on-surface outline-none focus:border-primary/40"
            value={profile.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
          />
        ) : (
          <h1 className="text-[28px] leading-[1.2] font-bold text-on-surface">
            {profile.name}
          </h1>
        )}

        {profile.isPremium && (
          <div className="flex justify-center mt-1">
            <PremiumBadge />
          </div>
        )}

        {/* Age & Gender */}
        <div className="flex items-center justify-center gap-3 text-on-surface-variant text-sm">
          {isEditing ? (
            <>
              <input
                type="number"
                className="w-16 text-center bg-surface-container-low border border-outline-variant/30 rounded-lg px-2 py-1 text-sm focus:ring-0 outline-none focus:border-primary/40"
                value={profile.age}
                onChange={(e) => onUpdate({ age: parseInt(e.target.value) || 0 })}
              />
              <select
                className="bg-surface-container-low border border-outline-variant/30 rounded-lg px-2 py-1 text-sm focus:ring-0 outline-none focus:border-primary/40 cursor-pointer"
                value={profile.gender}
                onChange={(e) => onUpdate({ gender: e.target.value })}
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Other">Other</option>
              </select>
            </>
          ) : (
            <span>{profile.age} years old &middot; {profile.gender}</span>
          )}
        </div>

        {/* Job Title & Workplace */}
        {isEditing ? (
          <div className="flex items-center gap-2 justify-center w-full">
            <input
              className="flex-1 text-center text-on-surface-variant bg-surface-container-low border border-outline-variant/30 rounded-xl p-2 text-sm focus:ring-0 outline-none focus:border-primary/40"
              value={profile.jobTitle}
              onChange={(e) => onUpdate({ jobTitle: e.target.value })}
              placeholder="Job Title"
            />
            <span className="text-on-surface-variant/40 text-sm">@</span>
            <input
              className="flex-1 text-center text-on-surface-variant bg-surface-container-low border border-outline-variant/30 rounded-xl p-2 text-sm focus:ring-0 outline-none focus:border-primary/40"
              value={profile.workplace}
              onChange={(e) => onUpdate({ workplace: e.target.value })}
              placeholder="Company"
            />
          </div>
        ) : (
          <p className="text-on-surface-variant text-sm">
            {profile.jobTitle} @ {profile.workplace}
          </p>
        )}

        {/* Location */}
        <div className="flex items-center justify-center gap-1 text-on-surface-variant text-sm">
          <LocationIcon />
          {isEditing ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <input
                className="w-20 sm:w-28 text-center bg-surface-container-low border border-outline-variant/30 rounded-lg px-1.5 sm:px-2 py-1 text-xs sm:text-sm focus:ring-0 outline-none focus:border-primary/40"
                value={profile.city}
                onChange={(e) => onUpdate({ city: e.target.value })}
                placeholder="City"
              />
              <span className="text-on-surface-variant/40">,</span>
              <input
                className="w-20 sm:w-28 text-center bg-surface-container-low border border-outline-variant/30 rounded-lg px-1.5 sm:px-2 py-1 text-xs sm:text-sm focus:ring-0 outline-none focus:border-primary/40"
                value={profile.country}
                onChange={(e) => onUpdate({ country: e.target.value })}
                placeholder="Country"
              />
            </div>
          ) : (
            <span>{[profile.city, profile.country].filter(Boolean).join(", ") || "Add location"}</span>
          )}
        </div>
      </div>
    </section>
  );
}
