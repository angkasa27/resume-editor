/**
 * Shared handle for animated icons (vendored lucide + local PopIcon fallback).
 * Centralized so consumers (mobile-bottom-nav, landing features) don't each redeclare the shape.
 */
export type AnimatedIconHandle = {
  startAnimation: () => void;
  stopAnimation: () => void;
};
