import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Code, GraduationCap, Newspaper, Sparkles } from "lucide-react";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

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

  return (
    <div className="flex flex-col items-center justify-center w-full px-6 py-8">
      <div className="w-full max-w-3xl space-y-8">
        {/* Welcome Header */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">
            How can I help you today
            {userName && (
              <span className="text-primary">, {userName.split(' ')[0]}</span>
            )}?
          </h1>
          <p className="text-base text-muted-foreground">
            Choose a category or start typing your message below
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {CHAT_TAB_MESSAGE.map((tab, index) => (
            <Button
              key={tab.tabName}
              variant={activeTab === index ? "default" : "outline"}
              onClick={() => setActiveTab(index)}
              className={cn(
                "h-10 px-4 gap-2 font-medium transition-all",
                activeTab === index && "shadow-sm"
              )}
            >
              {tab.icon}
              {tab.tabName}
            </Button>
          ))}
        </div>

        {/* Suggestions */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground px-1">
            Suggestions
          </h3>
          <div className="grid gap-2">
            {CHAT_TAB_MESSAGE[activeTab].messages.map((message, index) => (
              <button
                key={index}
                onClick={() => onMessageSelect(message)}
                className="w-full text-left px-4 py-3.5 text-sm bg-card hover:bg-accent border border-border rounded-lg transition-colors group"
              >
                <span className="line-clamp-2 group-hover:text-foreground">
                  {message}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWelcomeTabs;