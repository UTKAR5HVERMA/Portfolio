"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { personal } from "../profile";

export default function LoadingScreen() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1600);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] grid place-items-center bg-[var(--background)]"
        >
          <div className="flex flex-col items-center gap-6">
            <motion.div
              className="text-3xl font-extrabold tracking-tighter text-[var(--foreground)] md:text-5xl"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {personal.name}
              <span className="text-accent">.</span>
            </motion.div>
            <div className="h-[3px] w-48 overflow-hidden rounded-full bg-[var(--surface-border)]">
              <motion.div
                className="h-full bg-gradient-to-r from-accent to-accent-strong"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.3, ease: "easeInOut" }}
              />
            </div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
              {personal.tagline}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
