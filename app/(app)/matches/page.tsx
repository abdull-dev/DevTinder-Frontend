"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { resolvePhotoUrl } from "../../lib/utils";
import { MATCHES_PAGE } from "../../features/matches/components/MatchCard/constants";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import { fetchMatches } from "../../lib/store/slices/matchesSlice";
import type { MatchUser } from "../../lib/store/slices/matchesSlice";

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 260, damping: 22, delay: i * 0.07 },
  }),
};

const VARIANT_COLORS = ["pink", "blue", "purple", "orange"] as const;

function ChatIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}

const VARIANT_STYLES = {
  pink: {
    btnGradient: "from-primary-container to-pink-300",
    btnShadow: "shadow-[0_8px_20px_rgba(255,117,140,0.3)] hover:shadow-[0_10px_25px_rgba(255,117,140,0.5)]",
  },
  blue: {
    btnGradient: "from-secondary-container to-blue-300",
    btnShadow: "shadow-[0_8px_20px_rgba(115,54,205,0.2)] hover:shadow-[0_10px_25px_rgba(115,54,205,0.4)]",
  },
  purple: {
    btnGradient: "from-primary-container to-pink-300",
    btnShadow: "shadow-[0_8px_20px_rgba(255,117,140,0.3)] hover:shadow-[0_10px_25px_rgba(255,117,140,0.5)]",
  },
  orange: {
    btnGradient: "from-primary-container to-pink-300",
    btnShadow: "shadow-[0_8px_20px_rgba(255,117,140,0.3)] hover:shadow-[0_10px_25px_rgba(255,117,140,0.5)]",
  },
};

function ApiMatchCard({ user, index }: { user: MatchUser; index: number }) {
  const name = `${user.firstName} ${user.lastName}`;
  const displayName = user.age ? `${name}, ${user.age}` : name;
  const variant = VARIANT_COLORS[index % VARIANT_COLORS.length];
  const styles = VARIANT_STYLES[variant];
  const resolvedPhoto = resolvePhotoUrl(user.photoURL);
  const hasImage = !!resolvedPhoto;

  return (
    <article className="relative group rounded-[3rem] bg-white/60 backdrop-blur-xl border border-pink-100 shadow-[0_12px_40px_rgba(168,51,76,0.08)] overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(255,117,140,0.2)]">
      {/* Image */}
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        {hasImage ? (
          <Image
            src={resolvedPhoto}
            alt={`Profile of ${name}`}
            fill
            unoptimized
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-tertiary/20 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-primary/15 flex items-center justify-center text-primary">
              <div className="w-14 h-14">
                <PersonIcon />
              </div>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />

        {/* Premium badge */}
        {user.isPremium && (
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-3 py-1.5 rounded-full shadow-lg border border-amber-300/50">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
            </svg>
            <span className="font-mono text-[10px] font-bold tracking-wider">PREMIUM</span>
          </div>
        )}
      </div>

      {/* Info panel */}
      <div className="p-6 flex flex-col flex-grow z-10 -mt-10 bg-white/90 backdrop-blur-2xl rounded-[2.5rem] mx-3 mb-3 shadow-lg">
        <h2 className="text-[22px] font-bold text-on-surface leading-tight mb-2">
          {displayName}
        </h2>

        {/* Job title or description */}
        {(user.jobTitle || user.Description) && (
          <p className="text-on-surface-variant text-sm line-clamp-1 mb-2">
            {user.jobTitle || user.Description}
          </p>
        )}

        {/* Interests */}
        {user.interests && user.interests.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {user.interests.slice(0, 3).map((interest) => (
              <span
                key={interest}
                className="bg-primary-container/20 border border-primary-container/40 text-on-primary-container px-3 py-1 rounded-full font-mono text-xs font-medium"
              >
                {interest}
              </span>
            ))}
          </div>
        )}

        {/* Location */}
        {(user.city || user.country) && (
          <p className="text-on-surface-variant/60 font-mono text-xs mb-4 line-clamp-1">
            {[user.city, user.country].filter(Boolean).join(", ")}
          </p>
        )}

        {/* CTA buttons */}
        <div className="flex gap-2 mt-auto">
          <Link
            href={`/user/${user._id}`}
            className="flex-1 bg-surface-container-high/50 border border-outline-variant/30 text-on-surface-variant rounded-full py-3.5 flex items-center justify-center font-bold text-sm hover:bg-surface-container-high/70 transition-all duration-300"
          >
            View Profile
          </Link>
          <Link
            href="/chat"
            className={`flex-1 bg-gradient-to-r ${styles.btnGradient} text-white rounded-full py-3.5 flex items-center justify-center gap-2 font-bold ${styles.btnShadow} hover:scale-[1.03] transition-all duration-300`}
          >
            <ChatIcon />
            <span>Chat</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

function MatchesSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-[3rem] bg-white/60 backdrop-blur-xl border border-pink-100 overflow-hidden animate-pulse"
        >
          <div className="aspect-[4/5] bg-surface-container-high/30" />
          <div className="p-6 -mt-10 bg-white/90 rounded-[2.5rem] mx-3 mb-3">
            <div className="h-6 w-32 bg-surface-container-high/40 rounded-full mb-3" />
            <div className="h-4 w-24 bg-surface-container-high/30 rounded-full mb-4" />
            <div className="h-12 w-full bg-surface-container-high/20 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MatchesPage() {
  const dispatch = useAppDispatch();
  const { matches, loading, error } = useAppSelector((s) => s.matches);

  useEffect(() => {
    dispatch(fetchMatches());
  }, [dispatch]);

  return (
    <div className="w-full max-w-[1400px] mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-[28px] md:text-[32px] leading-[1.2] font-bold text-primary mb-2 drop-shadow-[0_2px_10px_rgba(168,51,76,0.2)]">
          {MATCHES_PAGE.HEADING}
        </h1>
        <p className="text-on-surface-variant max-w-md mx-auto">
          {MATCHES_PAGE.DESCRIPTION}
        </p>
      </div>

      {loading && <MatchesSkeleton />}

      {error && !loading && (
        <motion.div
          className="flex flex-col items-center justify-center gap-4 text-center py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-5xl">⚠️</div>
          <h2 className="text-xl font-bold text-error">Failed to load matches</h2>
          <p className="text-on-surface-variant max-w-sm">{error}</p>
          <motion.button
            onClick={() => dispatch(fetchMatches())}
            className="mt-2 px-6 py-3 bg-primary text-on-primary font-bold rounded-full cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try Again
          </motion.button>
        </motion.div>
      )}

      {!loading && !error && matches.length === 0 && (
        <motion.div
          className="flex flex-col items-center justify-center gap-4 text-center py-20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-6xl">💕</div>
          <h2 className="text-2xl font-bold text-primary">No matches yet</h2>
          <p className="text-on-surface-variant max-w-sm">
            Keep swiping on the feed to find your perfect pair programming partner!
          </p>
          <Link
            href="/feed"
            className="mt-2 px-6 py-3 bg-primary text-on-primary font-bold rounded-full"
          >
            Go to Feed
          </Link>
        </motion.div>
      )}

      {!loading && !error && matches.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {matches.map((user, i) => (
            <motion.div
              key={user._id}
              custom={i}
              initial="hidden"
              animate="show"
              variants={cardVariants}
            >
              <ApiMatchCard user={user} index={i} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
