import { NeonAuthProvider } from "@/components/providers/neon-auth-provider";

// The Neon Auth UI (forms, account cards) is heavy, so only these routes load it.
export default function Layout({ children }) {
  return <NeonAuthProvider>{children}</NeonAuthProvider>;
}
