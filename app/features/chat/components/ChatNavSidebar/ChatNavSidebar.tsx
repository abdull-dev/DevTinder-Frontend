"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CHAT_NAV_ITEMS } from "./constants";
import {
  HeartOutlineIcon,
  GroupIcon,
  TerminalIcon,
  PersonIcon,
  SettingsIcon,
  ChatIcon,
} from "../../../app-shell/components/icons";

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  heart: HeartOutlineIcon,
  chat: ChatIcon,
  group: GroupIcon,
  terminal: TerminalIcon,
  person: PersonIcon,
};

export function ChatNavSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col justify-center items-center w-24 shrink-0 px-4">
      <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-full py-8 px-3 flex flex-col items-center gap-8 shadow-[0_20px_50px_rgba(115,54,205,0.1)]">
        {CHAT_NAV_ITEMS.map((item) => {
          const Icon = ICON_MAP[item.icon];
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.key}
              href={item.href}
              className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ${
                isActive
                  ? "bg-primary-container/40 shadow-[0_0_15px_rgba(255,117,140,0.3)] text-primary"
                  : "text-on-surface-variant hover:text-primary hover:scale-110"
              }`}
            >
              <Icon className="w-6 h-6" />
            </Link>
          );
        })}

        <div className="w-8 h-px bg-outline-variant/30" />

        <Link
          href="/settings"
          className="w-12 h-12 flex items-center justify-center rounded-full text-on-surface-variant hover:text-primary transition-all duration-300"
        >
          <SettingsIcon className="w-6 h-6" />
        </Link>
      </div>
    </aside>
  );
}
