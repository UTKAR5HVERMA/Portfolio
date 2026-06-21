"use client";

import { motion, type Variants } from "framer-motion";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  /** When true, staggers direct motion children that use the `revealItem` variants. */
  stagger?: boolean;
  once?: boolean;
}

const container = (delay: number, stagger: boolean): Variants => ({
  hidden: {},
  visible: {
    transition: {
      delayChildren: delay,
      staggerChildren: stagger ? 0.12 : 0,
    },
  },
});

const single = (delay: number, y: number): Variants => ({
  hidden: { opacity: 0, y },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
  },
});

/** Item variants for children inside a <Reveal stagger>. */
export const revealItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function Reveal({
  children,
  className = "",
  delay = 0,
  y = 40,
  stagger = false,
  once = true,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      variants={stagger ? container(delay, stagger) : single(delay, y)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "0px 0px -80px 0px" }}
    >
      {children}
    </motion.div>
  );
}
