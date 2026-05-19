"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { User } from "../../../../lib/types";
import { getTagStyle } from "./constants";

const MAX_VISIBLE_TAGS = 3;

function PremiumBadge() {
  return (
    <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-3 py-1.5 rounded-full shadow-lg border border-amber-300/50">
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
      </svg>
      <span className="font-mono text-xs font-bold tracking-wider">PREMIUM</span>
    </div>
  );
}

function VerifiedIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82L8.6 22.5 12 21.04l3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z" />
    </svg>
  );
}

function WorkIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
  );
}

function PersonIcon({ className }: { className?: string } = {}) {
  return (
    <svg className={className ?? "w-full h-full"} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  );
}

export function ProfileCard({ user }: { user: User }) {
  const [showAllTags, setShowAllTags] = useState(false);

  const hasImage = !!user.avatarUrl;
  const hasTitle = !!user.title;
  const hasBio = !!user.bio;
  const hasQuote = !!user.quote;
  const hasWork = !!user.work;
  const locationStr = [user.city, user.country].filter(Boolean).join(", ");
  const hasLocation = !!locationStr;
  const hasTechStack = user.techStack.length > 0;
  const hasGender = !!user.gender;
  const hasBadges = user.badges.length > 0;
  const hasDetails = hasBio || hasQuote || hasWork || hasLocation || hasTechStack || hasGender;

  const visibleTags = user.techStack.slice(0, MAX_VISIBLE_TAGS);
  const remainingCount = user.techStack.length - MAX_VISIBLE_TAGS;

  return (
    <>
      <div className="h-full flex flex-col bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_40px_rgba(168,51,76,0.08),0_2px_8px_rgba(0,0,0,0.04)] border border-white/60 overflow-hidden select-none">
        {/* Image section */}
        <div className={`relative ${hasDetails ? "flex-[3]" : "flex-[4]"} min-h-0 w-full`}>
          {hasImage ? (
            <Image
              src={user.avatarUrl}
              alt={user.name}
              fill
              unoptimized
              className="object-cover pointer-events-none"
              sizes="(max-width: 768px) 100vw, 512px"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-tertiary/20 flex items-center justify-center">
              <div className="w-28 h-28 rounded-full bg-primary/15 flex items-center justify-center text-primary">
                <div className="w-16 h-16">
                  <PersonIcon />
                </div>
              </div>
            </div>
          )}

          {user.isPremium && <PremiumBadge />}

          {hasBadges && (
            <div className="absolute top-4 left-4 flex gap-2 z-10">
              {user.badges.map((badge) => (
                <span
                  key={badge.label}
                  className={`px-4 py-1.5 rounded-full backdrop-blur-xl font-mono text-xs font-bold text-white border border-white/30 shadow-sm ${
                    badge.variant === "primary" ? "bg-primary/50" : "bg-black/20"
                  }`}
                >
                  {badge.label}
                </span>
              ))}
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 px-6 pb-5 flex items-end justify-between">
            <div>
              <h2 className="text-[28px] md:text-[32px] leading-none font-extrabold text-white tracking-tight drop-shadow-lg">
                {user.name}{user.age ? `, ${user.age}` : ""}
              </h2>
              {hasTitle && (
                <p className="font-mono text-sm text-primary-fixed-dim mt-1 drop-shadow-md">
                  {user.title}
                </p>
              )}
            </div>
            <Link
              href={`/user/${user.id}`}
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              className="bg-white/15 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20 text-white/90 shadow-lg font-mono text-xs font-bold hover:bg-white/25 transition-colors cursor-pointer z-20"
            >
              View Profile
            </Link>
            {user.isVerified && (
              <div className="bg-white/15 backdrop-blur-xl p-2 rounded-full border border-white/20 text-white/90 shadow-lg">
                <VerifiedIcon />
              </div>
            )}
          </div>
        </div>

        {/* Content section */}
        {hasDetails && (
          <div className="shrink-0 flex flex-col gap-3 px-6 py-5">
            {hasTechStack && (
              <div className="flex flex-wrap gap-2 items-center">
                {visibleTags.map((tag) => (
                  <span
                    key={tag.label}
                    className={`px-4 py-1.5 rounded-full border font-mono text-xs font-medium ${getTagStyle(tag.variant)}`}
                  >
                    {tag.label}
                  </span>
                ))}
                {remainingCount > 0 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowAllTags(true); }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary font-mono text-xs font-bold hover:bg-primary/10 transition-colors cursor-pointer"
                  >
                    +{remainingCount}
                  </button>
                )}
              </div>
            )}

            {hasBio && (
              <p className="text-on-surface-variant text-[15px] leading-relaxed line-clamp-2">
                {user.bio}
              </p>
            )}

            {hasQuote && (
              <p className="text-on-surface-variant/50 font-mono text-xs italic line-clamp-1 -mt-1">
                {user.quote}
              </p>
            )}

            {(hasGender || hasWork || hasLocation) && (
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-on-surface-variant/70">
                {hasGender && (
                  <span className="inline-flex items-center gap-1.5">
                    <PersonIcon className="w-4 h-4 shrink-0" />
                    <span className="font-mono text-xs capitalize">{user.gender}</span>
                  </span>
                )}
                {hasWork && (
                  <span className="inline-flex items-center gap-1.5">
                    <WorkIcon />
                    <span className="font-mono text-xs">{user.work}</span>
                  </span>
                )}
                {hasLocation && (
                  <span className="inline-flex items-center gap-1.5">
                    <LocationIcon />
                    <span className="font-mono text-xs">{locationStr}</span>
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* All Tags Dialog */}
      <AnimatePresence>
        {showAllTags && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            onClick={() => setShowAllTags(false)}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-surface/95 backdrop-blur-xl rounded-2xl border border-outline-variant/30 shadow-[0_20px_60px_rgba(0,0,0,0.3)] w-full max-w-sm p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-on-surface text-lg">
                  {user.name}&apos;s Interests
                </h3>
                <button
                  onClick={() => setShowAllTags(false)}
                  className="w-8 h-8 rounded-full bg-surface-container-high/60 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                >
                  <CloseIcon />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {user.techStack.map((tag) => (
                  <span
                    key={tag.label}
                    className={`px-4 py-2 rounded-full border font-mono text-xs font-medium ${getTagStyle(tag.variant)}`}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
