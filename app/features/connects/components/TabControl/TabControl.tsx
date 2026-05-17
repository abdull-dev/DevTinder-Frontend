"use client";

import { useState } from "react";

interface TabControlProps {
  receivedCount: number;
}

export function TabControl({ receivedCount }: TabControlProps) {
  const [active, setActive] = useState("received");

  const tabs = [
    { key: "received", label: `Received (${receivedCount})` },
    { key: "sent", label: "Sent" },
  ];

  return (
    <div className="inline-flex items-center p-1.5 bg-surface-container-high/50 backdrop-blur-md rounded-full border border-white/40 shadow-[0_4px_16px_rgba(115,54,205,0.05)]">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActive(tab.key)}
          className={`px-6 py-2.5 rounded-full font-mono text-sm tracking-[0.02em] font-medium transition-all cursor-pointer ${
            active === tab.key
              ? "bg-surface-container-lowest text-primary shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface/30"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
