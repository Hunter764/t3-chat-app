"use client";

import { useEffect } from "react";
import { useChatStore } from "@/modules/chat/store/chat-store";

// Keeps the sidebar highlight in sync with the chat that is open.
const ActiveChatLoader = ({chatId}) => {
    const setActiveAChatId = useChatStore((state) => state.setActiveAChatId);

    useEffect(()=>{
        if(!chatId) return;

        setActiveAChatId(chatId);
        return () => setActiveAChatId(null);
    }, [chatId, setActiveAChatId]);

    return null;
}

export default ActiveChatLoader
