"use client";

import { useState, useRef } from "react";

function AddCircleIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
    </svg>
  );
}

function EmojiIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  );
}

interface ChatInputProps {
  onSend: (text: string) => void;
  onTyping?: () => void;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  onTyping,
  placeholder = "Write a sweet message...",
}: ChatInputProps) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
    }
  };

  return (
    <div className="shrink-0 bg-surface/80 backdrop-blur-[30px] border-t border-white/40 shadow-[0_-10px_30px_rgba(168,51,76,0.05)] p-4">
      <div className="flex items-end gap-2 bg-surface-container-lowest/80 rounded-[1.5rem] p-2 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-surface-variant/50 focus-within:border-primary-fixed-dim focus-within:shadow-[0_0_15px_rgba(255,117,140,0.2)] transition-all">
        <button className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors shrink-0 self-end mb-1 cursor-pointer">
          <AddCircleIcon />
        </button>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            onTyping?.();
          }}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          className="flex-1 bg-transparent border-none outline-none resize-none text-[15px] text-on-surface placeholder:text-on-surface-variant/50 py-3 max-h-32 focus:ring-0"
          placeholder={placeholder}
          rows={1}
        />
        <div className="flex items-center gap-1 shrink-0 self-end mb-1">
          <button className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors cursor-pointer">
            <EmojiIcon />
          </button>
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className="p-2 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary shadow-[0_4px_10px_rgba(168,51,76,0.3)] hover:scale-105 transition-transform cursor-pointer ml-1 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
