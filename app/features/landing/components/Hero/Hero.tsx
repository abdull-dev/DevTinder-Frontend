import Link from "next/link";
import { HERO } from "./constants";

function CodeIcon() {
  return (
    <svg
      className="w-5 h-5 text-primary"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

export function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel shimmer-surface mb-4 md:mb-6 border border-outline-variant shadow-[0_4px_20px_rgba(255,117,140,0.2)]">
        <CodeIcon />
        <span className="font-mono text-sm tracking-[0.02em] font-medium text-on-surface-variant">
          {HERO.BADGE_TEXT}
        </span>
      </div>

      {/* Heading — scales with viewport */}
      <h1 className="font-sans text-[clamp(2rem,6vw,4rem)] font-extrabold tracking-[-0.02em] text-on-surface mb-3 md:mb-5 max-w-3xl leading-[1.1]">
        {HERO.HEADING_LINE_1} <br />
        <span className="animated-gradient-text">
          {HERO.HEADING_LINE_2}
        </span>{" "}
        {HERO.HEADING_EMOJI}
      </h1>

      {/* Description */}
      <p className="text-sm md:text-lg text-on-surface-variant mb-5 md:mb-8 max-w-2xl leading-relaxed">
        {HERO.DESCRIPTION}
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <Link
          href={HERO.CTA_HREF}
          className="bg-primary text-on-primary font-bold py-3 md:py-4 px-5 sm:px-8 rounded-full shadow-[0_10px_30px_rgba(255,117,140,0.4)] hover:bg-on-primary-fixed-variant transition-colors flex items-center justify-center gap-2"
        >
          <HeartIcon />
          {HERO.CTA_PRIMARY}
        </Link>
        <Link
          href={HERO.CTA_HREF}
          className="glass-panel text-primary font-bold py-3 md:py-4 px-8 rounded-full hover:bg-surface-variant/50 transition-colors flex items-center justify-center gap-2 sm:hidden"
        >
          {HERO.CTA_SECONDARY}
        </Link>
      </div>
    </section>
  );
}
