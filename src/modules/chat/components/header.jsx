import React from 'react'
import {Sun} from "lucide-react"
import { ModeToggle } from '@/components/ui/mode-toggle'

const Header = () => {
  return (
    <header className='flex h-16 w-full items-center justify-between border-b border-border bg-background px-6'>
        <div className='flex items-center gap-3'>
            <h2 className='text-lg font-semibold'>Chat</h2>
        </div>
        <div className='flex items-center gap-2'>
            <ModeToggle/>
        </div>
    </header>
  )
}

export default Header