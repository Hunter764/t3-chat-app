"use client";

import { useRef } from "react";
import { Logo } from "@/components/brand/logo";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { HalftoneField } from "@/components/auth/halftone-field";
import { useReveal } from "@/lib/motion";

// Spec sheet, in the spirit of a product launch page.
const SPECS = [
  ["Models", "400+ via OpenRouter"],
  ["Replies", "Streamed, token by token"],
  ["History", "Saved & searchable"],
  ["Price", "Free models included"],
];

// One sheet of paper: the form on the left, the product story on an animated halftone field.
export function AuthShell({ children }) {
  const formRef = useRef(null);
  const storyRef = useRef(null);
  useReveal(formRef, "[data-reveal]", { y: 10, step: 70, duration: 480 });
  useReveal(storyRef, "[data-reveal]", { y: 12, step: 80, delay: 450, duration: 560 });

  return (
    <div className="flex min-h-dvh items-stretch justify-center p-0 sm:p-5 lg:items-center lg:p-8">
      <div className="relative grid w-full max-w-6xl overflow-hidden bg-card sm:rounded-2xl sm:border sm:border-border sm:shadow-xl lg:min-h-[min(760px,calc(100dvh-4rem))] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        {/* Form */}
        <div ref={formRef} className="relative z-10 flex flex-col px-6 py-6 sm:px-10 lg:px-14 lg:py-10">
          <div data-reveal className="flex items-center justify-between">
            <Logo />
            <ModeToggle />
          </div>

          <div className="flex flex-1 items-center py-10">
            <div className="w-full max-w-sm">{children}</div>
          </div>

          <p data-reveal className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            © {new Date().getFullYear()} t3.chat · Made for curious people
          </p>
        </div>

        {/* Story on halftone */}
        <section
          aria-label="About t3.chat"
          className="relative order-first h-44 overflow-hidden border-b border-border text-foreground sm:h-56 lg:order-none lg:h-auto lg:border-b-0 lg:border-l"
        >
          <HalftoneField className="absolute inset-0 size-full text-foreground/90" />

          <div
            ref={storyRef}
            className="pointer-events-none absolute inset-x-0 bottom-0 hidden bg-gradient-to-t from-card via-card/85 to-transparent p-10 pt-32 lg:block xl:p-12 xl:pt-36"
          >
            <p data-reveal className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              A new kind of chat
            </p>
            <h2 data-reveal className="mt-3 font-serif text-6xl leading-[0.95] tracking-tight">
              Introducing
              <br />
              <em>t3.chat.</em>
            </h2>
            <p data-reveal className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              Not another tab of the same assistant. One quiet workspace where every
              leading model answers, streams, and remembers the conversation for you.
            </p>
            <dl data-reveal className="mt-7 grid max-w-md grid-cols-2 gap-x-8 gap-y-4">
              {SPECS.map(([term, value]) => (
                <div key={term}>
                  <dt className="font-mono text-[10px] font-medium uppercase tracking-[0.16em]">{term}</dt>
                  <dd className="mt-0.5 font-mono text-xs text-muted-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </div>
    </div>
  );
}
