import Image from "next/image";
import mainImage from "@/assets/main.jpg";
import { MATCH_CARD } from "./constants";

export function MatchCard() {
  return (
    <div className="glass-panel rounded-xl p-6 flex flex-col items-center text-center shadow-[0_10px_30px_rgba(115,54,205,0.1)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] relative overflow-hidden group">
      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary-container/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Profile image */}
      <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-surface shadow-[0_0_15px_rgba(255,117,140,0.3)] relative z-10">
        <Image
          unoptimized
          src={mainImage}
          alt={MATCH_CARD.IMAGE_ALT}
          width={96}
          height={96}
          className="w-full h-full object-cover"
        />
      </div>

      {/* User info */}
      <h3 className="text-[28px] leading-[1.2] font-bold mb-1 relative z-10 text-on-surface">
        {MATCH_CARD.NAME}
      </h3>
      <p className="font-mono text-sm tracking-[0.02em] font-medium text-secondary mb-4 relative z-10">
        {MATCH_CARD.TITLE}
      </p>

      {/* Skill tags */}
      <div className="flex gap-2 relative z-10">
        {MATCH_CARD.SKILLS.map((skill) => (
          <span
            key={skill}
            className="bg-surface-variant text-on-surface-variant font-mono text-xs px-3 py-1 rounded-full"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
