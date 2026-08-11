"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef } from "react";

import {
  useAnimatedIconHandle,
  type AnimatedIconHandle as FileCheckIconHandle,
} from "@/components/ui/use-animated-icon-handle";
import { cn } from "@/lib/utils";

interface FileCheckIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const CHECK_VARIANTS: Variants = {
  normal: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
  animate: {
    pathLength: [0, 1],
    opacity: [0, 1],
    transition: {
      pathLength: { duration: 0.4, ease: "easeInOut" },
      opacity: { duration: 0.4, ease: "easeInOut" },
    },
  },
};

const FileCheckIcon = forwardRef<FileCheckIconHandle, FileCheckIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
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
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
          <motion.path
            animate={controls}
            d="m9 15 2 2 4-4"
            initial="normal"
            style={{ transformOrigin: "center" }}
            variants={CHECK_VARIANTS}
          />
        </svg>
      </div>
    );
  },
);

FileCheckIcon.displayName = "FileCheckIcon";

export { FileCheckIcon };
