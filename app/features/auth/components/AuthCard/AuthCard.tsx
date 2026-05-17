"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AUTH_CARD } from "./constants";
import { AuthForm } from "../AuthForm/AuthForm";
import { SocialAuth } from "../SocialAuth/SocialAuth";
import { HeartOutlineIcon } from "../icons";

export type AuthMode = "signin" | "signup";

const stagger = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const, delay },
});

export function AuthCard() {
  const [mode, setMode] = useState<AuthMode>("signin");

  return (
    <div className="bg-surface/60 backdrop-blur-[24px] border border-white/50 rounded-xl shadow-[0_20px_60px_rgba(255,117,140,0.15)] px-6 py-5 sm:px-10 sm:py-7 flex flex-col relative overflow-hidden">
      {/* Header / Logo */}
      <motion.div className="flex flex-col items-center gap-1 mb-4 relative z-10" {...stagger(0.05)}>
        <motion.div
          className="gradient-border-glow p-[3px] rounded-full shadow-[0_0_20px_rgba(255,117,140,0.2)] mb-1 pulse-glow"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
        >
          <div className="bg-surface rounded-full p-3">
            <HeartOutlineIcon className="w-8 h-8 text-primary" />
          </div>
        </motion.div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.02em] text-primary drop-shadow-[0_0_12px_rgba(168,51,76,0.2)]">
          {AUTH_CARD.LOGO_TITLE}
        </h1>
        <p className="text-sm text-on-surface-variant text-center mt-1">
          {AUTH_CARD.SUBTITLE}
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div className="flex p-1 bg-surface-container-high/60 backdrop-blur-md rounded-full mb-4 relative z-10 border border-white/30" {...stagger(0.15)}>
        {AUTH_CARD.TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setMode(tab.key as AuthMode)}
            className={`flex-1 py-2.5 px-4 rounded-full font-bold text-sm transition-all cursor-pointer ${
              mode === tab.key
                ? "bg-surface text-primary shadow-sm"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Form */}
      <motion.div {...stagger(0.22)}>
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: mode === "signup" ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: mode === "signup" ? -20 : 20 }}
            transition={{ duration: 0.2 }}
          >
            <AuthForm mode={mode} onSwitchMode={setMode} />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Divider */}
      <motion.div className="flex items-center gap-4 my-4 relative z-10" {...stagger(0.3)}>
        <div className="h-px bg-outline-variant/40 flex-1" />
        <span className="font-mono text-xs tracking-[0.02em] font-medium text-on-surface-variant/60">
          {AUTH_CARD.DIVIDER_TEXT}
        </span>
        <div className="h-px bg-outline-variant/40 flex-1" />
      </motion.div>

      {/* Social Auth */}
      <motion.div {...stagger(0.36)}>
        <SocialAuth />
      </motion.div>
    </div>
  );
}
