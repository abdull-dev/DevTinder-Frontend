import Image from "next/image";

function ArrowBackIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
    </svg>
  );
}

function VideocamIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
    </svg>
  );
}

function MoreVertIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
    </svg>
  );
}

interface ChatHeaderProps {
  name: string;
  role: string;
  avatarUrl: string;
  isOnline: boolean;
  onBack: () => void;
}

export function ChatHeader({
  name,
  role,
  avatarUrl,
  isOnline,
  onBack,
}: ChatHeaderProps) {
  return (
    <header className="flex justify-between items-center px-6 h-20 w-full bg-surface/40 backdrop-blur-[24px] border-b border-white/30 shadow-[0_4px_20px_rgba(255,117,140,0.1)] shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-surface-container-high/50 flex items-center justify-center text-on-surface-variant hover:bg-primary-container/20 hover:text-primary transition-colors cursor-pointer"
        >
          <ArrowBackIcon />
        </button>
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-primary-container to-secondary-container">
            <Image
              src={avatarUrl}
              alt={name}
              width={48}
              height={48}
              className="w-full h-full rounded-full object-cover border-2 border-surface"
            />
            {isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-surface" />
            )}
          </div>
          <div>
            <h1 className="text-[20px] font-bold text-on-surface leading-tight">
              {name}
            </h1>
            <p className="font-mono text-xs text-on-surface-variant/70 flex items-center gap-1.5">
              {isOnline && (
                <span className="flex items-center gap-1 text-green-500 font-semibold">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  Online
                  <span className="text-on-surface-variant/40 mx-0.5">·</span>
                </span>
              )}
              {role}
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="w-10 h-10 rounded-full bg-surface-container-high/50 flex items-center justify-center text-primary hover:bg-primary-container/20 transition-colors cursor-pointer">
          <VideocamIcon />
        </button>
        <button className="w-10 h-10 rounded-full bg-surface-container-high/50 flex items-center justify-center text-on-surface-variant hover:bg-primary-container/20 hover:text-primary transition-colors cursor-pointer">
          <MoreVertIcon />
        </button>
      </div>
    </header>
  );
}
