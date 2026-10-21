import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/brand/logo';

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <Logo />
      <div className="space-y-2">
        <p className="label-mono">404</p>
        <h1 className="text-2xl font-semibold tracking-tight">This page doesn&apos;t exist</h1>
        <p className="text-sm text-muted-foreground">The link may be broken, or the page was moved.</p>
      </div>
      <Button asChild>
        <Link href="/">Back to chat</Link>
      </Button>
    </div>
  );
}
