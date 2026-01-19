"use client";

import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAIModels } from "@/modules/ai-agent/hook/ai-agent";
import { useCreateChat } from "@/modules/chat/hooks/chat";

import React from "react";
import { Spinner } from "@/components/ui/spinner";
import { ModelSelector } from "./model-selector";
import { toast } from "sonner";

const ChatMessageForm = ({ initialMessage, onMessageChange }) => {
  const { data: models, isPending } = useAIModels();
  const [selectedModel, setSelectedModel] = useState(models?.models[0]?.id || null);
  const [message, setMessage] = useState("");
  const { mutateAsync, isPending: isChatPending } = useCreateChat();

  useEffect(() => {
    if (initialMessage) {
      setMessage(initialMessage);
      onMessageChange?.(initialMessage);
    }
  }, [initialMessage, onMessageChange]);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      await mutateAsync({content:message, model:selectedModel});
      toast.success("Message sent successfully");
    } catch (error) {
      console.error("Error in sending message:", error);
      toast.error("Failed to send message");
    }
    finally{
      setMessage("");

    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-6 py-4">
      <form onSubmit={handleSubmit}>
        <div className="relative rounded-2xl border border-border bg-background shadow-sm hover:shadow-md transition-shadow">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="min-h-[70px] max-h-[200px] resize-none border-0 bg-transparent px-4 py-3 text-base focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-border">
            {/**Model selector */}
            <div className="flex items-center gap-2">
              {isPending ? (
                <>
                  <Spinner />
                </>
              ) : (
                <>
                  <ModelSelector
                    models={models?.models}
                    selectedModelId={selectedModel}
                    onModelSelect={setSelectedModel}
                    className="ml-1"
                  />
                </>
              )}
            </div>
            <Button
              type="submit"
              disabled={!message.trim() || isChatPending}
              size="icon"
              className={cn(
                "h-9 w-9 rounded-full transition-all",
                !message.trim() && "opacity-50",
              )}
            >
             { isChatPending ? <>
              <Spinner/>
             </> : <>
             <Send className="h-4 w-4" />
              <span className="sr-only">Send Message</span></> }
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatMessageForm;
