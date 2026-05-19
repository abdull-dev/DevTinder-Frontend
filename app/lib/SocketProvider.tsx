"use client";

import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import type { Socket } from "socket.io-client";
import { createSocketConnection } from "./socket";
import { BASE_URL } from "./constants";

interface SocketContextValue {
  socket: Socket | null;
  onlineUsers: Set<string>;
  notifications: NotificationItem[];
  totalUnread: number;
  unmatchedBy: string | null;
  clearNotifications: () => void;
  refetchNotifications: () => void;
  clearUnmatched: () => void;
}

export interface NotificationItem {
  _id: string;
  type: "connection_request" | "unread_message";
  from: { _id: string; firstName: string; lastName: string; photoURL?: string };
  count?: number;
  lastMessage?: string;
  createdAt: string;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  onlineUsers: new Set(),
  notifications: [],
  totalUnread: 0,
  unmatchedBy: null,
  clearNotifications: () => {},
  refetchNotifications: () => {},
  clearUnmatched: () => {},
});

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({
  userId,
  children,
}: {
  userId: string | null;
  children: React.ReactNode;
}) {
  const socketRef = useRef<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [totalUnread, setTotalUnread] = useState(0);
  const [unmatchedBy, setUnmatchedBy] = useState<string | null>(null);

  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchNotifications = useCallback(() => {
    // Debounce — prevent multiple rapid fetches
    if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);
    fetchTimeoutRef.current = setTimeout(() => {
      fetch(`${BASE_URL}/notifications`, { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          setNotifications(data.notifications || []);
          setTotalUnread(data.totalUnread || 0);
        })
        .catch(() => {});
    }, 300);
  }, []);

  useEffect(() => {
    if (!userId) return;

    // Fetch initial notifications via REST
    fetchNotifications();

    // Connect socket
    const socket = createSocketConnection();
    socketRef.current = socket;

    // Register as online
    socket.emit("goOnline", { userId });

    // Online status
    socket.on("onlineUsers", (users: string[]) => {
      setOnlineUsers(new Set(users));
    });
    socket.on("userOnline", (uid: string) => {
      setOnlineUsers((prev) => new Set([...prev, uid]));
    });
    socket.on("userOffline", (uid: string) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.delete(uid);
        return next;
      });
    });

    // Real-time notifications — refetch from API to get accurate count
    socket.on("notification", () => {
      fetchNotifications();
    });

    // Someone unmatched with us
    socket.on("unmatched", ({ userId: unmatchUserId }: { userId: string }) => {
      setUnmatchedBy(unmatchUserId);
      fetchNotifications();
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId, fetchNotifications]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setTotalUnread(0);
  }, []);

  const clearUnmatched = useCallback(() => {
    setUnmatchedBy(null);
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        onlineUsers,
        notifications,
        totalUnread,
        unmatchedBy,
        clearNotifications,
        refetchNotifications: fetchNotifications,
        clearUnmatched,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
