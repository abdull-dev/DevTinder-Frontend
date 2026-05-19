"use client";

import Link from "next/link";
import { NAVBAR } from "./constants";
import { useTheme } from "../../../../lib/ThemeProvider";

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

export function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex justify-between items-center px-6 h-16 w-full fixed top-0 z-50 bg-surface/30 backdrop-blur-[20px] border-b border-white/20 shadow-[0_4px_20px_rgba(168,51,76,0.15)]">
      <Link href="/" className="text-xl sm:text-[28px] leading-[1.2] font-extrabold text-primary drop-shadow-[0_0_8px_rgba(168,51,76,0.4)]">
        {NAVBAR.BRAND_NAME}
      </Link>
      <div className="flex items-center gap-2 sm:gap-4">
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
        <Link
          href={NAVBAR.SIGN_IN_HREF}
          className="text-primary font-bold hover:bg-primary-container/20 transition-all duration-300 px-4 py-2 rounded-full hidden md:block"
        >
          {NAVBAR.SIGN_IN_TEXT}
        </Link>
      </div>
    </header>
  );
}
