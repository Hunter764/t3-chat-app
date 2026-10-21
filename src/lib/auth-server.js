import { createNeonAuth } from '@neondatabase/neon-js/auth/next/server';

export const auth = createNeonAuth({
  // Neon Auth server URL. NEXT_PUBLIC_NEON_AUTH_URL is kept as a fallback for older .env files.
  baseUrl: process.env.NEON_AUTH_BASE_URL ?? process.env.NEXT_PUBLIC_NEON_AUTH_URL,
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET,
    sessionDataTtl: 900,
  },
});
