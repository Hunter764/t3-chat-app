import {create} from 'zustand';

export const useChatStore = create((set,get)=>({
    activaChatId: null,

    setActiveAChatId:(chatId)=>set({activeChatId: chatId})
}))