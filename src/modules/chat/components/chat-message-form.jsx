"use client";

import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAIModels } from "@/modules/ai-agent/hook/ai-agent";
import { useCreateChat } from "@/modules/chat/hooks/chat";

import React from "react";
import { Spinner } from "@/components/ui/spinner";
import { ModelSelector } from "./model-selector";
import { toast } from "sonner";

const ChatMessageForm = ({ initialMessage }) => {
  const { data: models, isPending } = useAIModels();
  const [pickedModel, setPickedModel] = useState(null);
  const [message, setMessage] = useState("");
  // Until the user picks a model, default to a free one (works without OpenRouter credits).
  const defaultModel =
    models?.models?.find((m) => m.id.endsWith(":free"))?.id ?? models?.models?.[0]?.id ?? null;
  const selectedModel = pickedModel ?? defaultModel;
  const { mutateAsync, isPending: isChatPending } = useCreateChat();

  // Fill the textarea when a suggestion is picked on the welcome tabs.
  const [lastInitialMessage, setLastInitialMessage] = useState(initialMessage);
  if (initialMessage !== lastInitialMessage) {
    setLastInitialMessage(initialMessage);
    if (initialMessage) {
      setMessage(initialMessage);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || isChatPending) return;

    if (!selectedModel) {
      toast.error("Please select a model first");
      return;
    }

    try {
      // The hook shows an error toast and navigates to the new chat on success.
      const res = await mutateAsync({content:message, model:selectedModel});
      if (res?.success) {
        setMessage("");
      }
    } catch (error) {
      console.error("Error in sending message:", error);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <form onSubmit={handleSubmit}>
        <div className="rounded-2xl border border-border-strong bg-card shadow-press transition-[border-color,box-shadow] duration-200 focus-within:border-ring focus-within:shadow-md">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask anything…"
            aria-label="Message"
            className="max-h-52 min-h-[72px] resize-none rounded-b-none border-0 bg-transparent px-4 py-3.5 text-base shadow-none focus-visible:ring-0 dark:bg-transparent"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <div className="flex items-center justify-between gap-3 px-2.5 pb-2.5">
            <div className="flex min-w-0 items-center gap-2">
              {isPending || !models?.models ? (
                <Spinner className="ml-2 size-4 text-muted-foreground" />
              ) : (
                <ModelSelector
                  models={models?.models}
                  selectedModelId={selectedModel}
                  onModelSelect={setPickedModel}
                />
              )}
            </div>
            <Button
              type="submit"
              disabled={!message.trim() || isChatPending}
              size="icon"
              className="size-8 shrink-0 rounded-lg"
            >
              {isChatPending ? (
                <Spinner />
              ) : (
                <>
                  <ArrowUp />
                  <span className="sr-only">Send message</span>
                </>
              )}
            </Button>
          </div>
        </div>
        <p className="mt-2 hidden text-center font-mono text-[11px] text-muted-foreground sm:block">
          Enter to send · Shift + Enter for a new line
        </p>
      </form>
    </div>
  );
};

export default ChatMessageForm;
