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
const ChatWelcomeTabs = ({ userName, onMessageSelect }) => {
  const [activeTab, setActiveTab] = useState(0);
  const introRef = useRef(null);
  const listRef = useRef(null);

  // Intro lines rise in once; suggestions re-stagger whenever the category changes.
  useReveal(introRef, "[data-reveal]", { y: 10, step: 70 });
  useReveal(listRef, "[data-suggestion]", { y: 6, step: 45, duration: 360 }, activeTab);

  return (
    <div className="flex w-full flex-col items-center justify-center px-5 py-10 sm:px-6">
      <div className="w-full max-w-2xl space-y-10">
        <div ref={introRef} className="space-y-3">
          <p data-reveal className="label-mono">New chat</p>
          <h1 data-reveal className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            How can I help you today
            {userName && (
              <span className="text-muted-foreground">, {userName.split(' ')[0]}</span>
            )}
            ?
          </h1>
          <p data-reveal className="text-base text-muted-foreground">
            Pick a starting point, or just write your message below.
          </p>
        </div>

        <div className="space-y-4">
          <div
            role="tablist"
            aria-label="Prompt categories"
            className="grid w-full grid-cols-4 gap-1 rounded-lg border border-border bg-card p-1 shadow-xs sm:inline-flex sm:w-auto"
          >
            {CHAT_TAB_MESSAGE.map((tab, index) => (
              <button
                key={tab.tabName}
                type="button"
                role="tab"
                aria-selected={activeTab === index}
                onClick={() => setActiveTab(index)}
                className={cn(
                  "inline-flex h-8 items-center justify-center gap-2 rounded-md px-2 text-sm font-medium transition-colors duration-150 sm:px-3",
                  activeTab === index
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <span className="hidden sm:inline-flex">{tab.icon}</span>
                {tab.tabName}
              </button>
            ))}
          </div>

          <ul ref={listRef} className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
            {CHAT_TAB_MESSAGE[activeTab].messages.map((message) => (
              <li key={message} data-suggestion>
                <button
                  type="button"
                  onClick={() => onMessageSelect(message)}
                  className="group flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left text-sm transition-colors duration-150 hover:bg-accent"
                >
                  <span className="line-clamp-2">{message}</span>
                  <ArrowUpRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-[opacity,transform] duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 group-focus-visible:opacity-100" />
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
