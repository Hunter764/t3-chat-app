import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createChatWithMessage, deleteChat } from "../actions";
import { toast } from "sonner";

export const useCreateChat = () => {
  const queryClient = useQueryClient();

  const router = useRouter();

  return useMutation({
    mutationFn: (values) => createChatWithMessage(values),
    onSuccess: (res) => {
      if (res.success && res.data) {
        queryClient.invalidateQueries({ queryKey: ["chats"] });

        router.push(`/chat/${res.data.id}?autoTrigger=true`);
      } else {
        toast.error(res.message || "Failed to create chat");
      }
    },
    onError: (error) => {
      console.error("Create chat error:", error);
      toast.error("Failed to create chat");
    },
  });
};


export const useDeleteChat = (chatId)=>{
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn:()=>deleteChat(chatId),
    onSuccess:(res)=>{
      if(res.success){
        queryClient.invalidateQueries({ queryKey: ["chats"] })
        toast.success("Chat deleted")
      }else{
        toast.error(res.message || "Failed to delete chat")
      }
    },
    onError:()=>{
      toast.error("Failed to delete chat")
    }
  })
}
