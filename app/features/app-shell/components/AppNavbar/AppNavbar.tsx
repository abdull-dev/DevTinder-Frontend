"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { APP_NAVBAR } from "./constants";
import { MOBILE_MENU_ITEMS } from "../BottomNav/constants";
import { SearchIcon, NotificationsIcon, ExploreIcon, ChatIcon, GroupIcon, TerminalIcon, PersonIcon, SettingsIcon, CrownIcon } from "../icons";
import { useTheme } from "../../../../lib/ThemeProvider";
import { useSocket } from "../../../../lib/SocketProvider";
import { BASE_URL } from "../../../../lib/constants";
import { resolvePhotoUrl } from "../../../../lib/utils";

function SunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z" />
    </svg>
  );
}


function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  );
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

interface Notification {
  _id: string;
  type: "connection_request" | "unread_message";
  from: { _id: string; firstName: string; lastName: string; photoURL?: string; jobTitle?: string };
  count?: number;
  lastMessage?: string;
  createdAt: string;
}

interface SearchResult {
  _id: string;
  firstName: string;
  lastName: string;
  photoURL?: string;
  age?: number;
  jobTitle?: string;
  country?: string;
  city?: string;
  isPremium?: boolean;
}

export function AppNavbar() {
  const { theme, toggleTheme } = useTheme();
  const { notifications, totalUnread, refetchNotifications } = useSocket();
  const pathname = usePathname();
  const isOnChatPage = pathname === "/chat";
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [searching, setSearching] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const MENU_ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
    explore: ExploreIcon, chat: ChatIcon, group: GroupIcon,
    terminal: TerminalIcon, person: PersonIcon, settings: SettingsIcon, crown: CrownIcon,
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const doSearch = useCallback((q: string) => {
    if (!q.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }
    setSearching(true);
    fetch(`${BASE_URL}/user/search?q=${encodeURIComponent(q.trim())}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setResults(data.users || []);
        setShowResults(true);
        setSearching(false);
      })
      .catch(() => {
        setSearching(false);
      });
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(value), 300);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setShowResults(false);
  };

  const handleClickResult = () => {
    setShowResults(false);
    setMobileSearchOpen(false);
    setQuery("");
    setResults([]);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);


  const searchDropdown = showResults && (
    <div className="absolute top-full left-0 right-0 mt-2 bg-surface/95 backdrop-blur-xl border border-white/30 rounded-2xl shadow-[0_12px_40px_rgba(168,51,76,0.15)] overflow-hidden z-[100] max-h-[400px] overflow-y-auto">
      {searching && (
        <div className="p-4 text-center text-on-surface-variant text-sm">Searching...</div>
      )}
      {!searching && results.length === 0 && query.trim() && (
        <div className="p-4 text-center text-on-surface-variant text-sm">No users found</div>
      )}
      {results.map((user) => (
        <Link
          key={user._id}
          href={`/user/${user._id}`}
          onClick={handleClickResult}
          className="flex items-center gap-3 p-3 hover:bg-primary-container/10 transition-colors"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-surface-container-high">
            {user.photoURL ? (
              <Image
                src={resolvePhotoUrl(user.photoURL)}
                alt={`${user.firstName} ${user.lastName}`}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                <div className="w-5 h-5"><PersonIcon /></div>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-on-surface truncate">
                {user.firstName} {user.lastName}
              </span>
              {user.age && <span className="text-on-surface-variant text-xs">{user.age}</span>}
              {user.isPremium && (
                <span className="text-amber-500 text-[10px] font-bold">PREMIUM</span>
              )}
            </div>
            <p className="text-on-surface-variant text-xs truncate">
              {[user.jobTitle, [user.city, user.country].filter(Boolean).join(", ")].filter(Boolean).join(" · ")}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );

  return (
    <>
      <header className="flex justify-between items-center px-3 sm:px-6 h-14 sm:h-16 w-full fixed top-0 z-50 bg-surface/30 backdrop-blur-[20px] border-b border-white/20 shadow-[0_4px_20px_rgba(168,51,76,0.15)]">
        {/* Mobile menu + Brand */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen((p) => !p)}
            className="md:hidden p-2 rounded-full hover:bg-primary-container/20 transition-all active:scale-95 cursor-pointer"
          >
            <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
              {mobileMenuOpen
                ? <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                : <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
              }
            </svg>
          </button>
          <Link href="/feed">
            <span className="text-xl sm:text-[28px] leading-[1.2] font-extrabold text-primary drop-shadow-[0_0_8px_rgba(168,51,76,0.4)]">
              {APP_NAVBAR.BRAND_NAME}
            </span>
          </Link>
        </div>

        {/* Search bar - desktop */}
        <div className="hidden md:flex flex-1 max-w-xl px-12 relative" ref={searchRef}>
          <div className="relative w-full group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <SearchIcon className="w-5 h-5 text-primary/60 group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => handleChange(e.target.value)}
              onFocus={() => { if (results.length > 0) setShowResults(true); }}
              placeholder={APP_NAVBAR.SEARCH_PLACEHOLDER}
              className="w-full bg-surface-container-low border-none rounded-full py-2.5 pl-12 pr-10 focus:ring-2 focus:ring-primary/30 font-sans text-on-surface-variant placeholder:text-on-surface-variant/40 transition-all shadow-inner outline-none"
            />
            {query && (
              <button
                onClick={handleClear}
                className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer"
              >
                <CloseIcon className="w-4 h-4 text-on-surface-variant/50 hover:text-on-surface-variant" />
              </button>
            )}
          </div>
          {searchDropdown}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile search toggle */}
          <button
            onClick={() => setMobileSearchOpen(true)}
            className="md:hidden p-2 rounded-full hover:bg-primary-container/20 transition-all duration-300 active:scale-95 cursor-pointer"
          >
            <SearchIcon className="w-6 h-6 text-primary" />
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-primary-container/20 transition-all duration-300 active:scale-95 cursor-pointer"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? (
              <SunIcon className="w-6 h-6 text-primary" />
            ) : (
              <MoonIcon className="w-6 h-6 text-primary" />
            )}
          </button>
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setShowNotifications((prev) => {
                  if (!prev) refetchNotifications();
                  return !prev;
                });
              }}
              className="p-2 rounded-full hover:bg-primary-container/20 transition-all duration-300 active:scale-95 cursor-pointer relative"
            >
              <NotificationsIcon className="w-6 h-6 text-primary" />
              {!isOnChatPage && totalUnread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-error text-on-error text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                  {totalUnread > 99 ? "99+" : totalUnread}
                </span>
              )}
            </button>

            {/* Notification dropdown */}
            {showNotifications && !isOnChatPage && (
              <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-surface/95 backdrop-blur-xl border border-white/30 rounded-2xl shadow-[0_12px_40px_rgba(168,51,76,0.15)] overflow-hidden z-[100] max-h-[450px] overflow-y-auto">
                <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center">
                  <h3 className="font-bold text-on-surface">Notifications</h3>
                  {totalUnread > 0 && (
                    <span className="text-xs text-primary font-mono">{totalUnread} new</span>
                  )}
                </div>

                {notifications.length === 0 && (
                  <div className="p-6 text-center text-on-surface-variant text-sm">
                    No notifications yet
                  </div>
                )}

                {notifications.map((notif) => (
                  <Link
                    key={`${notif.type}-${notif._id}`}
                    href={notif.type === "connection_request" ? "/connects" : "/chat"}
                    onClick={() => {
                      setShowNotifications(false);
                      // Refetch after a short delay to let the page mark items as read
                      setTimeout(refetchNotifications, 1000);
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-primary-container/10 transition-colors border-b border-white/5"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-surface-container-high">
                      {notif.from?.photoURL ? (
                        <Image
                          src={resolvePhotoUrl(notif.from.photoURL)}
                          alt={`${notif.from.firstName} ${notif.from.lastName}`}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                          <div className="w-5 h-5"><PersonIcon /></div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-on-surface">
                        <span className="font-bold">{notif.from?.firstName} {notif.from?.lastName}</span>
                        {notif.type === "connection_request"
                          ? " sent you a connection request"
                          : ` sent ${notif.count} unread message${notif.count && notif.count > 1 ? "s" : ""}`}
                      </p>
                      {notif.type === "unread_message" && notif.lastMessage && (
                        <p className="text-xs text-on-surface-variant truncate">{notif.lastMessage}</p>
                      )}
                      <p className="text-[10px] text-on-surface-variant/50 mt-0.5">
                        {timeAgo(notif.createdAt)}
                      </p>
                    </div>
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      notif.type === "connection_request" ? "bg-primary" : "bg-secondary"
                    }`} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile search overlay */}
      {mobileSearchOpen && (
        <div className="md:hidden fixed inset-0 z-[200] bg-surface/95 backdrop-blur-xl flex flex-col">
          <div className="flex items-center gap-3 px-3 py-3 border-b border-white/20" ref={searchRef}>
            <button
              onClick={() => { setMobileSearchOpen(false); handleClear(); }}
              className="p-2 rounded-full hover:bg-primary-container/20 cursor-pointer shrink-0"
            >
              <CloseIcon className="w-5 h-5 text-on-surface-variant" />
            </button>
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="w-5 h-5 text-primary/60" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="Search users..."
                autoFocus
                className="w-full bg-surface-container-low border-none rounded-full py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary/30 font-sans text-on-surface-variant placeholder:text-on-surface-variant/40 outline-none"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {searching && (
              <div className="p-6 text-center text-on-surface-variant text-sm">Searching...</div>
            )}
            {!searching && results.length === 0 && query.trim() && (
              <div className="p-6 text-center text-on-surface-variant text-sm">No users found</div>
            )}
            {!searching && !query.trim() && (
              <div className="p-6 text-center text-on-surface-variant/50 text-sm">
                Search by name, interests, location, or job title
              </div>
            )}
            {results.map((user) => (
              <Link
                key={user._id}
                href={`/user/${user._id}`}
                onClick={handleClickResult}
                className="flex items-center gap-3 px-4 py-3 hover:bg-primary-container/10 transition-colors border-b border-white/10"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-surface-container-high">
                  {user.photoURL ? (
                    <Image
                      src={resolvePhotoUrl(user.photoURL)}
                      alt={`${user.firstName} ${user.lastName}`}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                      <div className="w-6 h-6"><PersonIcon /></div>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-on-surface truncate">
                      {user.firstName} {user.lastName}
                    </span>
                    {user.age && <span className="text-on-surface-variant text-sm">{user.age}</span>}
                    {user.isPremium && (
                      <span className="text-amber-500 text-xs font-bold">PREMIUM</span>
                    )}
                  </div>
                  <p className="text-on-surface-variant text-sm truncate">
                    {[user.jobTitle, [user.city, user.country].filter(Boolean).join(", ")].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Mobile slide-out menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 z-[150] bg-black/40 backdrop-blur-sm"
              style={{ top: "3.5rem" }}
            />
            {/* Drawer */}
            <motion.nav
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="md:hidden fixed left-0 z-[160] w-64 bg-surface/95 backdrop-blur-xl border-r border-outline-variant/20 shadow-[4px_0_30px_rgba(0,0,0,0.15)] overflow-y-auto"
              style={{ top: "3.5rem", bottom: 0 }}
            >
              <div className="flex flex-col py-4">
                {MOBILE_MENU_ITEMS.map((item) => {
                  const Icon = MENU_ICON_MAP[item.icon];
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      className={`flex items-center gap-3 px-5 py-3.5 transition-colors ${
                        isActive
                          ? "bg-primary-container/30 text-primary border-r-2 border-primary"
                          : "text-on-surface-variant hover:bg-surface-container-high/50 hover:text-on-surface"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-mono text-sm font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
