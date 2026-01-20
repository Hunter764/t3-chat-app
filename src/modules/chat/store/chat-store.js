import { add } from 'date-fns';
import {create} from 'zustand';

export const useChatStore = create((set,get)=>({
    chats:[],
    activeChatId: null,
    messages:[],



    setChats:(chats)=> set({chats}),
    setMessages:(messages)=> set({messages}),
    setActiveAChatId:(chatId)=>set({activeChatId: chatId}),

    //Add new Chat on create
    addChat: (chat) => set({chats: [chat, ...get().chats]}),

    // Append a new message (user or assitant)
    addMessage: (message) => set({messages: [...get().messages, message]}),

    //clear messages when switchin chat

    clearMessages:() => set({messages: []}),
}));