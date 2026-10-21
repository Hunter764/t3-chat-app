"use client"

import * as React from "react"
import { Sun, Moon, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"
import { pop } from "@/lib/motion"

const OPTIONS = [
    { value: "light", label: "Light", Icon: Sun },
    { value: "system", label: "System", Icon: Monitor },
    { value: "dark", label: "Dark", Icon: Moon },
]

const subscribe = () => () => {}

// Three-way switch: Light / System / Dark.
export function ModeToggle({ className }) {
    const { theme, setTheme } = useTheme();
    // false on the server and during hydration, true afterwards: avoids a mismatch
    // because the stored theme is only known in the browser.
    const mounted = React.useSyncExternalStore(subscribe, () => true, () => false);

    return(
        <div
            role="radiogroup"
            aria-label="Theme"
            className={cn("inline-flex items-center rounded-full border border-border bg-card p-0.5 shadow-xs", className)}
        >
            {OPTIONS.map(({ value, label, Icon }) => {
                const active = mounted && theme === value;
                return (
                    <button
                        key={value}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        aria-label={label}
                        title={label}
                        onClick={(e) => {
                            setTheme(value);
                            pop(e.currentTarget.querySelector("svg"));
                        }}
                        className={cn(
                            "inline-flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors duration-150",
                            "hover:text-foreground focus-visible:outline-2",
                            active && "bg-accent text-foreground"
                        )}
                    >
                        <Icon className="size-3.5" />
                    </button>
                );
            })}
        </div>
    );
}
