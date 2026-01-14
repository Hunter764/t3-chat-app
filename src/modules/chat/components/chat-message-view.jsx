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
    <div className='flex flex-col h-full w-full'> 
        <div className='flex-1 overflow-y-auto'>
            <div className='flex items-center justify-center min-h-full'>
                <ChatWelcomeTabs 
                   userName={user?.name}
                   onMessageSelect={handleMessageSelect}
                />
            </div>
        </div>
        <div className='border-t border-border bg-background'>
            <ChatMessageForm 
                intialMessage={selectedMessage}
                onMessageSelect={handleMessageSelect}
            />
        </div>
    </div>
  )
}

export default ChatMessageView