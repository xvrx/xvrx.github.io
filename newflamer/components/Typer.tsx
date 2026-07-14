"use client";

import { useEffect, useState } from "react";

export type TyperSegment = { text: string; className?: string };

/*
 * Typewriter text. Renders styled segments character by character with a
 * blinking caret; under prefers-reduced-motion (or without JS, via SSR
 * markup being empty only briefly) the full text appears instantly.
 * Screen readers always get the complete text via aria-label.
 */
export default function Typer({
  segments,
  speed = 26,
  startDelay = 0,
  keepCaret = false,
}: {
  segments: TyperSegment[];
  speed?: number;
  startDelay?: number;
  keepCaret?: boolean;
}) {
  const total = segments.reduce((n, s) => n + s.text.length, 0);
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(total);
      return;
    }
    let n = 0;
    let timer: ReturnType<typeof setTimeout>;
    const step = () => {
      n += 1;
      setTyped(n);
      if (n < total) {
        /* small jitter so it reads as typing, not a metronome */
        timer = setTimeout(step, speed + Math.random() * speed * 0.8);
      }
    };
    timer = setTimeout(step, startDelay);
    return () => clearTimeout(timer);
  }, [total, speed, startDelay]);

  const done = typed >= total;
  let used = 0;

  return (
    <span className="typer" aria-label={segments.map((s) => s.text).join("")}>
      {segments.map((seg, i) => {
        const visible = Math.max(0, Math.min(seg.text.length, typed - used));
        used += seg.text.length;
        return (
          <span key={i} className={seg.className} aria-hidden="true">
            {seg.text.slice(0, visible)}
          </span>
        );
      })}
      <span
        className={`typer-caret${done && !keepCaret ? " typer-caret-done" : ""}`}
        aria-hidden="true"
      />
    </span>
  );
}
