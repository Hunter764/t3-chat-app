import { cn } from "@/lib/utils";

// Wordmark + glyph drawn with currentColor, so it follows the active theme.
export function Logo({ className, showWordmark = true }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-foreground", className)}>
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <path
          d="M5 4.5h14A1.5 1.5 0 0 1 20.5 6v9a1.5 1.5 0 0 1-1.5 1.5h-6.2L8.6 20.2a.5.5 0 0 1-.85-.36V16.5H5A1.5 1.5 0 0 1 3.5 15V6A1.5 1.5 0 0 1 5 4.5Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <circle cx="8.5" cy="10.5" r="1.1" fill="currentColor" />
        <circle cx="12" cy="10.5" r="1.1" fill="currentColor" />
        <circle cx="15.5" cy="10.5" r="1.1" fill="currentColor" />
      </svg>
      {showWordmark && (
        <span className="font-mono text-[15px] font-medium tracking-tight">
          t3<span className="text-muted-foreground">.</span>chat
        </span>
      )}
    </span>
  );
}
