"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";

/*
 * Animated halftone "cloud" of diamond dots, drawn on one canvas (thousands of dots, one
 * path per frame). Anime.js drives the clock: an intro where the dots assemble outward from
 * the top-right corner, then a slow drift. Dots near the pointer swell slightly.
 * The dots use the element's text colour, so the field follows the light/dark theme.
 * With reduced motion it renders a single still frame.
 */
const SPACING = 9;

export function HalftoneField({ className }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const state = { t: 0, reveal: reduceMotion ? 1 : 0 };
    const pointer = { x: -9999, y: -9999, strength: 0, target: 0 };
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    function draw() {
      if (!width || !height) return;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = getComputedStyle(canvas).color;

      pointer.strength += (pointer.target - pointer.strength) * 0.12;
      const { t, reveal } = state;
      const path = new Path2D();

      for (let y = SPACING / 2; y < height; y += SPACING) {
        for (let x = SPACING / 2; x < width; x += SPACING) {
          const nx = x / width;
          const ny = y / height;

          // Cloud mask: dense towards the top-right, dissolving to the bottom-left.
          const dx = nx - 0.78;
          const dy = ny - 0.28;
          const mask = 1 - Math.min(1, Math.sqrt(dx * dx * 0.9 + dy * dy * 1.3) / 0.85);
          if (mask <= 0) continue;

          // Soft moving "terrain" made of a few slow waves.
          const wave =
            0.55 +
            0.25 * Math.sin(nx * 7.0 + t) * Math.cos(ny * 6.0 - t * 0.8) +
            0.2 * Math.sin((nx + ny) * 11.0 - t * 1.3);

          // Intro: dots appear progressively by distance from the corner.
          const corner = Math.hypot(1 - nx, ny) / 1.42;
          const appear = Math.min(1, Math.max(0, (reveal * 1.5 - corner) / 0.5));

          // Pointer ripple.
          const px = x - pointer.x;
          const py = y - pointer.y;
          const bump = pointer.strength * Math.exp(-(px * px + py * py) / (2 * 70 * 70));

          const size = SPACING * Math.min(0.96, Math.pow(mask, 0.7) * wave * 1.7 + bump * 0.5) * appear;
          if (size < 0.8) continue;

          const r = size / 2;
          path.moveTo(x, y - r);
          path.lineTo(x + r, y);
          path.lineTo(x, y + r);
          path.lineTo(x - r, y);
          path.closePath();
        }
      }
      ctx.fill(path);
    }

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    if (reduceMotion) {
      return () => observer.disconnect();
    }

    const intro = animate(state, { reveal: 1, duration: 1800, ease: "outQuart", onUpdate: draw });
    const drift = animate(state, {
      t: Math.PI * 2,
      duration: 24000,
      ease: "linear",
      loop: true,
      onUpdate: draw,
    });

    const onMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.target = 1;
    };
    const onLeave = () => {
      pointer.target = 0;
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    return () => {
      intro.revert();
      drift.revert();
      observer.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
