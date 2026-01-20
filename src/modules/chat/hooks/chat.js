import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { createChatWithMessage, deleteChat } from '../actions';
import { use } from 'react';


export const useCreateChat = ()=>{
    const queryClient = useQueryClient();

    const router = useRouter();

    return useMutation({
        mutationFn:(values)=> createChatWithMessage(values),

        onSuccess:(res) => {
            //add optimistic ui
            if(res.success && res.data){
                const chat = res.data;

                queryClient.invalidateQueries(['chats']);

                router.push(`/chat/${chat.id}?autoTrigger= true`)
            }
        },

        onError:(error) => {
            console.error("Create chat  error");
            toast.error("Failed to create chat ")
        },
    });
};


 export const useDeleteCht = (chatId) => {
    const queryClient = useQueryClient();

    const router = useRouter();

    return useMutation({
        mutationFn:() => deleteChat(chatId),
        onSuccess:(res) => {
            if (res.success) {
                queryClient.invalidateQueries(['chats']);
                router.push('/');
                toast.success("Chat deleted successfully");
            } else {
                toast.error(res.message || "Failed to delete chat");
            }
        },
        onError:(error)=>{
            console.error("Delete chat error:", error);
            toast.error("Failed to delete chat");
        }
    })
 }