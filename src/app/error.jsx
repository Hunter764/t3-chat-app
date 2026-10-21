"use client";

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/brand/logo';

export default function ErrorPage({ error, reset }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <Logo />
      <div className="space-y-2">
        <p className="label-mono">Error</p>
        <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          {error?.message || "An unexpected error occurred."} You can try again.
        </p>
      </div>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
