"use client";

import {
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from "react";
import type { MouseEvent, Ref } from "react";

export interface AnimatedIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

type HoverProps = {
  onMouseEnter?: (event: MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (event: MouseEvent<HTMLDivElement>) => void;
};

/**
 * The playback contract every animated icon here shares: hovering plays the
 * animation, unless a parent takes the ref — then the parent owns playback and
 * the icon's own hover handlers pass straight through to it instead.
 */
export function useAnimatedIconHandle(
  ref: Ref<AnimatedIconHandle>,
  handle: AnimatedIconHandle,
  { onMouseEnter, onMouseLeave }: HoverProps,
) {
  const isControlledRef = useRef(false);
  // `handle` is a fresh object each render; the ref keeps the callbacks below
  // stable without making every caller memoize it.
  const handleRef = useRef(handle);
  useLayoutEffect(() => {
    handleRef.current = handle;
  });

  useImperativeHandle(ref, () => {
    isControlledRef.current = true;

    return {
      startAnimation: () => handleRef.current.startAnimation(),
      stopAnimation: () => handleRef.current.stopAnimation(),
    };
  });

  const handleMouseEnter = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (isControlledRef.current) {
        onMouseEnter?.(event);
      } else {
        handleRef.current.startAnimation();
      }
    },
    [onMouseEnter],
  );

  const handleMouseLeave = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (isControlledRef.current) {
        onMouseLeave?.(event);
      } else {
        handleRef.current.stopAnimation();
      }
    },
    [onMouseLeave],
  );

  return { handleMouseEnter, handleMouseLeave };
}
