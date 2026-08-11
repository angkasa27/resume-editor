"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef } from "react";

import {
  useAnimatedIconHandle,
  type AnimatedIconHandle as GalleryThumbnailsIconHandle,
} from "@/components/ui/use-animated-icon-handle";
import { cn } from "@/lib/utils";

interface GalleryThumbnailsIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const PATH_VARIANTS: Variants = {
  normal: { opacity: 1 },
  animate: (i: number) => ({
    opacity: [0, 1],
    transition: { delay: i * 0.15, duration: 0.2 },
  }),
};

const GalleryThumbnailsIcon = forwardRef<
  GalleryThumbnailsIconHandle,
  GalleryThumbnailsIconProps
>(({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
  const controls = useAnimation();
  const { handleMouseEnter, handleMouseLeave } = useAnimatedIconHandle(
    ref,
    {
      startAnimation: () => controls.start("animate"),
      stopAnimation: () => controls.start("normal"),
    },
    { onMouseEnter, onMouseLeave },
  );

  return (
    <div
      className={cn(className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <svg
        fill="none"
        height={size}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect height="14" rx="2" width="18" x="3" y="3" />
          {["M4 21h1", "M9 21h1", "M14 21h1", "M19 21h1"].map((d, index) => (
            <motion.path
              animate={controls}
              custom={index + 1}
              d={d}
              initial="normal"
              key={d}
              variants={PATH_VARIANTS}
            />
          ))}
      </svg>
    </div>
  );
});

GalleryThumbnailsIcon.displayName = "GalleryThumbnailsIcon";

export { GalleryThumbnailsIcon };
