"use client";

import { AuthView } from '@neondatabase/neon-js/auth/react/ui';

export default function AuthPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <AuthView />
    </div>
  );
}
