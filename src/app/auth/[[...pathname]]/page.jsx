"use client";

import { useParams } from 'next/navigation';
import { AuthView } from '@neondatabase/neon-js/auth/react/ui';
import { AuthShell } from '@/components/auth/auth-shell';

// The library uses the same text for the title, the button and the footer link, so the
// serif headline is rendered separately (HEADINGS) and these stay short and link-friendly.
const LOCALIZATION = {
  SIGN_IN: 'Sign in',
  SIGN_IN_ACTION: 'Sign in',
  SIGN_UP: 'Sign up',
  SIGN_UP_ACTION: 'Create account',
};

const HEADINGS = {
  'sign-in': {
    title: 'Welcome back',
    text: 'Enter your email and password to access your account',
  },
  'sign-up': {
    title: 'Create your account',
    text: 'Start chatting with every AI model in under a minute',
  },
};

// Form sits directly on the sheet: rounded-full controls, mono labels and inputs.
const BASE_CLASS_NAMES = {
  base: 'w-full border-0 bg-transparent p-0 shadow-none',
  header: 'px-0 pb-2',
  title: 'font-serif! text-4xl! font-normal! tracking-tight',
  description: 'font-mono text-xs text-muted-foreground',
  content: 'px-0',
  footer: 'px-0 font-mono text-xs text-muted-foreground',
  footerLink: 'font-medium text-foreground underline underline-offset-4',
  separator: 'font-mono text-[11px] uppercase',
  form: {
    label: 'font-mono text-xs font-medium',
    input: 'h-10 rounded-full px-4 font-mono text-sm',
    primaryButton: 'h-10 w-full rounded-full font-mono text-sm shadow-[inset_0_-2px_0_0_rgb(0_0_0/0.22)]',
    outlineButton: 'h-10 w-full rounded-full font-mono text-sm',
    secondaryButton: 'h-10 w-full rounded-full font-mono text-sm',
    forgotPasswordLink: 'font-mono text-xs underline underline-offset-4',
  },
};

export default function AuthPage() {
  const { pathname } = useParams();
  // /auth -> sign-in, /auth/sign-up -> sign-up, /auth/callback -> callback, ...
  const path = pathname?.at(-1) ?? 'sign-in';
  const heading = HEADINGS[path];

  // Sign in / sign up get the custom headline; other views (forgot password, ...) keep
  // the library's own title, styled the same way.
  const classNames = heading
    ? { ...BASE_CLASS_NAMES, header: 'hidden' }
    : BASE_CLASS_NAMES;

  return (
    <AuthShell>
      {heading && (
        <div data-reveal className="mb-7 space-y-2">
          <h1 className="font-serif text-5xl leading-none tracking-tight">
            {heading.title.split(' ').slice(0, -1).join(' ')} <em>{heading.title.split(' ').at(-1)}.</em>
          </h1>
          <p className="font-mono text-xs text-muted-foreground">{heading.text}</p>
        </div>
      )}
      <div data-reveal>
        <AuthView path={path} localization={LOCALIZATION} classNames={classNames} />
      </div>
    </AuthShell>
  );
}
