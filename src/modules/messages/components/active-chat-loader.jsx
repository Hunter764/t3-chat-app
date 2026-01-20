"use client";

import { useEffect } from "react";
import { useChatStore } from "@/modules/chat/store/chat-store";
import { useChatById } from "@/modules/chat/hooks/chat";

const ActiveChatLoader = ({chatId}) => {
    const {setActiveAChatId, setMessages, addChat, chats} = useChatStore();

    const {data} = useChatById(chatId);

    useEffect(()=>{
        if(!chatId) return;

        setActiveAChatId(chatId);
    }, [chatId, setActiveAChatId]);

    useEffect(() => {
        if(!data || !data.success || !data.data) return;

        const chat = data.data;

        //populate messages
        setMessages(chat.messages || []);

        if(!chats.some((c) => c.id === chat.id)){
            addChat(chat);
        }
    }, [data, setMessages, addChat, chats]);
    

    return null;
}

export default ActiveChatLoader