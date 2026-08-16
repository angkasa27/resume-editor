"use client";

import { useState } from "react";

/** Shared +1/-1 slide direction for the drill-in `AnimatePresence` blocks. */
export function useDirection(initial = 1) {
  const [direction, setDirection] = useState(initial);
  return {
    direction,
    forward: () => setDirection(1),
    backward: () => setDirection(-1),
    set: setDirection,
  };
}
