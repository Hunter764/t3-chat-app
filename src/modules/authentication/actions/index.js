"use server"

import db from "@/lib/db"
import { auth } from "@/lib/auth-server";

export const currentUser = async () => {
    try{
        const { data: session } = await auth.getSession();

        if(!session?.user?.id){
            return null;
        }
        
        const user = await db.user.findUnique({
            where:{
                id:session.user.id
            },
            select:{
                id:true,
                email:true,
                image:true,
                createdAt : true,
                updatedAt: true,

            }
        });
        return user;
    }catch(error){
        console.log("Error in currentUser action:",error);
        return null;
    }
}