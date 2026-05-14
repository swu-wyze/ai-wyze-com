// Cookie-based auth for the prototype. No hashing, no DB — usernames and
// passwords are hardcoded in lib/users.ts. Stage B: swap for real auth.

import { cookies } from 'next/headers';
import { isValidUserId } from './users';
import type { UserId } from './types';

const COOKIE_NAME = 'wyze-user';
// 7 days — long enough for the demo to feel sticky, not so long that we
// pretend to have a real session manager.
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

/** Read the signed-in user from cookies. Server-side only. */
export async function getCurrentUserId(): Promise<UserId | null> {
  const store = await cookies();
  const value = store.get(COOKIE_NAME)?.value;
  if (!value || !isValidUserId(value)) return null;
  return value;
}

export async function setSession(userId: UserId): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, userId, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
