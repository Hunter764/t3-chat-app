"use client"
import React from 'react'
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Fragment, useState, useEffect, useLayoutEffect, useMemo, useRef } from "react";

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
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
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

import { RotateCcwIcon } from "lucide-react";
import { reveal } from "@/lib/motion";

// Messages that arrive after the page loaded rise in; the loaded history just appears.
const MessageEnter = ({ animate, children }) => {
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (!animate || !ref.current) return;
    const animation = reveal(ref.current, { y: 8, step: 0, duration: 320 });
    return () => animation?.revert();
  }, [animate]);

  return <div ref={ref} className="flex flex-col gap-4">{children}</div>;
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
    if (!selectedModel) return;
    regenerate({ body: { model: selectedModel } });
  };

  return (
    <div className='flex h-full min-h-0 flex-col'>
      <Conversation className="min-h-0">
        <ConversationContent className="mx-auto w-full max-w-3xl gap-6 px-4 py-6 sm:px-6">
          {
            messages.length === 0 ? (
              <p className='py-24 text-center text-sm text-muted-foreground'>
                Start a conversation…
              </p>
            ):(
              messages.map((message)=>(
                <MessageEnter key={message.id} animate={!loadedIds.has(message.id)}>
                  {
                    message.parts.map((part,i)=>{
                      switch(part.type){
                        case "text":
                          return(
                            <Message from ={message.role} key={`${message.id}-${i}`}>
                              <MessageContent className="text-[15px] leading-relaxed group-[.is-user]:rounded-2xl group-[.is-user]:px-4 group-[.is-user]:py-2.5">
                                <Response>
                                  {part.text}
                                </Response>
                              </MessageContent>
                            </Message>
                          );

                        case "reasoning":
                          return(
                            <Reasoning className="w-full max-w-2xl rounded-lg border border-border bg-card px-3.5 py-2.5"
                              key={`${message.id}-${i}`}
                              isStreaming={status === "streaming" && part.state === "streaming"}
                            >
                              <ReasoningTrigger/>

                              <ReasoningContent className="mt-2 text-sm text-muted-foreground">
                                {part.text}
                              </ReasoningContent>
                            </Reasoning>
                          );

                        default:
                          return null;
                      }
                    })
                  }
                </MessageEnter>
              ) )
            )
          }
          {
            status === "submitted" &&(
              <div role="status" className='flex items-center gap-2 font-mono text-xs text-muted-foreground'>
                <span className="flex gap-1" aria-hidden="true">
                  <span className="size-1.5 animate-pulse rounded-full bg-current" />
                  <span className="size-1.5 animate-pulse rounded-full bg-current [animation-delay:150ms]" />
                  <span className="size-1.5 animate-pulse rounded-full bg-current [animation-delay:300ms]" />
                </span>
                Thinking
              </div>
            )
          }
          {
            error && (
              <div role="alert" className='rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive'>
                {error.message || "Something went wrong while generating a response."}
              </div>
            )
          }
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="mx-auto w-full max-w-3xl shrink-0 px-4 pb-4 sm:px-6 sm:pb-5">
        <PromptInput
          onSubmit={handleSubmit}
          className="[&_[data-slot=input-group]]:rounded-xl [&_[data-slot=input-group]]:border-border [&_[data-slot=input-group]]:bg-card! [&_[data-slot=input-group]]:shadow-sm"
        >
          <PromptInputBody>
            <PromptInputTextarea
              placeholder="Message t3.chat…"
              aria-label="Message"
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools className={"flex items-center gap-2"}>
              {
                isModelLoading || !models?.models ? (<Spinner className="ml-2 size-4"/>) : (<ModelSelector
                  models={models?.models}
                  selectedModelId={selectedModel}
                  onModelSelect={setSelectedModel}
                />)
              }
              {
                !isBusy && messages.length > 0 && (
                  <PromptInputButton onClick={handleRetry}>
                    <RotateCcwIcon size ={14}/>
                    <span>Retry</span>
                  </PromptInputButton>
                )
              }
            </PromptInputTools>

            <PromptInputSubmit status={status} onStop={stop}/>
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  )
}

const MessageWithForm = ({chat, notFoundMessage}) => {
  if(!chat){
    return (
      <div className='flex h-full items-center justify-center text-sm text-muted-foreground'>
        {notFoundMessage || "Chat not found"}
      </div>
    )
  }

  return <ChatConversation key={chat.id} chat={chat} />
}

export default MessageWithForm
