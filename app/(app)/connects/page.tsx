"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ConnectsHeader } from "../../features/connects/components/ConnectsHeader/ConnectsHeader";
import { resolvePhotoUrl } from "../../lib/utils";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import {
  fetchReceived,
  fetchSent,
  reviewRequest,
  removeReceivedRequest,
  cancelRequest,
} from "../../lib/store/slices/connectsSlice";
import type { ConnectRequest, ConnectUser } from "../../lib/store/slices/connectsSlice";

type Tab = "received" | "sent";

function getUser(field: ConnectUser | string): ConnectUser | null {
  if (typeof field === "string") return null;
  return field;
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 260, damping: 22, delay: i * 0.08 },
  }),
  exit: { opacity: 0, scale: 0.9, x: -80, transition: { duration: 0.15, ease: "easeIn" as const } },
};

// ── Icons ──

function PersonIcon() {
  return (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
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

function HeartIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  );
}

// ── Avatar ──

function UserAvatar({ user, size = "md" }: { user: ConnectUser; size?: "md" | "lg" }) {
  const dim = size === "lg" ? "w-24 h-24 sm:w-28 sm:h-28" : "w-16 h-16";
  const rounded = size === "lg" ? "rounded-[2rem]" : "rounded-2xl";

  return (
    <div className={`${dim} ${rounded} overflow-hidden border-2 border-primary-fixed ring-4 ring-primary-container/10 shrink-0`}>
      {user.photoURL ? (
        <Image
          src={resolvePhotoUrl(user.photoURL)}
          alt={`${user.firstName} ${user.lastName}`}
          width={112}
          height={112}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-primary/20 via-secondary/10 to-tertiary/20 flex items-center justify-center text-primary">
          <div className="w-8 h-8">
            <PersonIcon />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Received Card ──

function ReceivedCard({
  request,
  onAccept,
  onReject,
}: {
  request: ConnectRequest;
  onAccept: () => void;
  onReject: () => void;
}) {
  const user = getUser(request.fromUserId);
  if (!user) return null;
  const name = `${user.firstName} ${user.lastName}`;

  return (
    <article className="bg-surface/40 backdrop-blur-[24px] border-[0.5px] border-white/60 rounded-[32px] p-4 sm:p-6 shadow-[0_12px_40px_rgba(255,117,140,0.15)] flex flex-col sm:flex-row gap-6 relative overflow-hidden group hover:-translate-y-1 hover:shadow-[0_16px_50px_rgba(255,117,140,0.25)] transition-all duration-500">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/20 rounded-full blur-[40px] pointer-events-none -z-10 group-hover:bg-primary-container/30 transition-colors" />

      <div className="shrink-0">
        <UserAvatar user={user} size="lg" />
      </div>

      <div className="flex flex-col flex-grow justify-center">
        <h2 className="text-xl sm:text-[28px] leading-[1.2] font-bold text-on-surface truncate">
          {name}{user.age ? `, ${user.age}` : ""}
        </h2>

        {user.jobTitle && (
          <p className="font-mono text-sm tracking-[0.02em] font-medium text-secondary mt-1">
            {user.jobTitle}
          </p>
        )}

        {user.Description && (
          <p className="text-on-surface-variant text-sm mt-2 line-clamp-2">
            {user.Description}
          </p>
        )}

        {user.interests && user.interests.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {user.interests.slice(0, 4).map((interest) => (
              <span
                key={interest}
                className="bg-primary-container/20 border border-primary-container/40 text-on-primary-container px-3 py-1 rounded-full font-mono text-xs font-medium"
              >
                {interest}
              </span>
            ))}
          </div>
        )}

        {(user.city || user.country) && (
          <p className="inline-flex items-center gap-1 text-on-surface-variant/60 font-mono text-xs mt-2">
            <LocationIcon />
            {[user.city, user.country].filter(Boolean).join(", ")}
          </p>
        )}

        <div className="flex items-center gap-4 mt-5 justify-end">
          <button
            aria-label="Reject Request"
            onClick={onReject}
            className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant border border-outline-variant hover:bg-error-container hover:text-error hover:border-error transition-all duration-300 cursor-pointer"
          >
            <CloseIcon />
          </button>
          <button
            aria-label="Accept Request"
            onClick={onAccept}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-[#ff8da1] text-on-primary font-mono text-sm tracking-[0.02em] font-bold shadow-[0_4px_20px_rgba(255,117,140,0.4)] hover:shadow-[0_6px_25px_rgba(255,117,140,0.6)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
          >
            <HeartIcon />
            Connect
          </button>
        </div>
      </div>
    </article>
  );
}

// ── Sent Card ──

function SentCard({ request, onCancel }: { request: ConnectRequest; onCancel: () => void }) {
  const [cancelling, setCancelling] = useState(false);
  const user = getUser(request.toUserId);
  if (!user) return null;
  const name = `${user.firstName} ${user.lastName}`;
  const isInterested = request.status === "interested";

  const handleCancel = () => {
    setCancelling(true);
    onCancel();
  };

  return (
    <article className="bg-surface/40 backdrop-blur-[24px] border-[0.5px] border-white/60 rounded-[32px] p-3 sm:p-5 shadow-[0_8px_30px_rgba(115,54,205,0.08)] flex items-center gap-5 relative overflow-hidden hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(115,54,205,0.15)] transition-all duration-500">
      <UserAvatar user={user} />

      <div className="flex-grow min-w-0">
        <h3 className="text-lg font-bold text-on-surface truncate">
          {name}{user.age ? `, ${user.age}` : ""}
        </h3>
        {user.jobTitle && (
          <p className="font-mono text-xs text-secondary mt-0.5 truncate">{user.jobTitle}</p>
        )}
        {(user.city || user.country) && (
          <p className="inline-flex items-center gap-1 text-on-surface-variant/60 font-mono text-[11px] mt-1">
            <LocationIcon />
            {[user.city, user.country].filter(Boolean).join(", ")}
          </p>
        )}
      </div>

      {isInterested ? (
        <button
          onClick={handleCancel}
          disabled={cancelling}
          className="shrink-0 group/btn flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-container/30 border border-secondary-container/40 text-on-secondary-container font-mono text-xs font-medium cursor-pointer transition-all duration-200 hover:bg-error-container/40 hover:border-error/40 hover:text-error disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-secondary-container/30 disabled:hover:text-on-secondary-container"
        >
          {cancelling ? (
            <span className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-on-secondary-container/30 border-t-on-secondary-container rounded-full animate-spin" />
              Cancelling...
            </span>
          ) : (
            <>
              <span className="group-hover/btn:hidden flex items-center gap-2">
                <SendIcon />
                Sent
              </span>
              <span className="hidden group-hover/btn:flex items-center gap-2">
                <CloseIcon />
                Cancel
              </span>
            </>
          )}
        </button>
      ) : (
        <div className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-container/30 border border-secondary-container/40 text-on-secondary-container font-mono text-xs font-medium capitalize">
          <SendIcon />
          {request.status}
        </div>
      )}
    </article>
  );
}

// ── Skeleton ──

function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-surface/40 rounded-[32px] p-6 flex gap-6 animate-pulse"
        >
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[2rem] bg-surface-container-high/40 shrink-0" />
          <div className="flex-grow flex flex-col gap-3 justify-center">
            <div className="h-7 w-40 bg-surface-container-high/40 rounded-full" />
            <div className="h-4 w-28 bg-surface-container-high/30 rounded-full" />
            <div className="h-4 w-full bg-surface-container-high/20 rounded-full" />
            <div className="flex gap-2 mt-2 justify-end">
              <div className="w-12 h-12 rounded-full bg-surface-container-high/30" />
              <div className="w-32 h-12 rounded-full bg-surface-container-high/30" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Tab Control ──

function TabSkeleton() {
  return (
    <div className="inline-flex items-center p-1.5 bg-surface-container-high/50 backdrop-blur-md rounded-full border border-white/40 shadow-[0_4px_16px_rgba(115,54,205,0.05)] animate-pulse">
      <div className="px-6 py-2.5 rounded-full">
        <div className="h-4 w-24 bg-surface-container-high/40 rounded-full" />
      </div>
      <div className="px-6 py-2.5 rounded-full">
        <div className="h-4 w-16 bg-surface-container-high/30 rounded-full" />
      </div>
    </div>
  );
}

function TabControl({
  activeTab,
  onTabChange,
  receivedCount,
  sentCount,
  loading,
}: {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  receivedCount: number;
  sentCount: number;
  loading: boolean;
}) {
  if (loading) return <TabSkeleton />;

  const tabs: { key: Tab; label: string }[] = [
    { key: "received", label: `Received (${receivedCount})` },
    { key: "sent", label: `Sent (${sentCount})` },
  ];

  return (
    <div className="inline-flex items-center p-1.5 bg-surface-container-high/50 backdrop-blur-md rounded-full border border-white/40 shadow-[0_4px_16px_rgba(115,54,205,0.05)]">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`px-6 py-2.5 rounded-full font-mono text-sm tracking-[0.02em] font-medium transition-all cursor-pointer ${
            activeTab === tab.key
              ? "bg-surface-container-lowest text-primary shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface/30"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ── Empty State ──

function EmptyState({ type }: { type: Tab }) {
  const isReceived = type === "received";
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-20 gap-4 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <div className="text-5xl">{isReceived ? "🎉" : "📬"}</div>
      <h2 className="text-xl font-bold text-primary">
        {isReceived ? "All caught up!" : "No sent requests"}
      </h2>
      <p className="text-on-surface-variant max-w-sm">
        {isReceived
          ? "No pending connection requests. Keep swiping to find your pair programmer!"
          : "You haven't sent any connection requests yet. Head to the feed and start swiping!"}
      </p>
    </motion.div>
  );
}

// ── Error State ──

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-20 gap-4 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="text-5xl">⚠️</div>
      <h2 className="text-xl font-bold text-error">Something went wrong</h2>
      <p className="text-on-surface-variant max-w-sm">{message}</p>
      <motion.button
        onClick={onRetry}
        className="mt-2 px-6 py-3 bg-primary text-on-primary font-bold rounded-full cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Try Again
      </motion.button>
    </motion.div>
  );
}

// ── Page ──

export default function ConnectsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("received");
  const dispatch = useAppDispatch();
  const {
    received,
    sent,
    receivedLoading,
    sentLoading,
    receivedError,
    sentError,
  } = useAppSelector((s) => s.connects);

  useEffect(() => {
    dispatch(fetchReceived());
    dispatch(fetchSent());
  }, [dispatch]);

  const handleAccept = (requestId: string) => {
    dispatch(removeReceivedRequest(requestId));
    dispatch(reviewRequest({ requestId, status: "accepted" }));
  };

  const handleReject = (requestId: string) => {
    dispatch(removeReceivedRequest(requestId));
    dispatch(reviewRequest({ requestId, status: "rejected" }));
  };

  const isLoading = activeTab === "received" ? receivedLoading : sentLoading;
  const error = activeTab === "received" ? receivedError : sentError;
  const data = activeTab === "received" ? received : sent;

  return (
    <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-8">
      <section className="flex flex-col items-center text-center gap-6">
        <ConnectsHeader />
        <TabControl
          activeTab={activeTab}
          onTabChange={setActiveTab}
          receivedCount={received.length}
          sentCount={sent.length}
          loading={receivedLoading && sentLoading}
        />
      </section>

      {isLoading && <CardSkeleton />}

      {error && !isLoading && (
        <ErrorState
          message={error}
          onRetry={() =>
            dispatch(activeTab === "received" ? fetchReceived() : fetchSent())
          }
        />
      )}

      {!isLoading && !error && data.length === 0 && (
        <EmptyState type={activeTab} />
      )}

      {!isLoading && !error && data.length > 0 && (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AnimatePresence>
            {data.map((request, i) =>
              activeTab === "received" ? (
                <motion.div
                  key={request._id}
                  layout
                  custom={i}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  variants={cardVariants}
                >
                  <ReceivedCard
                    request={request}
                    onAccept={() => handleAccept(request._id)}
                    onReject={() => handleReject(request._id)}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key={request._id}
                  layout
                  custom={i}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  variants={cardVariants}
                >
                  <SentCard
                    request={request}
                    onCancel={() => dispatch(cancelRequest(request._id))}
                  />
                </motion.div>
              )
            )}
          </AnimatePresence>
        </section>
      )}

      <div className="w-full h-px bg-gradient-to-r from-transparent via-outline-variant/50 to-transparent" />
    </div>
  );
}
