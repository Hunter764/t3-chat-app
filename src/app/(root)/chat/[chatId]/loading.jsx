import { Spinner } from '@/components/ui/spinner';

// Shown instantly while the chat is loaded on the server.
export default function Loading() {
  return (
    <div className="flex h-full items-center justify-center">
      <Spinner className="size-5 text-muted-foreground" />
    </div>
  );
}
