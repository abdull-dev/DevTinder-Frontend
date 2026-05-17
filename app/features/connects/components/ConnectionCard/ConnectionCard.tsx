import Image from "next/image";
import type { ConnectionRequest } from "../../../../lib/types";

function VerifiedIcon() {
  return (
    <svg className="w-5 h-5 text-secondary" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82L8.6 22.5 12 21.04l3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
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

function QuoteIcon() {
  return (
    <svg className="w-5 h-5 text-primary-container" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
    </svg>
  );
}

interface ConnectionCardProps {
  connection: ConnectionRequest;
  onAccept: () => void;
  onReject: () => void;
}

export function ConnectionCard({ connection, onAccept, onReject }: ConnectionCardProps) {
  const isAccepted = connection.status === "accepted";
  const isRejected = connection.status === "rejected";

  return (
    <article
      className={`bg-surface/40 backdrop-blur-[24px] border-[0.5px] border-white/60 rounded-[32px] p-6 shadow-[0_12px_40px_rgba(255,117,140,0.15)] flex flex-col sm:flex-row gap-6 relative overflow-hidden group transition-all duration-500 ${
        isAccepted
          ? "opacity-50 scale-95 border-green-300"
          : isRejected
            ? "opacity-30 scale-95"
            : "hover:-translate-y-1 hover:shadow-[0_16px_50px_rgba(255,117,140,0.25)]"
      }`}
    >
      {/* Decorative inner glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/20 rounded-full blur-[40px] pointer-events-none -z-10 group-hover:bg-primary-container/30 transition-colors" />

      {/* Avatar */}
      <div className="shrink-0">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[2rem] overflow-hidden border-2 border-primary-fixed ring-4 ring-primary-container/10 rotate-3 group-hover:rotate-0 transition-transform duration-500">
          <Image
            src={connection.user.avatarUrl}
            alt={connection.user.name}
            width={112}
            height={112}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow justify-center">
        <div>
          <h2 className="text-[28px] leading-[1.2] font-bold text-on-surface flex items-center gap-2">
            {connection.user.name}
            {connection.user.isVerified && <VerifiedIcon />}
          </h2>
          <p className="font-mono text-sm tracking-[0.02em] font-medium text-secondary mt-1">
            {connection.handle}
          </p>
        </div>

        {/* Code snippet */}
        <div className="bg-surface-container-highest/40 backdrop-blur-sm rounded-[16px] p-3 mt-4 border border-outline-variant/30 relative">
          <div className="absolute -top-2 -left-2">
            <QuoteIcon />
          </div>
          <code className="font-mono text-[13px] leading-relaxed text-on-surface-variant block pl-4">
            {connection.codeSnippet.map((line, i) => (
              <span key={i}>
                <span dangerouslySetInnerHTML={{ __html: line }} />
                {i < connection.codeSnippet.length - 1 && <br />}
              </span>
            ))}
          </code>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 mt-6 justify-end">
          <button
            aria-label="Reject Request"
            onClick={onReject}
            disabled={connection.status !== "pending"}
            className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant border border-outline-variant hover:bg-error-container hover:text-error hover:border-error transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <CloseIcon />
          </button>
          <button
            aria-label="Accept Request"
            onClick={onAccept}
            disabled={connection.status !== "pending"}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-[#ff8da1] text-on-primary font-mono text-sm tracking-[0.02em] font-bold shadow-[0_4px_20px_rgba(255,117,140,0.4)] hover:shadow-[0_6px_25px_rgba(255,117,140,0.6)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            <HeartIcon />
            Connect
          </button>
        </div>
      </div>
    </article>
  );
}
