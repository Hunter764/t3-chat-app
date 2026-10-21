import { createAuthClient } from '@neondatabase/neon-js/auth/next';

// The Next.js client talks to this app's own /api/auth proxy (see
// src/app/api/auth/[...path]/route.js) so the session cookie is set on this origin
// and is visible to server components and route handlers.
export const authClient = createAuthClient();
