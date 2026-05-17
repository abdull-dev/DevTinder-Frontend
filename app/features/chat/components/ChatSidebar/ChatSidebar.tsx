import Image from "next/image";
import type { ChatThread } from "../../../../lib/types";

function PersonIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}

interface MatchAvatar {
  id: string;
  name: string;
  avatarUrl?: string;
  hasImage: boolean;
}

interface ChatSidebarProps {
  matchAvatars: MatchAvatar[];
  threads: ChatThread[];
  activeThreadId: string;
  onSelectThread: (threadId: string) => void;
}

export function ChatSidebar({
  matchAvatars,
  threads,
  activeThreadId,
  onSelectThread,
}: ChatSidebarProps) {
  // On mobile: show full-width when no active thread, hide when a thread is selected
  // On desktop: always show as fixed-width sidebar
  return (
    <div className={`flex flex-col w-full md:w-[350px] h-full bg-surface-container-low/30 backdrop-blur-xl md:border-r border-white/20 shrink-0 ${activeThreadId ? "hidden md:flex" : "flex"}`}>
      {/* Matches row */}
      <div className="px-6 pt-6 mb-6">
        <h2 className="font-bold text-lg mb-4 text-primary">Matches</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {matchAvatars.map((match) => (
            <div
              key={match.id}
              className="flex-shrink-0 flex flex-col items-center gap-1"
            >
              <div
                className={`w-14 h-14 rounded-full p-[2px] ${
                  match.hasImage
                    ? "bg-gradient-to-tr from-primary to-secondary"
                    : "bg-outline-variant"
                }`}
              >
                {match.hasImage && match.avatarUrl ? (
                  <Image
                    src={match.avatarUrl}
                    alt={match.name}
                    width={56}
                    height={56}
                    className="w-full h-full rounded-full object-cover border-2 border-surface"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                    <PersonIcon />
                  </div>
                )}
              </div>
              <span className="text-[11px] font-medium">{match.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Messages list */}
      <div className="px-6 flex-1 overflow-y-auto">
        <h2 className="font-bold text-lg mb-4 text-on-surface">Messages</h2>
        <div className="flex flex-col gap-2">
          {threads.map((thread) => (
            <button
              key={thread.id}
              onClick={() => onSelectThread(thread.id)}
              className={`flex gap-3 p-3 rounded-2xl cursor-pointer transition-colors w-full text-left ${
                thread.id === activeThreadId
                  ? "bg-primary-container/20 border border-primary-fixed-dim/30"
                  : "hover:bg-surface-container-high/50"
              }`}
            >
              {thread.user.avatarUrl ? (
                <Image
                  src={thread.user.avatarUrl}
                  alt={thread.user.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant shrink-0">
                  <PersonIcon />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="font-bold text-sm truncate">
                    {thread.user.name}
                  </span>
                  <span className="text-[10px] text-on-surface-variant/70 shrink-0">
                    {thread.lastMessageTime}
                  </span>
                </div>
                <p className={`text-xs truncate ${thread.isTyping ? "font-mono" : ""} text-on-surface-variant`}>
                  {thread.isTyping ? "Typing..." : thread.lastMessage}
                </p>
              </div>
              {thread.unreadCount > 0 && (
                <div className="self-center w-5 h-5 rounded-full bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center shrink-0">
                  {thread.unreadCount}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
