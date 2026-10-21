"use client";

import React from 'react'
import { MenuIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { Logo } from '@/components/brand/logo'
import { useChatStore } from '../store/chat-store'

const Header = ({ chats = [], onMenu }) => {
  const activeChatId = useChatStore((state) => state.activeChatId);
  const title = chats.find((chat) => chat.id === activeChatId)?.title;

  return (
    <header className='flex h-14 w-full shrink-0 items-center justify-between gap-3 border-b border-border px-4 md:px-6'>
        <div className='flex min-w-0 items-center gap-2'>
            <Button
              variant="ghost"
              size="icon-sm"
              className="md:hidden"
              onClick={onMenu}
              aria-label="Open menu"
            >
              <MenuIcon />
            </Button>
            {title ? (
              <h2 className='truncate text-sm font-medium'>{title}</h2>
            ) : (
              <>
                <Logo className="md:hidden" />
                <h2 className='hidden text-sm font-medium text-muted-foreground md:block'>New chat</h2>
              </>
            )}
        </div>
        <ModeToggle/>
    </header>
  )
}

export default Header
