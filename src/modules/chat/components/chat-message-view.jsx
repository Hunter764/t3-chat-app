"use client" 
import React, {useState} from 'react'
import ChatWelcomeTabs from './chat-welcome-tabs';
import ChatMessageForm from './chat-message-form';

const ChatMessageView = ({user}) => {
    const [selectedMessage, setSelectedMessage] = useState("");

    const handleMessageSelect = (message)=>{
        setSelectedMessage(message);
    }
  return (
    <div className='flex h-full w-full flex-col'>
        <div className='min-h-0 flex-1 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center'>
                <ChatWelcomeTabs
                   userName={user?.name}
                   onMessageSelect={handleMessageSelect}
                />
            </div>
        </div>
        <div className='shrink-0 px-4 pb-4 sm:px-6 sm:pb-6'>
            <ChatMessageForm
                initialMessage={selectedMessage}
            />
        </div>
    </div>
  )
}

export default ChatMessageView
