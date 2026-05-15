// Home accessor — reads the signed-in user from the cookie and returns
// their Home. The three demo users live in lib/users.ts.

import { getCurrentUserId } from './auth';
import { getHomeFor } from './users';
import { getGuestHome } from './guest-home';
import type { Home } from './types';

/**
 * Server-only. Reads the auth cookie and returns the signed-in user's home,
 * or a guest home stub for unauthenticated callers (the public landing
 * page's chat action). Auth-gated routes redirect via the (home) layout
 * before this fallback is ever hit, so this is purely the pre-auth path.
 */
export async function getCurrentHome(): Promise<Home> {
  const userId = await getCurrentUserId();
  if (!userId) return getGuestHome();
  return getHomeFor(userId);
}
