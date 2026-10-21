"use client";

import Modal from "@/components/ui/modal";
import { useDeleteChat } from "../../hooks/chat";
import React from "react";
import { useRouter } from "next/navigation";
import { useChatStore } from "../../store/chat-store";

const DeleteChatModal = ({ isModalOpen, setIsModalOpen, chatId }) => {
  const { mutateAsync, isPending } = useDeleteChat(chatId);
  const router = useRouter();
  const activeChatId = useChatStore((state) => state.activeChatId);

  const handleDelete = async () => {
    try {
      const res = await mutateAsync();
      if (res?.success) {
        setIsModalOpen(false);
        // The open chat no longer exists, so leave it.
        if (activeChatId === chatId) {
          router.push("/");
        }
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  return (
    <Modal
      title="Delete Chat"
      description="Are you sure you want to delete this chat? This action cannot be undone."
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSubmit={handleDelete}
      submitText={isPending ? "Deleting..." : "Delete"}
      submitVariant="destructive"
    >
      <p className="text-sm text-muted-foreground">
        Once deleted, you will not be able to recover this chat.
      </p>
    </Modal>
  );
};


export default DeleteChatModal;