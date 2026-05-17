"use client";

import { motion } from "framer-motion";
import { BackButton } from "../features/auth/components/BackButton/BackButton";
import { DecorativeBlobs } from "../features/auth/components/DecorativeBlobs/DecorativeBlobs";
import { AuthCard } from "../features/auth/components/AuthCard/AuthCard";

export default function AuthPage() {
  return (
    <div className="bg-surface-bright h-screen flex flex-col relative">
      {/* Decorative blurred background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <DecorativeBlobs />
      </motion.div>

      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <BackButton />
      </motion.div>

      {/* Auth modal — centered, scrolls if needed */}
      <div className="flex-1 flex items-center justify-center px-6 py-8 min-h-0 relative z-10 overflow-y-auto">
        <motion.main
          className="w-full max-w-[480px] my-auto"
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <AuthCard />
        </motion.main>
      </div>
    </div>
  );
}
