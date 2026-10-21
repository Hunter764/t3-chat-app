import ActiveChatLoader from '@/modules/messages/components/active-chat-loader';
import MessageWithForm from '@/modules/messages/components/message-with-form';
import { getChatById } from '@/modules/chat/actions';
import React from 'react'

export const dynamic = 'force-dynamic';

// The chat is read on the server, in parallel with the layout's data, so the page arrives
// with its messages instead of fetching them again after hydration.
const Page = async ({params}) => {
    const {chatId} = await params;
    const result = await getChatById(chatId);

  return (
    <>
    <ActiveChatLoader chatId={chatId}/>
    <MessageWithForm chat={result.success ? result.data : null} notFoundMessage={result.message}/>
    </>
  )
}

export default Page
