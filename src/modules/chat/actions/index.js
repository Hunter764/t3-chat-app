"use server"

import db  from "@/lib/db"
import { currentUser } from "@/modules/authentication/actions"
import {MessageRole, MessageType} from "@prisma/client"
import { revalidatePath } from "next/cache"


export const createChatWithMessage = async (values) => {
    try{
        const user = await currentUser()
        if(!user) return{
            success: false,
            message : "Unauthorized user"
        }
        const {content , model} = values;

        if(!content || !content.trim()){
            return {success: false, message: "Message content is required"}
        }

        if(!model){
            return {success: false, message: "Please select a model"}
        }

        const title = content.slice(0, 50) + (content.length > 50 ? "..." : "")

        const chat = await db.chat.create({
            data:{
                title,
                model,
                userId: user.id,
                messages:{
                    create:{
                        // Stored as UI message parts, same format the chat API route saves.
                        content: JSON.stringify([{type: "text", text: content}]),
                        messageRole: MessageRole.USER,
                        messageType:MessageType.NORMAL,
                        model
                    }
                }
            },
        })

        revalidatePath("/", "layout");

        return {success: true, message:"Chat created successfully", data:chat}

    }catch(error){
        console.error("Error creating: ", error);
        return {success: false, message: "Failed to create chat"};
    }
}

export const getAllChats = async() => {
    try{
        const user = await currentUser();
        if(!user){
            return {
                success: false,
                message: "Unauthorized user"
            };
        }

        // Titles only: loading every message of every chat made this the slowest query.
        // Message-content search goes through searchChats() instead.
        const chats = await db.chat.findMany({
            where:{
                userId: user.id
            },
            select:{
                id: true,
                title: true,
                model: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy:{
                updatedAt:"desc"
            },
            take: 200,
        })

        return {
            success: true,
            message: "Chats fetched successfully",
            data: chats
        };
    }catch(error){
            console.error("Error fetching chats: ",error);
            return{
                success: false,
                message: "Failed to fetch chats"
            };
    }
};

// Ids of the user's chats whose messages contain `query` (title matching happens client-side).
export const searchChats = async(query) => {
    try{
        const user = await currentUser();
        const text = query?.trim();
        if(!user || !text || text.length < 2) return [];

        const chats = await db.chat.findMany({
            where:{
                userId: user.id,
                messages:{ some:{ content:{ contains: text, mode: "insensitive" } } }
            },
            select:{ id: true },
            take: 50,
        });

        return chats.map((chat) => chat.id);
    }catch(error){
        console.error("Error searching chats:",error);
        return [];
    }
}

export const getChatById = async(chatId) =>{
    const user = await currentUser();
    
    if(!user){
        return {
            success: false,
            message: "Unauthorized user"
        };
    }

    try{
        // Two independent queries run side by side: one network round trip instead of two.
        const [chat, messages] = await Promise.all([
            db.chat.findFirst({
                where:{
                    id:chatId,
                    userId: user.id
                },
            }),
            db.message.findMany({
                where:{
                    chatId,
                    chat:{ userId: user.id }
                },
                orderBy:{
                    createdAt:"asc"
                }
            }),
        ]);

        if(!chat){
            return{
                success: false,
                message: "Chat not found"
            };
        }

        return{
            success: true,
            message: "Chat fetched successfully",
            data: { ...chat, messages }
        }
    }catch(error){
        console.error("Error fetching chat by id:", error);
        return{
            success: false,
            message: "Failed to fetch chat"
        };
    }
}


export const deleteChat = async(chatId) => {
    try{
        const user = await currentUser();

        if(!user){
            return {
                success: false,
                message: "Unauthorized user"
            };
        }

        const chat = await db.chat.findFirst({
            where:{
                id: chatId,
                userId: user.id
            }
        });

        if(!chat){
            return{
                success: false,
                message: "Chat not found"
            };
        }

        await db.chat.delete({
            where:{
                id:chatId
            }
        })

        revalidatePath("/", "layout");

        return{
            success: true,
            message: "Chat deleted successfully"
        }
    }catch(error){
        console.error("Error deleting chat:",error);
        return{
            success: false,
            message: "Failed to delete chat"
        };
    }
}
