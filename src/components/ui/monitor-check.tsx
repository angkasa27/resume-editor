"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef } from "react";

import {
  useAnimatedIconHandle,
  type AnimatedIconHandle as MonitorCheckIconHandle,
} from "@/components/ui/use-animated-icon-handle";
import { cn } from "@/lib/utils";

interface MonitorCheckIconProps extends HTMLAttributes<HTMLDivElement> {
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

const MonitorCheckIcon = forwardRef<
  MonitorCheckIconHandle,
  MonitorCheckIconProps
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
        <rect height="14" rx="2" width="20" x="2" y="3" />
        <path d="M12 17v4" />
        <path d="M8 21h8" />
        <motion.path
          animate={controls}
          d="m9 10 2 2 4-4"
          initial="normal"
          style={{ transformOrigin: "center" }}
          variants={CHECK_VARIANTS}
        />
      </svg>
    </div>
  );
});

MonitorCheckIcon.displayName = "MonitorCheckIcon";

export { MonitorCheckIcon };
