"use client";

import Modal from "@/components/ui/modal";
import { useDeleteChat } from "../../hooks/chat";
import React from "react";
import { toast } from "sonner";

const DeleteChatModal = ({ isModalOpen, setIsModalOpen, chatId }) => {
  const { mutateAsync, isPending } = useDeleteChat(chatId);

  const handleDelete = async () => {
    try {
      await mutateAsync();
      setIsModalOpen(false);
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
      <p className="text-sm text-zinc-500">
        Once deleted, you will not be able to recover this chat.
      </p>
    </Modal>
  );
};


export default DeleteChatModal;