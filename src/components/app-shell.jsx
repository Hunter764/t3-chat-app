"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import ChatSidebar from "@/modules/chat/components/chat-sidebar";
import Header from "@/modules/chat/components/header";

// Desktop: fixed sidebar. Below `md`: the sidebar lives in a drawer opened from the header.
export function AppShell({ user, chats, children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <aside className="hidden w-72 shrink-0 md:block">
        <ChatSidebar user={user} chats={chats} />
      </aside>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-72 gap-0 p-0 sm:max-w-72 md:hidden">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetDescription className="sr-only">Your chats and account</SheetDescription>
          <ChatSidebar user={user} chats={chats} onNavigate={() => setMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <Header chats={chats} onMenu={() => setMenuOpen(true)} />
        <main className="min-h-0 flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
