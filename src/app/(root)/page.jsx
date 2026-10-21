import { currentUser } from "@/modules/authentication/actions";
import ChatMessageView from "@/modules/chat/components/chat-message-view";

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Same per-request lookup the layout already did (cached), so this costs nothing extra.
  const user = await currentUser()

  return (
    <ChatMessageView user={user ? { name: user.name } : null} />
  );
}
