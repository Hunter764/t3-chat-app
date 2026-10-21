import { ArrowUpRight, Code, GraduationCap, Newspaper, Sparkles } from "lucide-react";
import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useReveal } from "@/lib/motion";

const CHAT_TAB_MESSAGE = [
  {
    tabName: "Create",
    icon: <Sparkles className="h-4 w-4" />,
    messages: [
      "Write a short story about a robot discovering emotions",
      "Help me outline a sci-fi novel set in a post-apocalyptic world",
      "Create a character profile for a complex villain with sympathetic motives",
      "Give me 5 creative writing prompts for flash fiction",
    ],
  },
  {
    tabName: "Explore",
    icon: <Newspaper className="h-4 w-4" />,
    messages: [
      "Good books for fans of Rick Rubin",
      "Countries ranked by number of corgis",
      "Most successful companies in the world",
      "How much does Claude cost?",
    ],
  },
  {
    tabName: "Code",
    icon: <Code className="h-4 w-4" />,
    messages: [
      "Write code to invert a binary search tree in Python",
      "What is the difference between Promise.all and Promise.allSettled?",
      "Explain React's useEffect cleanup function",
      "Best practices for error handling in async/await",
    ],
  },
  {
    tabName: "Learn",
    icon: <GraduationCap className="h-4 w-4" />,
    messages: [
      "Beginner's guide to TypeScript",
      "Explain the CAP theorem in distributed systems",
      "Why is AI so expensive?",
      "Are black holes real?",
    ],
  },
];
const greetingFor = (date) => {
  const hour = date.getHours();
  if (hour < 5) return "Up late";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const ChatWelcomeTabs = ({ userName, onMessageSelect }) => {
  const [activeTab, setActiveTab] = useState(0);
  const introRef = useRef(null);
  const listRef = useRef(null);

  // Intro lines rise in once; prompt cards re-stagger whenever the category changes.
  useReveal(introRef, "[data-reveal]", { y: 12, step: 80, duration: 520 });
  useReveal(listRef, "[data-suggestion]", { y: 10, step: 55, duration: 420 }, activeTab);

  // Rendered in the visitor's local time; the server's guess may differ, hence the
  // suppressHydrationWarning on the two time-dependent texts.
  const now = new Date();
  const dateLabel = now.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
  const firstName = userName?.split(" ")[0];
  const tab = CHAT_TAB_MESSAGE[activeTab];

  return (
    <div className="flex w-full flex-col items-center justify-center px-5 py-10 sm:px-6">
      <div className="w-full max-w-2xl space-y-10">
        <div ref={introRef} className="space-y-4">
          <p data-reveal suppressHydrationWarning className="label-mono">
            {dateLabel} · New chat
          </p>
          <h1 data-reveal className="font-serif text-5xl font-normal leading-[0.95] tracking-tight sm:text-6xl">
            <span suppressHydrationWarning>{greetingFor(now)}</span>,
            <br />
            <em>{firstName || "friend"}.</em>
          </h1>
          <p data-reveal className="max-w-md text-base leading-relaxed text-muted-foreground">
            Ask anything. Start from one of these, or write your own below — every model is a click away.
          </p>
        </div>

        <div className="space-y-4">
          <div role="tablist" aria-label="Prompt categories" className="flex flex-wrap gap-1.5">
            {CHAT_TAB_MESSAGE.map((item, index) => (
              <button
                key={item.tabName}
                type="button"
                role="tab"
                aria-selected={activeTab === index}
                onClick={() => setActiveTab(index)}
                className={cn(
                  "inline-flex h-8 items-center gap-1.5 rounded-full border px-3.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors duration-150 [&_svg]:size-3.5",
                  activeTab === index
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border-strong text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                {item.icon}
                {item.tabName}
              </button>
            ))}
          </div>

          <ul ref={listRef} className="grid gap-3 sm:grid-cols-2">
            {tab.messages.map((message, index) => (
              <li key={message} data-suggestion>
                <button
                  type="button"
                  onClick={() => onMessageSelect(message)}
                  className="group flex h-full w-full flex-col gap-3 rounded-xl border border-border-strong bg-card p-4 text-left shadow-press transition-[transform,box-shadow,background-color] duration-200 ease-out hover:-translate-y-0.5 hover:bg-popover hover:shadow-md active:translate-y-0 active:shadow-none"
                >
                  <span className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    {tab.tabName} · 0{index + 1}
                    <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                  <span className="text-[15px] leading-snug">{message}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChatWelcomeTabs;
