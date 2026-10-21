"use client";

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { AccountView } from '@neondatabase/neon-js/auth/react/ui';
import { Logo } from '@/components/brand/logo';
import { ModeToggle } from '@/components/ui/mode-toggle';

export default function AccountPage() {
  const { pathname } = useParams();
  const path = pathname?.at(-1) ?? 'settings';

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="flex h-14 items-center justify-between border-b border-border px-5 sm:px-8">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to chat
          </Link>
          <span className="hidden h-4 w-px bg-border sm:block" />
          <Logo className="hidden sm:inline-flex" />
        </div>
        <ModeToggle />
      </header>
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6">
        <AccountView path={path} />
      </main>
    </div>
  );
}
