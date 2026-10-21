"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { NeonAuthUIProvider } from '@neondatabase/neon-js/auth/react';
import { authClient } from '@/lib/auth';

export function NeonAuthProvider({ children }) {
  const router = useRouter();

  return (
    <NeonAuthUIProvider
      emailOTP
      authClient={authClient}
      basePath="/auth"
      redirectTo="/"
      navigate={router.push}
      replace={router.replace}
      onSessionChange={() => router.refresh()}
      Link={Link}
    >
      {children}
    </NeonAuthUIProvider>
  );
}
