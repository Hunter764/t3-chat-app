"use client";

import { useParams } from 'next/navigation';
import { AuthView } from '@neondatabase/neon-js/auth/react/ui';
import { Logo } from '@/components/brand/logo';
import { ModeToggle } from '@/components/ui/mode-toggle';

export default function AuthPage() {
  const { pathname } = useParams();
  // /auth -> sign-in, /auth/sign-up -> sign-up, /auth/callback -> callback, ...
  const path = pathname?.at(-1) ?? 'sign-in';

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="flex h-14 items-center justify-between px-5 sm:px-8">
        <Logo />
        <ModeToggle />
      </header>
      <main className="flex flex-1 items-center justify-center px-4 pb-16">
        <AuthView path={path} />
      </main>
    </div>
  );
}
