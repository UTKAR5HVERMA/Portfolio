"use client";

import { useEffect, useRef, useState } from "react";

type RotatingTextProps = {
  /** Phrases to type in and out, one after another. */
  phrases: string[];
  /** Typing speed per character, in ms. */
  typeSpeed?: number;
  /** Deleting speed per character, in ms. */
  deleteSpeed?: number;
  /** Pause once a phrase is fully typed, in ms. */
  pause?: number;
  className?: string;
};

export default function RotatingText({
  phrases,
  typeSpeed = 70,
  deleteSpeed = 38,
  pause = 1500,
  className = "",
}: RotatingTextProps) {
  const [text, setText] = useState("");
  const phraseIndex = useRef(0);
  const deleting = useRef(false);

  useEffect(() => {
    if (phrases.length === 0) return;
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      const full = phrases[phraseIndex.current];
      const done = !deleting.current && text === full;
      const cleared = deleting.current && text === "";

      if (done) {
        deleting.current = true;
        timeout = setTimeout(tick, pause);
        return;
      }
      if (cleared) {
        deleting.current = false;
        phraseIndex.current = (phraseIndex.current + 1) % phrases.length;
        timeout = setTimeout(tick, typeSpeed);
        return;
      }

      const next = deleting.current
        ? full.slice(0, text.length - 1)
        : full.slice(0, text.length + 1);
      setText(next);
      timeout = setTimeout(tick, deleting.current ? deleteSpeed : typeSpeed);
    };

    timeout = setTimeout(tick, typeSpeed);
    return () => clearTimeout(timeout);
  }, [text, phrases, typeSpeed, deleteSpeed, pause]);

  return (
    <span className={`whitespace-nowrap font-semibold text-[var(--foreground)] ${className}`}>
      {text}
      <span className="ml-0.5 inline-block w-[2px] animate-pulse bg-[var(--accent)] [height:1em] translate-y-[0.12em]" />
    </span>
  );
}
