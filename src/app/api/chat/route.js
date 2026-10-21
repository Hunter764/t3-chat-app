import { convertToModelMessages, streamText } from "ai";

import db from "@/lib/db";
import { MessageRole, MessageType } from "@prisma/client";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { CHAT_SYSTEM_PROMPT } from "@/lib/prompt";
import { storedMessageToUI, textPartsOnly } from "@/lib/messages";
import { currentUser } from "@/modules/authentication/actions";

export const maxDuration = 60;

function jsonError(message, status){
    return Response.json({ error: message }, { status });
}

export async function POST(req){
    try{
        const user = await currentUser();
        if(!user) return jsonError("Unauthorized", 401);

        if(!process.env.OPENROUTER_API_KEY){
            return jsonError("OPENROUTER_API_KEY is not configured on the server", 500);
        }

        const { chatId, model, trigger, message } = await req.json();

        if(!chatId || !model){
            return jsonError("chatId and model are required", 400);
        }

        // Ownership check and history load run together (one round trip). The history query
        // is scoped to the owner too, so a chat that isn't theirs yields nothing.
        const [chat, storedMessages] = await Promise.all([
            db.chat.findFirst({ where: { id: chatId, userId: user.id }, select: { id: true } }),
            db.message.findMany({
                where:{ chatId, chat: { userId: user.id } },
                orderBy:{ createdAt:"asc" }
            }),
        ]);
        if(!chat) return jsonError("Chat not found", 404);

        // Writes that don't affect the answer run while the model is already working.
        let pendingWrite = Promise.resolve();

        if(trigger === "submit-message"){
            const parts = (message?.parts ?? []).filter(p => p.type === "text" && p.text?.trim());
            if(message?.role !== "user" || parts.length === 0){
                return jsonError("A non-empty user message is required", 400);
            }

            const content = JSON.stringify(parts.map(p => ({ type: "text", text: p.text })));
            pendingWrite = db.message.create({
                data:{
                    chatId,
                    content,
                    messageRole: MessageRole.USER,
                    messageType: MessageType.NORMAL,
                    model,
                }
            });
            // The history the model sees includes the new message right away.
            storedMessages.push({ id: "pending-user-message", messageRole: MessageRole.USER, content });
        }else if(trigger === "regenerate-message"){
            // Retry: drop the previous answer, then answer the last user message again.
            const last = storedMessages.at(-1);
            if(last?.messageRole === MessageRole.ASSISTANT){
                pendingWrite = db.message.delete({ where: { id: last.id } });
                storedMessages.pop();
            }
        }else{
            return jsonError("Unsupported trigger", 400);
        }
        // Never an unhandled rejection: a failed write is logged and the answer still streams.
        const writeResult = pendingWrite.then(() => null, (error) => {
            console.error("❌ Error saving the user message:", error);
            return error;
        });

        const uiMessages = storedMessages
            .map(storedMessageToUI)
            .filter(msg => msg !== null)
            .map(textPartsOnly)
            .filter(msg => msg.parts.length > 0);

        if(uiMessages.length === 0 || uiMessages.at(-1).role !== "user"){
            return jsonError("Nothing to respond to", 400);
        }

        const provider = createOpenRouter({ apiKey: process.env.OPENROUTER_API_KEY });

        const result = streamText({
            model: provider.chat(model),
            system: CHAT_SYSTEM_PROMPT,
            messages: await convertToModelMessages(uiMessages),
            abortSignal: req.signal,
        });

        return result.toUIMessageStreamResponse({
            originalMessages: uiMessages,
            sendReasoning: true,
            // Lets the UI label the answer with the model that wrote it.
            messageMetadata: ({ part }) => (part.type === "start" ? { model } : undefined),
            onFinish: async ({ responseMessage }) => {
                try{
                    // The user message / delete must land before the answer, to keep the order.
                    await writeResult;

                    const parts = responseMessage.parts.filter(
                        part => (part.type === "text" || part.type === "reasoning") && part.text?.trim()
                    ).map(part => ({ type: part.type, text: part.text }));

                    if(!parts.some(part => part.type === "text")) return;

                    await db.message.create({
                        data:{
                            chatId,
                            content: JSON.stringify(parts),
                            messageRole: MessageRole.ASSISTANT,
                            messageType: MessageType.NORMAL,
                            model,
                        }
                    });
                    await db.chat.update({ where: { id: chatId }, data: { updatedAt: new Date() } });
                }catch(error){
                    console.error("❌ Error saving messages:", error);
                }
            },
            onError: (error) => {
                console.error("❌ Streaming error:", error);
                return error?.message || "The model failed to respond";
            },
        });
    }catch(error){
        console.error("❌ API Route error:", error);
        return jsonError(error.message || "Internal Server Error", 500);
    }
}
