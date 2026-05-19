"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { ChatSidebar } from "../../features/chat/components/ChatSidebar/ChatSidebar";
import { ChatHeader } from "../../features/chat/components/ChatHeader/ChatHeader";
import { ChatMessages } from "../../features/chat/components/ChatMessages/ChatMessages";
import { ChatInput } from "../../features/chat/components/ChatInput/ChatInput";
import type { Message, ChatThread } from "../../lib/types";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import { fetchPremiumStatus } from "../../lib/store/slices/premiumSlice";
import { fetchProfile } from "../../lib/store/slices/profileSlice";
import { fetchMatches } from "../../lib/store/slices/matchesSlice";
import type { MatchUser } from "../../lib/store/slices/matchesSlice";
import { useSocket } from "../../lib/SocketProvider";
import { resolvePhotoUrl } from "../../lib/utils";
import { BASE_URL } from "../../lib/constants";

function PremiumGate() {
  return (
    <div className="flex w-[calc(100%+24px)] sm:w-[calc(100%+48px)] h-full -mx-3 -mt-3 sm:-mx-6 sm:-mt-6 overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-400/30 to-yellow-500/30 flex items-center justify-center">
          <svg className="w-16 h-16 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
          </svg>
        </div>
        <div className="flex flex-col gap-3 max-w-md">
          <h2 className="text-2xl font-bold text-on-surface">Premium Feature</h2>
          <p className="text-on-surface-variant/70 leading-relaxed">
            Chat is exclusively available for premium members. Upgrade to premium
            to start messaging your matches!
          </p>
        </div>
        <Link
          href="/premium"
          className="px-8 py-3.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          Upgrade to Premium
        </Link>
      </div>
    </div>
  );
}

function EmptyChatState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
      <div className="w-32 h-32 rounded-full bg-primary-fixed/30 flex items-center justify-center">
        <svg
          className="w-16 h-16 text-primary"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3z" />
        </svg>
      </div>
      <div className="flex flex-col gap-3 max-w-md">
        <h2 className="text-xl font-bold text-on-surface-variant">
          Select a conversation
        </h2>
        <p className="text-on-surface-variant/70 leading-relaxed">
          Pick a match from the sidebar to start chatting!
        </p>
      </div>
    </div>
  );
}

function NoMatchesState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
      <div className="text-6xl">💕</div>
      <h2 className="text-xl font-bold text-on-surface-variant">No matches yet</h2>
      <p className="text-on-surface-variant/70">
        Get some matches first, then you can chat with them here!
      </p>
      <Link href="/feed" className="px-6 py-3 bg-primary text-on-primary font-bold rounded-full">
        Go to Feed
      </Link>
    </div>
  );
}

function ChatContent() {
  const dispatch = useAppDispatch();
  const { profile, loading: profileLoading } = useAppSelector((s) => s.profile);
  const { matches, loading: matchesLoading } = useAppSelector((s) => s.matches);
  const { socket: globalSocket, onlineUsers, refetchNotifications, unmatchedBy, clearUnmatched } = useSocket();

  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
  const [messagesByMatch, setMessagesByMatch] = useState<Record<string, Message[]>>({});
  const [loadingMessages, setLoadingMessages] = useState(false);

  const currentUserId = profile?.id || "";

  // Fetch profile and matches
  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchMatches());
  }, [dispatch]);

  // Handle unmatch — if the other user unmatched us, clear chat and refetch matches
  useEffect(() => {
    if (!unmatchedBy) return;

    // If we're chatting with the person who unmatched us, close the chat
    if (activeMatchId === unmatchedBy) {
      setActiveMatchId(null);
    }

    // Remove their messages
    setMessagesByMatch((prev) => {
      const next = { ...prev };
      delete next[unmatchedBy];
      return next;
    });

    // Refetch matches to remove them from sidebar
    dispatch(fetchMatches());
    clearUnmatched();
  }, [unmatchedBy, activeMatchId, dispatch, clearUnmatched]);

  // Fetch chat history and mark messages as read
  useEffect(() => {
    if (!activeMatchId) return;
    setLoadingMessages(true);
    fetch(`${BASE_URL}/chat/${activeMatchId}`, { credentials: "include" })
      .then((res) => res.json())
      .then((msgs) => {
        const mapped: Message[] = msgs.map((m: { _id: string; senderId: string; text: string; createdAt: string }) => ({
          id: m._id,
          senderId: m.senderId,
          text: m.text,
          timestamp: new Date(m.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: "read" as const,
        }));
        setMessagesByMatch((prev) => ({ ...prev, [activeMatchId]: mapped }));
      })
      .catch(() => {})
      .finally(() => setLoadingMessages(false));

    // Mark messages from this user as read, then refresh notification count
    fetch(`${BASE_URL}/notifications/messages/read/${activeMatchId}`, {
      method: "POST",
      credentials: "include",
    })
      .then(() => refetchNotifications())
      .catch(() => {});
  }, [activeMatchId, refetchNotifications]);

  // Use global socket for chat — join room and listen for messages
  useEffect(() => {
    if (!profile?.id || !activeMatchId || !globalSocket) return;

    globalSocket.emit("joinChat", {
      userId: profile.id,
      targetUserId: activeMatchId,
    });

    const handleMessage = ({ message, senderId }: { message: string; senderId: string }) => {
      if (senderId !== profile.id) {
        const newMsg: Message = {
          id: `msg-${Date.now()}`,
          senderId,
          text: message,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: "delivered",
        };
        setMessagesByMatch((prev) => ({
          ...prev,
          [activeMatchId]: [...(prev[activeMatchId] || []), newMsg],
        }));
      }
    };

    globalSocket.on("receivedMessage", handleMessage);

    return () => {
      globalSocket.off("receivedMessage", handleMessage);
    };
  }, [profile?.id, activeMatchId, globalSocket]);

  const activeMatch = matches.find((m) => m._id === activeMatchId);
  const activeMessages = activeMatchId ? messagesByMatch[activeMatchId] || [] : [];

  const handleSend = useCallback(
    (text: string) => {
      if (!activeMatchId || !profile?.id || !globalSocket) return;

      const newMsg: Message = {
        id: `msg-${Date.now()}`,
        senderId: profile.id,
        text,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "sent",
      };

      // Add to local state immediately
      setMessagesByMatch((prev) => ({
        ...prev,
        [activeMatchId]: [...(prev[activeMatchId] || []), newMsg],
      }));

      // Send via global socket
      globalSocket.emit("sendMessage", {
        userId: profile.id,
        targetUserId: activeMatchId,
        text,
      });
    },
    [activeMatchId, profile?.id, globalSocket]
  );

  // Build sidebar data from real matches
  const matchAvatars = matches.map((m) => ({
    id: m._id,
    name: m.firstName,
    avatarUrl: resolvePhotoUrl(m.photoURL),
    hasImage: !!m.photoURL,
  }));

  const threads: ChatThread[] = matches.map((m) => ({
    id: m._id,
    user: {
      id: m._id,
      name: `${m.firstName} ${m.lastName}`,
      avatarUrl: resolvePhotoUrl(m.photoURL),
      isOnline: onlineUsers.has(m._id),
    },
    lastMessage: "",
    lastMessageTime: "",
    isTyping: false,
    unreadCount: 0,
  }));

  if (profileLoading || matchesLoading) {
    return (
      <div className="flex w-[calc(100%+24px)] sm:w-[calc(100%+48px)] h-full -mx-3 -mt-3 sm:-mx-6 sm:-mt-6 overflow-hidden items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-on-surface-variant/60 font-mono text-sm">Loading chats...</p>
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="flex w-[calc(100%+24px)] sm:w-[calc(100%+48px)] h-full -mx-3 -mt-3 sm:-mx-6 sm:-mt-6 overflow-hidden">
        <NoMatchesState />
      </div>
    );
  }

  return (
    <div className="flex w-[calc(100%+24px)] sm:w-[calc(100%+48px)] h-full -mx-3 -mt-3 sm:-mx-6 sm:-mt-6 overflow-hidden">
      <ChatSidebar
        matchAvatars={matchAvatars}
        threads={threads}
        activeThreadId={activeMatchId || ""}
        onSelectThread={(id) => setActiveMatchId(id)}
      />

      <div className={`flex-1 flex flex-col min-w-0 ${activeMatchId ? "flex" : "hidden md:flex"}`}>
        {activeMatch ? (
          <>
            <ChatHeader
              name={`${activeMatch.firstName} ${activeMatch.lastName}`}
              role={activeMatch.jobTitle || "Developer"}
              avatarUrl={resolvePhotoUrl(activeMatch.photoURL)}
              isOnline={onlineUsers.has(activeMatch._id)}
              onBack={() => setActiveMatchId(null)}
            />
            {loadingMessages ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
              </div>
            ) : (
              <ChatMessages
                messages={activeMessages}
                currentUserId={currentUserId}
                partnerName={activeMatch.firstName}
                partnerAvatarUrl={resolvePhotoUrl(activeMatch.photoURL)}
                matchedAt="Matched"
                isTyping={false}
              />
            )}
            <ChatInput onSend={handleSend} />
          </>
        ) : (
          <EmptyChatState />
        )}
      </div>
    </div>
  );
}

export default function ChatPage() {
  const dispatch = useAppDispatch();
  const { isPremium, loading: premiumLoading } = useAppSelector((s) => s.premium);

  useEffect(() => {
    dispatch(fetchPremiumStatus());
  }, [dispatch]);

  if (premiumLoading) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!isPremium) {
    return <PremiumGate />;
  }

  return <ChatContent />;
}
