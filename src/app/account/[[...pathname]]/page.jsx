"use client";

import { AccountView } from '@neondatabase/neon-js/auth/react/ui';

export default function AccountPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <AccountView />
    </div>
  );
}
