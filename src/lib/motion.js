"use client";

import { useLayoutEffect } from "react";
import { animate, stagger } from "animejs";

// Motion is deliberately small: short fades with a few pixels of travel.
// Everything is a no-op when the user prefers reduced motion.

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Fade + rise a set of elements in, one after another. */
export function reveal(targets, { delay = 0, y = 8, step = 45, duration = 420 } = {}) {
  if (!targets || (targets.length === 0) || prefersReducedMotion()) return null;

  return animate(targets, {
    opacity: [0, 1],
    translateY: [y, 0],
    duration,
    delay: stagger(step, { start: delay }),
    ease: "outCubic",
  });
}

/** Tiny "pressed" acknowledgement for toggles and confirmations. */
export function pop(target) {
  if (!target || prefersReducedMotion()) return null;

  return animate(target, {
    scale: [1, 0.86, 1],
    duration: 260,
    ease: "outCubic",
  });
}

/**
 * Reveal the elements matching `selector` inside `containerRef` when the component
 * mounts, and again whenever `trigger` changes. Runs before paint, so nothing flashes.
 */
export function useReveal(containerRef, selector, options, trigger) {
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const targets = container.querySelectorAll(selector);
    const animation = reveal(targets, options);

    return () => animation?.revert();
    // The options object is a static literal at every call site.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, selector, trigger]);
}
