"use client";
import { useRef, type ReactNode } from "react";

// A horizontal row of cards that scrolls and snaps, with buttons on larger screens.
// Built so future subjects (AI, etc.) just add another card, no layout change needed.
export default function Slider({ children }: { children: ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".card");
    const step = (card?.offsetWidth ?? 260) + 16;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };
  return (
    <div className="slider">
      <div className="slider-track" ref={track}>
        {children}
      </div>
      <div className="slider-nav">
        <button type="button" onClick={() => scroll(-1)} aria-label="Previous">‹</button>
        <button type="button" onClick={() => scroll(1)} aria-label="Next">›</button>
      </div>
    </div>
  );
}
