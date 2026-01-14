"use client"
import React from 'react'
import {useState, useMemo} from "react"
import Image from "next/image"
import Link from 'next/link'


import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import{
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import UserButton from '@/modules/authentication/components/user-button';


import {cn} from "@/lib/utils";
import {SearchIcon, MenuIcon, EllipsisIcon, Trash, PlusIcon} from "lucide-react"

const ChatSidebar = ({user}) => {

    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    }

  return (
    <div className='flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border shrink-0'>
        {/* Logo Section */}
        <div className='flex items-center px-4 py-4 border-b border-sidebar-border'>
            <Image
                src={"/logo.svg"}
                alt='Logo'
                width={100}
                height={100}
                className='hover:opacity-80 transition-opacity'
            />
        </div>

        {/* New Chat Button */}
        <div className='p-3'>
            <Link href={"/"}>
                <Button 
                    className="w-full justify-start gap-2 h-10 shadow-sm"
                >
                    <PlusIcon className='h-4 w-4'/>
                    New Chat
                </Button>
            </Link>
        </div>

        {/* Search Section */}
        <div className="px-3 pb-3"> 
            <div className='relative'>
                <SearchIcon className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground'/>
                <Input 
                    placeholder="Search chats..."
                    className="pl-9 h-9 bg-sidebar-accent border-sidebar-border"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>
        </div>

        {/* Chat List */}
        <div className='flex-1 overflow-y-auto px-2'>
            <div className='flex flex-col items-center justify-center h-full text-center px-4'>
                <div className='text-muted-foreground space-y-1'>
                    <p className='text-sm font-medium'>No chats yet</p>
                    <p className='text-xs'>Start a conversation to begin</p>
                </div>
            </div>
        </div>

        {/* User Section */}
        <div className='mt-auto border-t border-sidebar-border'>
            <div className='flex items-center gap-3 p-3 transition-colors'>
                <UserButton user={user} />
                <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-sidebar-foreground truncate'>
                        {user?.name || 'User'}
                    </p>
                    <p className='text-xs text-muted-foreground truncate'>
                        {user?.email}
                    </p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ChatSidebar