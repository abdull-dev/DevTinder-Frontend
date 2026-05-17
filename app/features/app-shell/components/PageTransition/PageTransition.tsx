"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const controls = useAnimationControls();
  const [isFirst, setIsFirst] = useState(true);

  useEffect(() => {
    if (isFirst) {
      setIsFirst(false);
      controls.set({ opacity: 1, scale: 1, filter: "blur(0px)" });
      return;
    }

    // Fade out briefly, then fade in
    controls.set({ opacity: 0, scale: 0.98, filter: "blur(4px)" });
    controls.start({
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    });
  }, [pathname, controls, isFirst]);

  return (
    <motion.div
      animate={controls}
      className="flex-1 flex flex-col items-center justify-start w-full min-h-0"
    >
      {children}
    </motion.div>
  );
}
