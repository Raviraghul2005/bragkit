"use client";

import { useRef, type ReactNode } from "react";

/**
 * The footer room. A visitor's pointer is the torch: it warms the room around it and
 * lights the letters of the giant wordmark. Without a pointer (touch, keyboard, reduced
 * motion) the room simply stays lit, so nothing is hidden.
 */
export function Torch({ children }: { children: ReactNode }) {
  const room = useRef<HTMLDivElement>(null);

  const aim = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = room.current;
    if (!el || e.pointerType === "touch") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--tx", `${e.clientX - r.left}px`);
    el.style.setProperty("--ty", `${e.clientY - r.top}px`);
    el.style.setProperty("--torch", "1");
    const mark = el.querySelector<HTMLElement>(".giant");
    if (mark) {
      const m = mark.getBoundingClientRect();
      mark.style.setProperty("--mx", `${e.clientX - m.left}px`);
      mark.style.setProperty("--my", `${e.clientY - m.top}px`);
    }
  };

  const lower = () => {
    const el = room.current;
    if (!el) return;
    el.style.setProperty("--torch", "0");
    el.querySelector<HTMLElement>(".giant")?.style.setProperty("--mx", "-999px");
  };

  return (
    <div ref={room} className="foot" onPointerMove={aim} onPointerLeave={lower}>
      {children}
    </div>
  );
}
