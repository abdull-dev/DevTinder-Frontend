"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { ChatSidebar } from "../../features/chat/components/ChatSidebar/ChatSidebar";
import { ChatHeader } from "../../features/chat/components/ChatHeader/ChatHeader";
import { ChatMessages } from "../../features/chat/components/ChatMessages/ChatMessages";
import { ChatInput } from "../../features/chat/components/ChatInput/ChatInput";
import type { Message, ChatThread } from "../../lib/types";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import { fetchPremiumStatus } from "../../lib/store/slices/premiumSlice";
import { fetchMatches } from "../../lib/store/slices/matchesSlice";
import { fetchProfile } from "../../lib/store/slices/profileSlice";
import {
  fetchChatHistory,
  addMessage,
  setUserOnline,
  setUserOffline,
  setUserTyping,
  clearUserTyping,
} from "../../lib/store/slices/chatSlice";
import type { ChatMessage } from "../../lib/store/slices/chatSlice";
import { connectSocket, disconnectSocket } from "../../lib/socket";
import type { MatchUser } from "../../lib/store/slices/matchesSlice";

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

// Map backend ChatMessage to frontend Message type
function mapToUIMessage(msg: ChatMessage): Message {
  return {
    id: msg._id,
    senderId: msg.senderId,
    text: msg.text,
    timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    status: "delivered",
  };
}

function ChatContent() {
  const dispatch = useAppDispatch();
  const { matches } = useAppSelector((s) => s.matches);
  const { messages, typingUsers, onlineUsers } = useAppSelector((s) => s.chat);
  const { profile } = useAppSelector((s) => s.profile);

  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
  const socketRef = useRef<ReturnType<typeof connectSocket> | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentUserId = profile?.id || "";

  // Connect socket and set up listeners
  useEffect(() => {
    dispatch(fetchMatches());
    dispatch(fetchProfile());

    const socket = connectSocket();
    socketRef.current = socket;

    socket.on("receiveMessage", (msg: ChatMessage) => {
      dispatch(addMessage(msg));
    });

    socket.on("userOnline", (userId: string) => {
      dispatch(setUserOnline(userId));
    });

    socket.on("userOffline", (userId: string) => {
      dispatch(setUserOffline(userId));
    });

    socket.on("userTyping", ({ senderId }: { senderId: string }) => {
      dispatch(setUserTyping(senderId));
    });

    socket.on("userStopTyping", ({ senderId }: { senderId: string }) => {
      dispatch(clearUserTyping(senderId));
    });

    return () => {
      disconnectSocket();
    };
  }, [dispatch]);

  // Load message history when active match changes
  useEffect(() => {
    if (activeMatchId) {
      dispatch(fetchChatHistory(activeMatchId));
    }
  }, [activeMatchId, dispatch]);

  const activeMatch = matches.find((m) => m._id === activeMatchId);

  const handleSend = useCallback(
    (text: string) => {
      if (!activeMatchId || !socketRef.current) return;

      socketRef.current.emit(
        "sendMessage",
        { receiverId: activeMatchId, text },
        (response: { success?: boolean; message?: ChatMessage; error?: string }) => {
          if (response.success && response.message) {
            dispatch(addMessage(response.message));
          }
        }
      );
    },
    [activeMatchId, dispatch]
  );

  const handleTyping = useCallback(() => {
    if (!activeMatchId || !socketRef.current) return;
    socketRef.current.emit("typing", { receiverId: activeMatchId });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit("stopTyping", { receiverId: activeMatchId });
    }, 2000);
  }, [activeMatchId]);

  // Build sidebar data from matches
  const matchAvatars = matches.map((m) => ({
    id: m._id,
    name: m.firstName,
    avatarUrl: m.photoURL || "",
    hasImage: !!m.photoURL,
  }));

  const threads: ChatThread[] = matches.map((m) => ({
    id: m._id,
    user: {
      id: m._id,
      name: `${m.firstName} ${m.lastName}`,
      avatarUrl: m.photoURL || "",
      isOnline: onlineUsers.includes(m._id),
    },
    lastMessage: "",
    lastMessageTime: "",
    isTyping: typingUsers.includes(m._id),
    unreadCount: 0,
  }));

  const uiMessages: Message[] = messages.map(mapToUIMessage);

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
              avatarUrl={activeMatch.photoURL || ""}
              isOnline={onlineUsers.includes(activeMatch._id)}
              onBack={() => setActiveMatchId(null)}
            />
            <ChatMessages
              messages={uiMessages}
              currentUserId={currentUserId}
              partnerName={activeMatch.firstName}
              partnerAvatarUrl={activeMatch.photoURL || ""}
              matchedAt="Matched"
              isTyping={typingUsers.includes(activeMatch._id)}
            />
            <ChatInput onSend={handleSend} onTyping={handleTyping} />
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
