import { ACTION_BUTTONS } from "./constants";

function CloseIcon() {
  return (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

function SparkleSmall() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5z" />
    </svg>
  );
}

export function ActionButtons() {
  return (
    <div className="flex flex-col items-center gap-6 mt-6">
      {/* Buttons row */}
      <div className="flex items-center gap-6">
        {/* Pass */}
        <button
          aria-label={ACTION_BUTTONS.PASS_LABEL}
          className="w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center border border-outline-variant/30 text-on-surface-variant hover:text-error transition-all hover:scale-110 active:scale-90 cursor-pointer group"
        >
          <span className="group-hover:rotate-12 transition-transform">
            <CloseIcon />
          </span>
        </button>

        {/* Connect */}
        <button
          aria-label={ACTION_BUTTONS.CONNECT_LABEL}
          className="w-20 h-20 rounded-full gradient-romantic shadow-[0_10px_30px_rgba(255,117,140,0.5)] flex items-center justify-center text-white hover:scale-110 active:scale-95 cursor-pointer relative"
        >
          <HeartIcon />
          {/* Sparkle decorations */}
          <div className="absolute -top-2 -right-2 text-primary-container animate-pulse">
            <SparkleSmall />
          </div>
        </button>

        {/* Super Swipe */}
        <button
          aria-label={ACTION_BUTTONS.SUPER_SWIPE_LABEL}
          className="w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center border border-outline-variant/30 text-on-surface-variant hover:text-secondary transition-all hover:scale-110 active:scale-90 cursor-pointer group"
        >
          <span className="group-hover:-rotate-12 transition-transform">
            <StarIcon />
          </span>
        </button>
      </div>

      {/* Suggestion text */}
      <p className="text-on-surface-variant/40 font-mono text-xs uppercase tracking-widest">
        {ACTION_BUTTONS.SUGGESTION_TEXT}
      </p>
    </div>
  );
}
