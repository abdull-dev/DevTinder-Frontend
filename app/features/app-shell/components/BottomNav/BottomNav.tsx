"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BOTTOM_NAV_ITEMS } from "./constants";
import { ExploreIcon, ChatIcon, GroupIcon, TerminalIcon, PersonIcon, CrownIcon } from "../icons";

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  explore: ExploreIcon,
  chat: ChatIcon,
  group: GroupIcon,
  terminal: TerminalIcon,
  person: PersonIcon,
  crown: CrownIcon,
};

export function BottomNav() {
  const pathname = usePathname();

  return (
    <footer className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-1 py-2 bg-surface/40 backdrop-blur-[24px] border-t border-white/30 shadow-[0_-10px_30px_rgba(115,54,205,0.1)] safe-area-bottom">
      {BOTTOM_NAV_ITEMS.map((item) => {
        const Icon = ICON_MAP[item.icon];
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.key}
            href={item.href}
            className={`flex flex-col items-center justify-center min-w-0 ${
              isActive
                ? "text-on-primary-container bg-primary-container/40 rounded-xl px-2 py-1.5 shadow-[0_0_15px_rgba(255,117,140,0.3)]"
                : "text-on-surface-variant/80 hover:bg-secondary-container/20 transition-colors px-2 py-1.5"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="font-mono text-[10px] tracking-tight font-medium truncate max-w-[56px]">
              {item.label}
            </span>
          </Link>
        );
      })}
    </footer>
  );
}
