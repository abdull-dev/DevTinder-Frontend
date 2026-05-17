"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { Message } from "../../../../lib/types";

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-4 h-4 text-primary"} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function DoneAllIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-primary" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z" />
    </svg>
  );
}

interface ChatMessagesProps {
  messages: Message[];
  currentUserId: string;
  partnerName: string;
  partnerAvatarUrl: string;
  matchedAt: string;
  isTyping: boolean;
}

export function ChatMessages({
  messages,
  currentUserId,
  partnerName,
  partnerAvatarUrl,
  matchedAt,
  isTyping,
}: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 flex flex-col gap-4">
      {/* Date divider */}
      <div className="flex justify-center">
        <span className="px-4 py-1 rounded-full bg-surface-container-high/50 text-on-surface-variant font-mono text-xs backdrop-blur-md">
          Today
        </span>
      </div>

      {/* Match indicator */}
      <div className="flex flex-col items-center justify-center my-4 gap-2">
        <div className="w-16 h-16 rounded-full bg-primary-container/20 flex items-center justify-center shadow-[0_0_20px_rgba(255,117,140,0.2)]">
          <HeartIcon className="w-8 h-8 text-primary" />
        </div>
        <p className="font-mono text-[13px] text-on-surface-variant/80 text-center">
          You and {partnerName} matched {matchedAt}.
          <br />
          Start the conversation!
        </p>
      </div>

      {/* Messages */}
      {messages.map((msg, i) => {
        const isSent = msg.senderId === currentUserId;
        const showAvatar =
          !isSent &&
          (i === 0 || messages[i - 1].senderId === currentUserId);

        if (isSent) {
          return (
            <div
              key={msg.id}
              className="flex gap-3 max-w-[85%] self-end group justify-end"
            >
              <div className="relative flex flex-col items-end">
                <div className="bg-primary/90 text-on-primary rounded-2xl rounded-br-sm px-5 py-3 shadow-[0_4px_15px_rgba(168,51,76,0.2)] border border-primary-fixed-dim/30 w-full">
                  <p className="text-[15px]">{msg.text}</p>
                  {msg.codeSnippet && (
                    <div className="bg-inverse-surface/20 rounded-xl p-3 font-mono text-[13px] text-on-primary shadow-inner mt-2 whitespace-pre">
                      {msg.codeSnippet}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-5 right-2">
                  <span className="text-[11px] text-on-surface-variant/50">
                    {msg.timestamp}
                  </span>
                  {msg.status === "read" && <DoneAllIcon />}
                </div>
              </div>
            </div>
          );
        }

        return (
          <div
            key={msg.id}
            className="flex gap-3 max-w-[85%] self-start group"
          >
            {showAvatar ? (
              <Image
                src={partnerAvatarUrl}
                alt={partnerName}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover self-end mb-1"
              />
            ) : (
              <div className="w-8 shrink-0" />
            )}
            <div className="relative">
              <div className="bg-surface-container-high backdrop-blur-[10px] text-on-surface rounded-2xl rounded-bl-sm px-5 py-3 shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-white/50">
                <p className="text-[15px]">{msg.text}</p>
              </div>
              {msg.reaction && (
                <div className="absolute -bottom-3 -right-2 bg-surface rounded-full p-1 shadow-md border border-white/50">
                  <HeartIcon className="w-4 h-4 text-primary" />
                </div>
              )}
              <span className="text-[11px] text-on-surface-variant/50 absolute -bottom-5 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {msg.timestamp}
              </span>
            </div>
          </div>
        );
      })}

      {/* Typing indicator */}
      {isTyping && (
        <div className="flex gap-3 max-w-[85%] self-start mt-2">
          <Image
            src={partnerAvatarUrl}
            alt={partnerName}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full object-cover self-end mb-1"
          />
          <div className="bg-surface-container-high backdrop-blur-[10px] rounded-2xl rounded-bl-sm px-4 py-3 shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-white/50 flex items-center gap-1.5 w-16">
            <div className="w-2 h-2 rounded-full bg-primary/50 animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-primary/70 animate-pulse" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
