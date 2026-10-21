import React from 'react'
import { redirect } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { currentUser } from '@/modules/authentication/actions';
import { getAllChats } from '@/modules/chat/actions';
export const dynamic = 'force-dynamic';

const layout = async ({children}) => {
    const user = await currentUser();

    if(!user){
        return redirect("/auth")
    }

    const result = await getAllChats();
    const chats = result?.data || [];

    return (
      <AppShell user={user} chats={chats}>
        {children}
      </AppShell>
    )
}

export default layout
