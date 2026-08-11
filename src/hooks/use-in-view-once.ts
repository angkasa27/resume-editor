"use client";

import { useEffect, useRef, useState } from "react";

/**
 * For deferring expensive children until their container nears the viewport.
 * Latches on first intersection — unmounting on scroll-out would trade a
 * one-off cost for a permanent one.
 *
 * Always starts `false`, including on the server, so the first client render
 * matches the SSR output.
 */
export function useInViewOnce<T extends HTMLElement>(rootMargin = "200px") {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || seen) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [seen, rootMargin]);

  return [ref, seen] as const;
}
