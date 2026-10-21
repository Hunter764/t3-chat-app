"use client"
import React from 'react'
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useEffect, useLayoutEffect, useMemo, useRef } from "react";

import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  PromptInput,
  PromptInputBody,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  PromptInputFooter,
} from "@/components/ai-elements/prompt-input";
import { Response } from "@/components/ai-elements/response";

import { Spinner } from "@/components/ui/spinner";
import { ModelSelector } from "@/modules/chat/components/model-selector";
import { useAIModels } from "@/modules/ai-agent/hook/ai-agent";
import { useChatStore } from "@/modules/chat/store/chat-store";
import { storedMessageToUI } from "@/lib/messages";
import { useSearchParams } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

import { CheckIcon, CopyIcon, RotateCcwIcon } from "lucide-react";
import { reveal } from "@/lib/motion";

// Messages that arrive after the page loaded rise in; the loaded history just appears.
const MessageEnter = ({ animate, children }) => {
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (!animate || !ref.current) return;
    const animation = reveal(ref.current, { y: 8, step: 0, duration: 320 });
    return () => animation?.revert();
  }, [animate]);

  return <div ref={ref}>{children}</div>;
};

const AssistantMark = () => (
  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg border border-border-strong bg-card shadow-press [&_svg]:size-4">
    <Logo showWordmark={false} />
  </span>
);

// 3x3 grid of blinking pixels: the retro "thinking" indicator.
const PixelLoader = () => (
  <span className="grid grid-cols-3 gap-[2px]" aria-hidden="true">
    {[0, 1, 2, 5, 8, 7, 6, 3, 4].map((order, i) => (
      <span
        key={i}
        className="animate-pixel size-[5px] rounded-[1px] bg-foreground"
        style={{ animationDelay: `${order * 110}ms` }}
      />
    ))}
  </span>
);

const ActionButton = ({ label, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    title={label}
    className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground [&_svg]:size-3.5"
  >
    {children}
  </button>
);

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  return (
    <ActionButton
      label={copied ? "Copied" : "Copy"}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          // Clipboard can be unavailable (permissions / insecure context): nothing to do.
        }
      }}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </ActionButton>
  );
};

const ChatConversation = ({ chat }) => {
  const chatId = chat.id;

  const { data: models, isPending: isModelLoading } = useAIModels();
  const { hasChatBeenTriggered, markChatAsTriggered } = useChatStore();

  const [selectedModel, setSelectedModel] = useState(chat.model);

  const hasAutoTriggered = useRef(false);
  const searchParams = useSearchParams();
  const shouldAutoTrigger = searchParams.get("autoTrigger") === "true";

  // Loaded once: useChat owns the message list from here on.
  const [initialMessages] = useState(() =>
    chat.messages.map(storedMessageToUI).filter(Boolean)
  );

  // The server keeps the history in the database, so only the newest message is sent.
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        prepareSendMessagesRequest: ({ messages, body, trigger }) => ({
          body: {
            ...body,
            chatId,
            trigger,
            message: trigger === "submit-message" ? messages.at(-1) : undefined,
          },
        }),
      }),
    [chatId]
  );

  const loadedIds = useMemo(() => new Set(initialMessages.map((m) => m.id)), [initialMessages]);

  const { stop, messages, status, error, sendMessage, regenerate } = useChat({
    id: chatId,
    messages: initialMessages,
    transport,
  });

  // A chat created from the home page only has the user message: ask the model to answer it.
  useEffect(() => {
    if (hasAutoTriggered.current) return;
    if (!shouldAutoTrigger) return;
    if (hasChatBeenTriggered(chatId)) return;
    if (!selectedModel) return;
    if (initialMessages.length === 0) return;

    if (initialMessages.at(-1).role !== "user") return;

    hasAutoTriggered.current = true;
    markChatAsTriggered(chatId);

    regenerate({ body: { model: selectedModel } });
    // Drop ?autoTrigger without asking the server to render the page again.
    window.history.replaceState(null, "", `/chat/${chatId}`);
  }, [
    shouldAutoTrigger,
    chatId,
    selectedModel,
    initialMessages,
    regenerate,
    hasChatBeenTriggered,
    markChatAsTriggered,
  ]);

  const isBusy = status === "submitted" || status === "streaming";

  const handleSubmit = ({ text }) => {
    if (!text?.trim() || isBusy || !selectedModel) return;

    sendMessage({ text }, { body: { model: selectedModel } });
  };

  const handleRetry = () => {
    if (!selectedModel || isBusy) return;
    regenerate({ body: { model: selectedModel } });
  };

  const modelNames = useMemo(
    () => new Map((models?.models ?? []).map((m) => [m.id, m.name.split(": ").at(-1)])),
    [models]
  );
  const labelFor = (id) => (id ? modelNames.get(id) ?? id : "Assistant");
  const lastMessageId = messages.at(-1)?.id;

  return (
    <div className='flex h-full min-h-0 flex-col'>
      <Conversation className="min-h-0">
        <ConversationContent className="mx-auto w-full max-w-3xl gap-8 px-4 py-8 sm:px-6">
          {messages.map((message) => {
            const animateIn = !loadedIds.has(message.id);

            if (message.role === "user") {
              const text = message.parts.filter((p) => p.type === "text").map((p) => p.text).join("\n");
              return (
                <MessageEnter key={message.id} animate={animateIn}>
                  <div className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-br-md border border-border bg-secondary px-4 py-2.5 text-[15px] leading-relaxed text-secondary-foreground">
                      <Response>{text}</Response>
                    </div>
                  </div>
                </MessageEnter>
              );
            }

            const isLast = message.id === lastMessageId;
            const streamingThis = isLast && status === "streaming";
            const text = message.parts.filter((p) => p.type === "text").map((p) => p.text).join("\n\n");

            return (
              <MessageEnter key={message.id} animate={animateIn}>
                <div className="group/msg flex gap-3">
                  <AssistantMark />
                  <div className="min-w-0 flex-1 space-y-3">
                    <p className="pt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                      {labelFor(message.metadata?.model ?? chat.model)}
                    </p>

                    {message.parts.map((part, i) => {
                      if (part.type === "reasoning") {
                        return (
                          <Reasoning
                            key={`${message.id}-${i}`}
                            className="w-full rounded-xl border border-dashed border-border-strong bg-card/60 px-3.5 py-2.5"
                            isStreaming={streamingThis && part.state === "streaming"}
                          >
                            <ReasoningTrigger className="font-mono text-xs" />
                            <ReasoningContent className="mt-2 text-sm text-muted-foreground">
                              {part.text}
                            </ReasoningContent>
                          </Reasoning>
                        );
                      }
                      if (part.type === "text") {
                        return (
                          <div key={`${message.id}-${i}`} className="text-[15px] leading-relaxed">
                            <Response>{part.text}</Response>
                          </div>
                        );
                      }
                      return null;
                    })}

                    {streamingThis && (
                      <span aria-hidden="true" className="animate-caret inline-block h-4 w-2 translate-y-0.5 bg-foreground" />
                    )}

                    {!streamingThis && text && (
                      <div className="flex items-center gap-0.5 opacity-100 transition-opacity md:opacity-0 md:group-hover/msg:opacity-100 md:focus-within:opacity-100">
                        <CopyButton text={text} />
                        {isLast && !isBusy && (
                          <ActionButton label="Regenerate" onClick={handleRetry}>
                            <RotateCcwIcon />
                          </ActionButton>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </MessageEnter>
            );
          })}

          {status === "submitted" && (
            <div role="status" className="flex items-center gap-3">
              <AssistantMark />
              <span className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
                <PixelLoader />
                Thinking · {labelFor(selectedModel)}
              </span>
            </div>
          )}

          {error && (
            <div role="alert" className="flex items-start justify-between gap-4 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <span>{error.message || "Something went wrong while generating a response."}</span>
              <button type="button" onClick={handleRetry} className="shrink-0 font-mono text-xs underline underline-offset-4">
                Try again
              </button>
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="mx-auto w-full max-w-3xl shrink-0 px-4 pb-4 sm:px-6 sm:pb-5">
        <PromptInput
          onSubmit={handleSubmit}
          className={cn(
            "[&_[data-slot=input-group]]:rounded-2xl [&_[data-slot=input-group]]:border-border-strong [&_[data-slot=input-group]]:bg-card! [&_[data-slot=input-group]]:shadow-press",
            "[&_[data-slot=input-group]]:transition-shadow has-[textarea:focus-visible]:[&_[data-slot=input-group]]:border-ring"
          )}
        >
          <PromptInputBody>
            <PromptInputTextarea
              placeholder="Reply to t3.chat…"
              aria-label="Message"
              className="text-[15px]"
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools className="flex min-w-0 items-center gap-2">
              {isModelLoading || !models?.models ? (
                <Spinner className="ml-2 size-4" />
              ) : (
                <ModelSelector
                  models={models?.models}
                  selectedModelId={selectedModel}
                  onModelSelect={setSelectedModel}
                />
              )}
            </PromptInputTools>

            <PromptInputSubmit status={status} onStop={stop} className="rounded-lg" />
          </PromptInputFooter>
        </PromptInput>
        <p className="mt-2 hidden text-center font-mono text-[11px] text-muted-foreground sm:block">
          Enter to send · Shift + Enter for a new line
        </p>
      </div>
    </div>
  )
}

const MessageWithForm = ({chat, notFoundMessage}) => {
  if(!chat){
    return (
      <div className='flex h-full items-center justify-center font-mono text-sm text-muted-foreground'>
        {notFoundMessage || "Chat not found"}
      </div>
    )
  }

  return <ChatConversation key={chat.id} chat={chat} />
}

export default MessageWithForm
