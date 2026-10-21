import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth-server';

const neonAuthProxy = auth.middleware({ loginUrl: '/auth/sign-in' });

// Protects pages and keeps the Neon Auth session fresh (also completes OAuth redirects).
export default function proxy(request) {
  // Neon's middleware only validates the session for GET requests; for anything else
  // (server actions are POSTs) it redirects to the login page. Server actions and route
  // handlers verify the user themselves via currentUser(), so only page loads go through it.
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return NextResponse.next();
  }
  return neonAuthProxy(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api|auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
