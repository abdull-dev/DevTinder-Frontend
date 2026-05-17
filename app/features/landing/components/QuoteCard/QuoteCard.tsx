"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QUOTES } from "./constants";

function QuoteIcon() {
  return (
    <svg
      className="w-[120px] h-[120px] text-primary/10"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
    </svg>
  );
}

const AUTO_PLAY_INTERVAL = 5000;

export function QuoteCard() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback(
    (next: number) => {
      setDirection(next > index ? 1 : -1);
      setIndex(next);
    },
    [index]
  );

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % QUOTES.length);
    }, AUTO_PLAY_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  // Swipe handlers
  const handleDragEnd = (
    _: unknown,
    info: { offset: { x: number }; velocity: { x: number } }
  ) => {
    const swipe = info.offset.x;
    const velocity = info.velocity.x;
    if (swipe < -50 || velocity < -300) {
      setDirection(1);
      setIndex((prev) => (prev + 1) % QUOTES.length);
    } else if (swipe > 50 || velocity > 300) {
      setDirection(-1);
      setIndex((prev) => (prev - 1 + QUOTES.length) % QUOTES.length);
    }
  };

  const quote = QUOTES[index];

  return (
    <div className="md:col-span-2 glass-panel rounded-xl p-6 md:p-8 flex flex-col justify-center items-center text-center shadow-[0_10px_30px_rgba(255,117,140,0.15)] border-l-4 border-l-primary relative overflow-hidden">
      {/* Background quote mark */}
      <div className="absolute -top-4 -left-4">
        <QuoteIcon />
      </div>

      {/* Swipeable quote area */}
      <div className="relative z-10 w-full max-w-lg min-h-[100px] flex items-center justify-center">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={{
              enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.3}
            onDragEnd={handleDragEnd}
            className="flex flex-col items-center cursor-grab active:cursor-grabbing select-none"
          >
            <h2 className="text-xl md:text-[28px] md:leading-[1.2] font-bold text-on-surface italic mb-3">
              {quote.text}
            </h2>
            <div className="font-mono text-sm tracking-[0.02em] font-medium">
              <span className="text-tertiary">{quote.code.keyword}</span>{" "}
              <span className="text-secondary">{quote.code.variable}</span> ={" "}
              <span className="text-primary-container">{quote.code.value}</span>
              ;
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination dots */}
      <div className="flex gap-2 mt-6 relative z-10">
        {QUOTES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 cursor-pointer ${
              i === index
                ? "w-6 h-2 bg-primary shadow-[0_0_8px_rgba(168,51,76,0.5)]"
                : "w-2 h-2 bg-surface-variant hover:bg-outline-variant"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
