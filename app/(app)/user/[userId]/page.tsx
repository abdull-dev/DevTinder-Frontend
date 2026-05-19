"use client";

import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { BASE_URL } from "../../../lib/constants";
import { resolvePhotoUrl } from "../../../lib/utils";
import { useSocket } from "../../../lib/SocketProvider";

interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  photoURL?: string;
  age?: number;
  gender?: string;
  Description?: string;
  interests?: string[];
  country?: string;
  city?: string;
  jobTitle?: string;
  company?: string;
  languages?: string[];
  gallery?: string[];
  isPremium?: boolean;
  createdAt?: string;
}

function PersonIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-full h-full"} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
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

function WorkIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
    </svg>
  );
}

function ArrowBackIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  );
}

function ImageViewer({
  images,
  startIndex,
  onClose,
}: {
  images: string[];
  startIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const [direction, setDirection] = useState(0);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setIndex((i) => (i > 0 ? i - 1 : images.length - 1));
  }, [images.length]);

  const goNext = useCallback(() => {
    setDirection(1);
    setIndex((i) => (i < images.length - 1 ? i + 1 : 0));
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, goPrev, goNext]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0, scale: 0.9 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0, scale: 0.9 }),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[300] flex flex-col"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-4">
        <div className="w-10" />

        {images.length > 1 && (
          <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full">
            <span className="text-white font-mono text-sm font-medium">
              {index + 1} <span className="text-white/40">of</span> {images.length}
            </span>
          </div>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Image area */}
      <div className="relative flex-1 flex items-center justify-center min-h-0 px-4 sm:px-16">
        {/* Prev button */}
        {images.length > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-2 sm:left-6 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all hover:scale-110 cursor-pointer"
          >
            <ChevronLeftIcon />
          </button>
        )}

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-3xl max-h-[75vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[index]}
              alt={`Photo ${index + 1}`}
              width={1000}
              height={1000}
              unoptimized
              className="object-contain max-h-[75vh] w-auto rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            />
          </motion.div>
        </AnimatePresence>

        {/* Next button */}
        {images.length > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-2 sm:right-6 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all hover:scale-110 cursor-pointer"
          >
            <ChevronRightIcon />
          </button>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="relative z-10 flex items-center justify-center gap-2 px-4 py-4 overflow-x-auto">
          {images.map((url, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 transition-all cursor-pointer ${
                i === index
                  ? "ring-2 ring-primary scale-110 opacity-100"
                  : "opacity-40 hover:opacity-70"
              }`}
            >
              <Image
                src={url}
                alt={`Thumb ${i + 1}`}
                width={64}
                height={64}
                unoptimized
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function CrownIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
    </svg>
  );
}

export default function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>("none");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [showUnmatchConfirm, setShowUnmatchConfirm] = useState(false);
  const [unmatching, setUnmatching] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerStartIndex, setViewerStartIndex] = useState(0);
  const { refetchNotifications } = useSocket();

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`${BASE_URL}/user/${userId}`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("User not found");
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
        setConnectionStatus(data.connectionStatus);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);

  const handleSendRequest = async () => {
    if (!userId || sending) return;
    setSending(true);
    try {
      const res = await fetch(`${BASE_URL}/request/send/interested/${userId}`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        setConnectionStatus("interested");
      }
    } catch {
      // ignore
    }
    setSending(false);
  };

  const handleUnmatch = async () => {
    if (!userId || unmatching) return;
    setUnmatching(true);
    try {
      const res = await fetch(`${BASE_URL}/connection/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setConnectionStatus("none");
        setShowUnmatchConfirm(false);
        refetchNotifications();
      }
    } catch {
      // ignore
    }
    setUnmatching(false);
  };

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto animate-pulse">
        <div className="bg-surface/40 backdrop-blur-xl rounded-[2rem] overflow-hidden">
          <div className="aspect-[4/5] max-h-[400px] bg-surface-container-high/30" />
          <div className="p-6 space-y-4">
            <div className="h-8 w-48 bg-surface-container-high/40 rounded-full" />
            <div className="h-4 w-32 bg-surface-container-high/30 rounded-full" />
            <div className="h-20 w-full bg-surface-container-high/20 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <div className="text-5xl">😕</div>
        <h2 className="text-xl font-bold text-error">User not found</h2>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 bg-primary text-on-primary font-bold rounded-full cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  const name = `${user.firstName} ${user.lastName}`;
  const photo = resolvePhotoUrl(user.photoURL);
  const hasPhoto = !!user.photoURL;
  const gallery = (user.gallery || []).map(resolvePhotoUrl);
  const allImages = [hasPhoto ? photo : null, ...gallery].filter(Boolean) as string[];

  const openViewer = (index: number) => {
    setViewerStartIndex(index);
    setViewerOpen(true);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
      >
        <ArrowBackIcon />
        <span className="font-mono text-sm">Back</span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface/40 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-[0_12px_40px_rgba(168,51,76,0.1)] overflow-hidden"
      >
        {/* Photo */}
        <div
          className={`relative aspect-[4/5] max-h-[450px] w-full ${hasPhoto ? "cursor-pointer" : ""}`}
          onClick={() => hasPhoto && openViewer(0)}
        >
          {hasPhoto ? (
            <Image
              src={photo}
              alt={name}
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-tertiary/20 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-primary/15 flex items-center justify-center text-primary">
                <PersonIcon className="w-20 h-20" />
              </div>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold text-white drop-shadow-lg">
                {name}{user.age ? `, ${user.age}` : ""}
              </h1>
              {user.isPremium && (
                <div className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-3 py-1 rounded-full shadow-lg">
                  <CrownIcon />
                  <span className="font-mono text-[10px] font-bold tracking-wider">PREMIUM</span>
                </div>
              )}
            </div>
            {user.jobTitle && (
              <p className="text-white/80 font-mono text-sm mt-1">
                {user.jobTitle}{user.company ? ` @ ${user.company}` : ""}
              </p>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-6 space-y-5">
          {/* Connection action */}
          <div className="flex gap-3">
            {connectionStatus === "none" && (
              <button
                onClick={handleSendRequest}
                disabled={sending}
                className="flex-1 py-3 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-full shadow-[0_4px_20px_rgba(255,117,140,0.4)] hover:scale-[1.02] transition-all cursor-pointer disabled:opacity-50"
              >
                {sending ? "Sending..." : "Send Interest"}
              </button>
            )}
            {connectionStatus === "interested" && (
              <div className="flex-1 py-3 bg-secondary-container/30 border border-secondary-container/40 text-on-secondary-container font-bold rounded-full text-center font-mono text-sm">
                Request Sent
              </div>
            )}
            {connectionStatus === "accepted" && !showUnmatchConfirm && (
              <div className="flex-1 flex gap-3">
                <div className="flex-1 py-3 bg-green-100 border border-green-300 text-green-700 font-bold rounded-full text-center font-mono text-sm">
                  Matched
                </div>
                <button
                  onClick={() => setShowUnmatchConfirm(true)}
                  className="px-5 py-3 bg-surface-container-high/50 border border-outline-variant/30 text-on-surface-variant font-bold rounded-full text-sm hover:bg-error-container/40 hover:text-error hover:border-error/40 transition-all cursor-pointer"
                >
                  Unmatch
                </button>
              </div>
            )}
            {connectionStatus === "accepted" && showUnmatchConfirm && (
              <div className="flex-1 bg-error/5 border border-error/20 rounded-2xl p-4">
                <p className="text-on-surface font-medium text-sm mb-1">Unmatch {user.firstName}?</p>
                <p className="text-on-surface-variant/70 text-xs mb-3">
                  This will remove the connection. You won&apos;t be able to chat anymore.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowUnmatchConfirm(false)}
                    className="flex-1 py-2.5 rounded-full text-sm font-medium bg-surface-container-high/60 text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUnmatch}
                    disabled={unmatching}
                    className="flex-1 py-2.5 rounded-full text-sm font-medium bg-error text-white hover:bg-error/90 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {unmatching ? "Removing..." : "Yes, Unmatch"}
                  </button>
                </div>
              </div>
            )}
            {connectionStatus === "ignored" && (
              <div className="flex-1 py-3 bg-surface-container-high/50 text-on-surface-variant font-bold rounded-full text-center font-mono text-sm">
                Not Interested
              </div>
            )}
          </div>

          {/* Bio */}
          {user.Description && (
            <div>
              <h3 className="font-bold text-on-surface mb-2">About</h3>
              <p className="text-on-surface-variant leading-relaxed">{user.Description}</p>
            </div>
          )}

          {/* Details */}
          <div className="flex flex-wrap gap-4 text-on-surface-variant text-sm">
            {user.gender && (
              <span className="inline-flex items-center gap-1.5 capitalize">
                <PersonIcon className="w-4 h-4" />
                {user.gender}
              </span>
            )}
            {user.jobTitle && (
              <span className="inline-flex items-center gap-1.5">
                <WorkIcon />
                {user.jobTitle}
              </span>
            )}
            {(user.city || user.country) && (
              <span className="inline-flex items-center gap-1.5">
                <LocationIcon />
                {[user.city, user.country].filter(Boolean).join(", ")}
              </span>
            )}
          </div>

          {/* Interests */}
          {user.interests && user.interests.length > 0 && (
            <div>
              <h3 className="font-bold text-on-surface mb-2">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest) => (
                  <span
                    key={interest}
                    className="bg-primary-container/20 border border-primary-container/40 text-on-primary-container px-4 py-1.5 rounded-full font-mono text-xs font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages / Tech */}
          {user.languages && user.languages.length > 0 && (
            <div>
              <h3 className="font-bold text-on-surface mb-2">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {user.languages.map((lang) => (
                  <span
                    key={lang}
                    className="bg-secondary-container/20 border border-secondary-container/40 text-on-secondary-container px-4 py-1.5 rounded-full font-mono text-xs font-medium"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Gallery */}
          {gallery.length > 0 && (
            <div>
              <h3 className="font-bold text-on-surface mb-2">Photos</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {gallery.map((url, i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => openViewer(hasPhoto ? i + 1 : i)}
                  >
                    <Image
                      src={url}
                      alt={`${name} photo ${i + 1}`}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Member since */}
          {user.createdAt && (
            <p className="text-on-surface-variant/50 font-mono text-xs text-center pt-2">
              Member since {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </p>
          )}
        </div>
      </motion.div>

      {/* Image Viewer — rendered in portal to escape scroll container */}
      {viewerOpen && allImages.length > 0 && createPortal(
        <AnimatePresence>
          <ImageViewer
            images={allImages}
            startIndex={viewerStartIndex}
            onClose={() => setViewerOpen(false)}
          />
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
