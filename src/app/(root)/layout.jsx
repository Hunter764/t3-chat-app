import React from 'react'
import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import { redirect } from 'next/navigation';
import ChatSidebar from '@/modules/chat/components/chat-sidebar';
import { currentUser } from '@/modules/authentication/actions';
import { getAllChates } from '@/modules/chat/actions';
import Header from '@/modules/chat/components/header';


const layout = async ({children}) => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    const user = await currentUser();

    const result = await getAllChates();
    const chats = result?.data || [];


    if(!session){
        return redirect("/sign-in")
    }
  return (
    <div className='flex h-screen overflow-hidden'>
        <ChatSidebar user={user} chats={chats}/>
        <div className='flex flex-1 flex-col overflow-hidden'>
            <Header/>
            <main className='flex-1 overflow-hidden'>
                {children}
            </main>
        </div>
    </div>
  )
}

export default layout