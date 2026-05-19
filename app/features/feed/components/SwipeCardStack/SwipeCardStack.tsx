"use client";

import { useEffect, useCallback, useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { ProfileCard } from "../ProfileCard/ProfileCard";
import { SUGGESTION_TEXT } from "../ProfileCard/constants";
import { useAppDispatch, useAppSelector } from "../../../../lib/store/hooks";
import { fetchFeed, removeTopUser, sendRequest } from "../../../../lib/store/slices/feedSlice";
import type { User } from "../../../../lib/types";

const SWIPE_THRESHOLD = 120;

function CloseIcon() {
  return (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  );
}

function HeartFilledIcon() {
  return (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function SparkleSmall() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5z" />
    </svg>
  );
}

// Single draggable card
function SwipeCard({
  user,
  onSwipe,
  exitDirection,
}: {
  user: User;
  onSwipe: (dir: "left" | "right") => void;
  exitDirection: "left" | "right";
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-18, 0, 18]);
  const likeOpacity = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1]);
  const nopeOpacity = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0]);

  const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    const swipe = info.offset.x;
    const velocity = info.velocity.x;
    if (swipe > SWIPE_THRESHOLD || velocity > 500) {
      onSwipe("right");
    } else if (swipe < -SWIPE_THRESHOLD || velocity < -500) {
      onSwipe("left");
    }
  };

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{ x, rotate, zIndex: 30 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      exit={{ x: exitDirection === "right" ? 500 : -500, opacity: 0, transition: { duration: 0.3 } }}
    >
      <ProfileCard user={user} />

      {/* LIKE indicator */}
      <motion.div
        className="absolute top-8 right-8 px-5 py-2 rounded-xl border-4 border-green-500 text-green-500 font-extrabold text-2xl uppercase -rotate-12 pointer-events-none"
        style={{ opacity: likeOpacity }}
      >
        LIKE
      </motion.div>

      {/* NOPE indicator */}
      <motion.div
        className="absolute top-8 left-8 px-5 py-2 rounded-xl border-4 border-red-500 text-red-500 font-extrabold text-2xl uppercase rotate-12 pointer-events-none"
        style={{ opacity: nopeOpacity }}
      >
        NOPE
      </motion.div>
    </motion.div>
  );
}

// Loading skeleton
function FeedSkeleton() {
  return (
    <div className="flex flex-col items-center w-full h-full max-w-lg mx-auto">
      <div className="relative w-full flex-1 min-h-0 mt-2 md:mt-4">
        <div className="h-full bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_40px_rgba(168,51,76,0.08)] border border-white/60 overflow-hidden animate-pulse">
          <div className="h-[60%] bg-surface-container-high/40" />
          <div className="p-6 flex flex-col gap-3">
            <div className="h-6 w-40 bg-surface-container-high/40 rounded-full" />
            <div className="h-4 w-56 bg-surface-container-high/30 rounded-full" />
            <div className="flex gap-2">
              <div className="h-7 w-20 bg-surface-container-high/30 rounded-full" />
              <div className="h-7 w-24 bg-surface-container-high/30 rounded-full" />
              <div className="h-7 w-16 bg-surface-container-high/30 rounded-full" />
            </div>
            <div className="h-4 w-full bg-surface-container-high/20 rounded-full" />
            <div className="h-4 w-3/4 bg-surface-container-high/20 rounded-full" />
          </div>
        </div>
      </div>

      <div className="shrink-0 flex items-center justify-center gap-10 py-4">
        <div className="w-[68px] h-[68px] rounded-full bg-white/60 animate-pulse" />
        <div className="w-[68px] h-[68px] rounded-full bg-primary/30 animate-pulse" />
      </div>
    </div>
  );
}

export function SwipeCardStack() {
  const dispatch = useAppDispatch();
  const { users, page, loading, error } = useAppSelector((s) => s.feed);
  const lastSwipeDir = useRef<"left" | "right">("right");

  useEffect(() => {
    dispatch(fetchFeed({ page: 1 }));
  }, [dispatch]);

  const handleAction = useCallback(
    (direction: "left" | "right") => {
      const topUser = users[0];
      if (!topUser) return;
      lastSwipeDir.current = direction;

      // Send interested/ignored request
      const status = direction === "right" ? "interested" : "ignored";
      dispatch(sendRequest({ status, toUserId: topUser.id }));
      dispatch(removeTopUser());

      // Fetch next page when running low on cards (guard against duplicate fetches)
      if (users.length <= 2 && !loading) {
        dispatch(fetchFeed({ page }));
      }
    },
    [dispatch, users, page, loading]
  );

  const onReject = () => {
    if (users.length <= 0) return;
    handleAction("left");
  };

  const onAccept = () => {
    if (users.length <= 0) return;
    handleAction("right");
  };

  // Loading state
  if (loading && users.length === 0) {
    return <FeedSkeleton />;
  }

  // Error state
  if (error && users.length === 0) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center h-full gap-4 text-center px-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <div className="text-5xl">⚠️</div>
        <h2 className="text-2xl font-bold text-error">Failed to load feed</h2>
        <p className="text-on-surface-variant max-w-sm">{error}</p>
        <motion.button
          onClick={() => dispatch(fetchFeed({ page: 1 }))}
          className="mt-2 px-6 py-3 bg-primary text-on-primary font-bold rounded-full cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Try Again
        </motion.button>
      </motion.div>
    );
  }

  // Empty state
  if (users.length <= 0) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center h-full gap-4 text-center px-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <div className="text-6xl">💕</div>
        <h2 className="text-2xl font-bold text-primary">No more profiles!</h2>
        <p className="text-on-surface-variant max-w-sm">
          You&apos;ve seen everyone for now. Check back later for new developers
          to connect with.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full h-full max-w-lg mx-auto">
      {/* Card stack */}
      <div className="relative w-full flex-1 min-h-0 mt-2 md:mt-4">
        {/* Decorative glows */}
        <div className="absolute -top-10 -left-10 w-40 h-40 gradient-romantic rounded-full blur-[80px] opacity-20 pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary rounded-full blur-[80px] opacity-20 pointer-events-none" />

        {/* Background cards (static) */}
        {Array.from({ length: Math.min(2, users.length - 1) })
          .map((_, i) => i + 1)
          .reverse()
          .map((offset) => {
            const user = users[offset];
            if (!user) return null;
            return (
              <motion.div
                key={user.id}
                className="absolute inset-0"
                style={{ zIndex: 30 - offset * 10 }}
                animate={{
                  scale: 1 - offset * 0.05,
                  y: offset * 12,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <ProfileCard user={user} />
              </motion.div>
            );
          })}

        {/* Top draggable card */}
        <AnimatePresence>
          <SwipeCard
            key={users[0].id}
            user={users[0]}
            onSwipe={handleAction}
            exitDirection={lastSwipeDir.current}
          />
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <motion.div
        className="shrink-0 flex items-center justify-center gap-6 sm:gap-10 py-3 sm:py-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
      >
        <motion.button
          aria-label="Pass"
          onClick={onReject}
          className="w-14 h-14 sm:w-[68px] sm:h-[68px] rounded-full bg-white/90 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.06)] flex items-center justify-center border-2 border-outline-variant/30 text-on-surface-variant/50 hover:border-error/50 hover:text-error hover:shadow-[0_8px_28px_rgba(186,26,26,0.15)] transition-colors cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <CloseIcon />
        </motion.button>

        <motion.button
          aria-label="Connect"
          onClick={onAccept}
          className="w-14 h-14 sm:w-[68px] sm:h-[68px] rounded-full gradient-romantic shadow-[0_6px_24px_rgba(168,51,76,0.35)] flex items-center justify-center text-white cursor-pointer relative"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <HeartFilledIcon />
          <div className="absolute -top-1 -right-1 text-primary-fixed-dim animate-pulse">
            <SparkleSmall />
          </div>
        </motion.button>
      </motion.div>

      {/* Suggestion text */}
      <motion.p
        className="shrink-0 text-on-surface-variant/40 font-mono text-xs uppercase tracking-widest pb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {SUGGESTION_TEXT}
      </motion.p>
    </div>
  );
}
