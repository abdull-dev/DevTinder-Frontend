import Image from "next/image";
import Link from "next/link";
import type { MatchData } from "./constants";
import { getVariantStyles } from "./constants";

function TerminalIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10zm-2-1h-6v-2h6v2zM7.5 17l-1.41-1.41L8.67 13l-2.59-2.59L7.5 9l4 4-4 4z" />
    </svg>
  );
}

function DatabaseIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3C7.58 3 4 4.79 4 7s3.58 4 8 4 8-1.79 8-4-3.58-4-8-4zm0 14c-4.42 0-8-1.79-8-4v3c0 2.21 3.58 4 8 4s8-1.79 8-4v-3c0 2.21-3.58 4-8 4zm0-5c-4.42 0-8-1.79-8-4v3c0 2.21 3.58 4 8 4s8-1.79 8-4V8c0 2.21-3.58 4-8 4z" />
    </svg>
  );
}

function PaletteIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
    </svg>
  );
}

const TECH_ICON_MAP: Record<string, React.FC> = {
  terminal: TerminalIcon,
  database: DatabaseIcon,
  palette: PaletteIcon,
  cloud: CloudIcon,
};

export function MatchCard({ match }: { match: MatchData }) {
  const styles = getVariantStyles(match.variant);
  const TechIcon = TECH_ICON_MAP[match.techIcon];

  return (
    <article className="relative group rounded-[3rem] bg-white/60 backdrop-blur-xl border border-pink-100 shadow-[0_12px_40px_rgba(168,51,76,0.08)] overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(255,117,140,0.2)]">
      {/* Image */}
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <Image
          src={match.imageSrc}
          alt={`Profile of ${match.name}`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />

        {/* Online badge */}
        {match.isOnline && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-pink-100 shadow-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-pink-500 font-bold">
              Online
            </span>
          </div>
        )}
      </div>

      {/* Info panel */}
      <div className="p-6 flex flex-col flex-grow z-10 -mt-10 bg-white/90 backdrop-blur-2xl rounded-[2.5rem] mx-3 mb-3 shadow-lg">
        <h2 className="text-[22px] font-bold text-on-surface leading-tight mb-2">
          {match.name}{" "}
          <span>{match.emoji}</span>
        </h2>

        {/* Tech tag */}
        <div
          className={`inline-flex items-center gap-1.5 ${styles.tagBg} ${styles.tagText} border ${styles.tagBorder} px-4 py-1.5 rounded-full w-fit mb-6`}
        >
          <TechIcon />
          <span className="font-mono text-sm tracking-[0.02em] font-medium">
            {match.techLabel}
          </span>
        </div>

        {/* CTA button */}
        <Link
          href="/chat"
          className={`w-full bg-gradient-to-r ${styles.btnGradient} text-white rounded-full py-3.5 flex items-center justify-center gap-2 font-bold ${styles.btnShadow} hover:scale-[1.03] transition-all duration-300`}
        >
          <ChatIcon />
          <span>{match.ctaText}</span>
        </Link>
      </div>
    </article>
  );
}
