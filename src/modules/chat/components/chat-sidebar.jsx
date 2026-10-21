"use client";
import React, { useEffect, useRef } from "react";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useChatStore } from "../store/chat-store";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserButton from "@/modules/authentication/components/user-button";
import { Logo } from "@/components/brand/logo";

import { cn } from "@/lib/utils";
import { useReveal } from "@/lib/motion";
import { SearchIcon, EllipsisIcon, Trash, PlusIcon } from "lucide-react";
import DeleteChatModal from "./modal/chat-delete-modal";
import { searchChats } from "../actions";

const GROUPS = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "lastWeek", label: "Last 7 days" },
  { key: "older", label: "Older" },
];

const ChatSidebar = ({ user, chats, onNavigate }) => {
  const { activeChatId } = useChatStore();
  const router = useRouter();
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const listRef = useRef(null);

  // Rows fade in once when the sidebar first appears; later changes don't replay it.
  useReveal(listRef, "[data-chat-row]", { y: 4, step: 22, duration: 320 });

  // Titles are matched instantly in the browser; message contents are searched on the
  // server once the user pauses typing, so the sidebar never has to carry every message.
  const [debouncedQuery, setDebouncedQuery] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: contentMatches } = useQuery({
    queryKey: ["chat-search", debouncedQuery],
    queryFn: () => searchChats(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 30_000,
  });

  const filterChats = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return chats;
    }

    const matchedIds = new Set(debouncedQuery === searchQuery.trim() ? contentMatches : []);
    return chats.filter(
      (chat) => chat.title?.toLowerCase().includes(query) || matchedIds.has(chat.id),
    );
  }, [chats, searchQuery, debouncedQuery, contentMatches]);

  //Group chats by date(today , yesterday, inMonth, inYear)
  const groupedChats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const groups = {
      today: [],
      yesterday: [],
      lastWeek: [],
      older: [],
    };

    filterChats.forEach((chat) => {
      const chatDate = new Date(chat.updatedAt);

      if (chatDate >= today) {
        groups.today.push(chat);
      } else if (chatDate >= yesterday) {
        groups.yesterday.push(chat);
      } else if (chatDate >= lastWeek) {
        groups.lastWeek.push(chat);
      } else {
        groups.older.push(chat);
      }
    });

    return groups;
  }, [filterChats]);

  const onDelete = (chatId) => {
    setSelectedChatId(chatId);
    setIsModelOpen(true);
  };

  const renderChatList = (chatList) =>
    chatList.map((chat) => (
      <div key={chat.id} data-chat-row className="group/row relative">
        <Link
          href={`/chat/${chat.id}`}
          onClick={onNavigate}
          aria-current={chat.id === activeChatId ? "page" : undefined}
          className={cn(
            "relative block truncate rounded-md px-2.5 py-2 pr-9 text-sm text-sidebar-foreground/75 transition-colors duration-150",
            "hover:bg-sidebar-accent hover:text-sidebar-foreground",
            chat.id === activeChatId &&
              "bg-sidebar-accent font-medium text-sidebar-foreground before:absolute before:inset-y-2 before:left-0 before:w-[3px] before:rounded-full before:bg-brand",
          )}
        >
          {chat.title}
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Actions for ${chat.title}`}
              className={cn(
                "absolute right-1 top-1/2 size-7 -translate-y-1/2",
                "opacity-100 md:opacity-0 md:group-hover/row:opacity-100 md:focus-visible:opacity-100 data-[state=open]:opacity-100",
              )}
            >
              <EllipsisIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer"
              onSelect={() => onDelete(chat.id)}
            >
              <Trash />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ));

  return (
    <div className="flex h-full w-full flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-14 shrink-0 items-center px-4">
        <Link href="/" onClick={onNavigate} aria-label="t3.chat home">
          <Logo />
        </Link>
      </div>

      <div className="space-y-2 px-3 pb-3">
        <Button asChild className="w-full justify-center">
          <Link href="/" onClick={onNavigate}>
            <PlusIcon />
            New chat
          </Link>
        </Button>

        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search chats"
            aria-label="Search chats"
            className="h-9 pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <nav ref={listRef} aria-label="Chats" className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
        {filterChats.length === 0 ? (
          <p className="px-3 py-8 text-center text-sm text-muted-foreground">
            {searchQuery ? "No chats found" : "No chats yet"}
          </p>
        ) : (
          GROUPS.map(({ key, label }) =>
            groupedChats[key].length > 0 ? (
              <section key={key} className="mb-4">
                <h3 className="label-mono px-2.5 pb-1.5 pt-2">{label}</h3>
                <div className="space-y-px">{renderChatList(groupedChats[key])}</div>
              </section>
            ) : null,
          )
        )}
      </nav>

      <div className="flex shrink-0 items-center gap-2.5 border-t border-sidebar-border p-3">
        <UserButton user={user} size="sm" showMemberSince={false} onSettings={() => router.push("/account")} />
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-sm font-medium">{user?.name || "Account"}</p>
          <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      <DeleteChatModal
        chatId={selectedChatId}
        isModalOpen={isModelOpen}
        setIsModalOpen={setIsModelOpen}
      />
    </div>
  );
};

export default ChatSidebar;
