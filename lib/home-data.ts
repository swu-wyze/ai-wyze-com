// Home accessor — reads the signed-in user from the cookie and returns
// their Home. The three demo users live in lib/users.ts.

import { getCurrentUserId } from './auth';
import { HOMES, getHomeFor } from './users';
import type { Home } from './types';

/**
 * Server-only. Reads the auth cookie and returns the signed-in user's home,
 * or Sunny's home as a fallback (so unauthenticated server-render paths
 * have data — the layout still redirects to /login in those cases).
 */
export async function getCurrentHome(): Promise<Home> {
  const userId = await getCurrentUserId();
  if (!userId) return HOMES.sunny;
  return getHomeFor(userId);
}
